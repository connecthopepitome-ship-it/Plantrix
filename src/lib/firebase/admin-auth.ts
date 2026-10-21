/**
 * Plantrix Botanics — Admin Authorization Guard
 * Protects privileged backend routes against unauthorized execution.
 */

import { NextRequest } from 'next/server';
import { verifyFirebaseIdToken, isUserAdmin, VerifiedUserToken } from './server';

export interface AdminAuthResult {
  authorized: boolean;
  user?: VerifiedUserToken;
  error?: string;
  status: number;
}

/**
 * Extracts and verifies bearer token from incoming request.
 * Enforces admin role check.
 */
export async function verifyAdminRequest(
  req: Request | NextRequest
): Promise<AdminAuthResult> {
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else {
    // Check cookie fallback if set
    const cookieHeader = req.headers.get('cookie') || '';
    const match = cookieHeader.match(/plantrix_admin_token=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  // Also check custom admin api key for automated background operations if configured
  const apiKey = req.headers.get('x-plantrix-admin-key');
  if (
    process.env.ADMIN_API_KEY &&
    apiKey &&
    apiKey === process.env.ADMIN_API_KEY
  ) {
    return {
      authorized: true,
      user: {
        uid: 'system-admin-api-key',
        email: 'system@plantrixbotanics.com',
        admin: true,
        role: 'admin',
        claims: { admin: true },
      },
      status: 200,
    };
  }

  if (!token) {
    // In local non-production development without Firebase credentials, allow bypass only if explicitly enabled
    if (
      process.env.NODE_ENV !== 'production' &&
      req.headers.get('x-dev-admin') === 'true'
    ) {
      return {
        authorized: true,
        user: {
          uid: 'dev-admin-override',
          email: 'admin@plantrixbotanics.com',
          admin: true,
          role: 'admin',
          claims: { admin: true },
        },
        status: 200,
      };
    }

    return {
      authorized: false,
      error: 'Missing Authorization Bearer token',
      status: 401,
    };
  }

  const verified = await verifyFirebaseIdToken(token);
  if (!verified) {
    return {
      authorized: false,
      error: 'Invalid, expired, or unverified Firebase authentication token',
      status: 401,
    };
  }

  if (!isUserAdmin(verified)) {
    return {
      authorized: false,
      error: 'Forbidden: User does not possess verified administrator privileges',
      status: 403,
    };
  }

  return {
    authorized: true,
    user: verified,
    status: 200,
  };
}
