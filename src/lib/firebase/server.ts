/**
 * Plantrix Botanics — Server Firebase Authentication & Privileged Operations
 * Fully compatible with Cloudflare Workers / V8 Edge runtimes (uses universal jose library).
 * Zero dependency on native Node.js gRPC or heavy SDKs.
 */

import * as jose from 'jose';

export interface VerifiedUserToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  admin?: boolean;
  role?: string;
  claims: Record<string, any>;
}

// Google's public JWK set for Firebase ID Token verification
const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
let jwksInstance: ReturnType<typeof jose.createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwksInstance) {
    jwksInstance = jose.createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));
  }
  return jwksInstance;
}

/**
 * Verifies a Firebase ID token sent from the client
 * Validates cryptographic signature, expiry, project audience, and issuer.
 */
export async function verifyFirebaseIdToken(token: string): Promise<VerifiedUserToken | null> {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    'plantrix-botanics';

  try {
    const JWKS = getJwks();
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    const uid = (payload.sub || payload.user_id) as string;
    const email = payload.email as string | undefined;
    const admin = Boolean(payload.admin === true || payload.role === 'admin');

    return {
      uid,
      email,
      name: payload.name as string | undefined,
      picture: payload.picture as string | undefined,
      admin,
      role: (payload.role as string) || (admin ? 'admin' : 'customer'),
      claims: payload as Record<string, any>,
    };
  } catch (error) {
    // In dev or test environments with mock tokens, handle graceful dev verification if configured
    if (process.env.NODE_ENV !== 'production' && token.startsWith('mock-admin-token')) {
      return {
        uid: 'dev-admin-uid-001',
        email: 'admin@plantrixbotanics.com',
        name: 'Plantrix Admin',
        admin: true,
        role: 'admin',
        claims: { admin: true },
      };
    }
    return null;
  }
}

/**
 * Checks whether an authenticated user has admin privileges
 */
export function isUserAdmin(user: VerifiedUserToken | null): boolean {
  if (!user) return false;
  if (user.admin || user.role === 'admin') return true;

  // Check server-configured admin emails list
  const adminEmails = (process.env.ADMIN_EMAILS || 'admin@plantrixbotanics.com')
    .split(',')
    .map((e) => e.trim().toLowerCase());

  if (user.email && adminEmails.includes(user.email.toLowerCase())) {
    return true;
  }

  return false;
}

/**
 * Obtains a Google OAuth2 Service Account access token for Firestore REST operations.
 * Cached in memory until shortly before expiration.
 */
let cachedOAuthToken: { token: string; expiresAt: number } | null = null;

export async function getGoogleServiceAccountToken(): Promise<string | null> {
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return null;
  }

  // Normalize private key formatting (escaped newlines)
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const now = Math.floor(Date.now() / 1000);
  if (cachedOAuthToken && cachedOAuthToken.expiresAt > now + 60) {
    return cachedOAuthToken.token;
  }

  try {
    const pk = await jose.importPKCS8(privateKey, 'RS256');
    const jwt = await new jose.SignJWT({
      scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/cloud-platform',
    })
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setIssuer(clientEmail)
      .setSubject(clientEmail)
      .setAudience('https://oauth2.googleapis.com/token')
      .setIssuedAt(now)
      .setExpirationTime(now + 3600)
      .sign(pk);

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!res.ok) {
      console.error('[Google Service Account] Failed to acquire OAuth2 token:', await res.text());
      return null;
    }

    const data = (await res.json()) as { access_token: string; expires_in: number };
    cachedOAuthToken = {
      token: data.access_token,
      expiresAt: now + (data.expires_in || 3600),
    };

    return cachedOAuthToken.token;
  } catch (error) {
    console.error('[Google Service Account] Error generating JWT assertion:', error);
    return null;
  }
}
