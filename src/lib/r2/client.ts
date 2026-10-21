/**
 * Plantrix Botanics — Cloudflare R2 Media Storage Client
 * Handles authenticated object uploads, read-back, metadata checks,
 * presigned URLs, and asset deletions on Cloudflare R2.
 * Pure server-side execution: keeps credentials private.
 * 100% Edge and Cloudflare Workers compatible (powered by aws4fetch and Web Crypto API).
 */

import { AwsClient } from 'aws4fetch';

/**
 * Dynamically resolves R2 configuration from environment variables on each call.
 * This guarantees runtime resolution inside Cloudflare Workers without relying on module-load caching.
 */
export function getR2Config() {
  const accountId =
    process.env.R2_ACCOUNT_ID ||
    process.env.CLOUDFLARE_ACCOUNT_ID ||
    '';
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
  const bucketName = process.env.R2_BUCKET_NAME || 'plantrix-product-images';
  const publicBaseUrl =
    process.env.R2_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_PRODUCT_IMAGE_BASE_URL ||
    '';

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicBaseUrl,
  };
}

/**
 * Checks if R2 required credentials and account identifiers are present.
 */
export const isR2Configured = (): boolean => {
  const cfg = getR2Config();
  return Boolean(cfg.accountId && cfg.accessKeyId && cfg.secretAccessKey && cfg.bucketName);
};

/**
 * Constructs an authenticated AwsClient instance for R2 S3 API calls.
 */
export function getR2Client(): AwsClient | null {
  const cfg = getR2Config();
  if (!isR2Configured()) {
    return null;
  }
  return new AwsClient({
    accessKeyId: cfg.accessKeyId,
    secretAccessKey: cfg.secretAccessKey,
    region: 'auto',
    service: 's3',
  });
}

/**
 * Resolves an object key into a public CDN delivery URL if configured.
 * Note: If no public domain is configured, returns empty or fallback R2 dev URL.
 */
export function resolveImagePublicUrl(keyOrUrl: string): string {
  if (!keyOrUrl) return '';
  if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://')) {
    return keyOrUrl;
  }
  const cfg = getR2Config();
  const cleanBase = cfg.publicBaseUrl.replace(/\/+$/, '');
  const cleanKey = keyOrUrl.replace(/^\/+/, '');
  if (!cleanBase) {
    return cleanKey;
  }
  return `${cleanBase}/${cleanKey}`;
}

/**
 * Permitted image MIME types for product gallery
 */
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/webp',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/avif',
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Constructs the internal S3 API endpoint URL for an R2 object
 */
export function getObjectUrl(key: string): string {
  const cfg = getR2Config();
  const cleanKey = key.replace(/^\/+/, '');
  return `https://${cfg.accountId}.r2.cloudflarestorage.com/${cfg.bucketName}/${cleanKey}`;
}

/**
 * Uploads an image binary directly to Cloudflare R2
 * Fails explicitly if R2 is not configured or if upload fails.
 */
export async function uploadToR2(params: {
  key: string;
  body: Uint8Array | Buffer;
  contentType: string;
}): Promise<{ key: string; publicUrl: string; httpStatus: number } | null> {
  const client = getR2Client();
  if (!client) {
    console.error('[R2 Storage] Operation rejected: R2 credentials or account ID are not configured.');
    return null;
  }

  try {
    const url = getObjectUrl(params.key);
    const res = await client.fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': params.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      body: params.body as BodyInit,
    });

    if (!res.ok) {
      console.error('[R2 Storage] Upload failed with HTTP status:', res.status);
      return null;
    }

    return {
      key: params.key,
      publicUrl: resolveImagePublicUrl(params.key),
      httpStatus: res.status,
    };
  } catch (error) {
    console.error('[R2 Storage] Network/Signing exception during upload');
    return null;
  }
}

/**
 * Reads back an object directly from Cloudflare R2 via authenticated SigV4 GET request
 */
export async function getObjectFromR2(key: string): Promise<{
  body: Uint8Array;
  contentType: string;
  contentLength: number;
  httpStatus: number;
  etag?: string;
} | null> {
  const client = getR2Client();
  if (!client) {
    console.error('[R2 Storage] Operation rejected: R2 credentials or account ID are not configured.');
    return null;
  }

  try {
    const url = getObjectUrl(key);
    const res = await client.fetch(url, { method: 'GET' });
    if (!res.ok) {
      if (res.status !== 404) {
        console.error('[R2 Storage] Read failed with HTTP status:', res.status);
      }
      return null;
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const contentLength = Number(res.headers.get('content-length') || buffer.byteLength);
    const etag = res.headers.get('etag') || undefined;

    return {
      body: new Uint8Array(buffer),
      contentType,
      contentLength,
      httpStatus: res.status,
      etag,
    };
  } catch (error) {
    console.error('[R2 Storage] Network/Signing exception during read');
    return null;
  }
}

/**
 * Checks if an object exists in Cloudflare R2 and returns its metadata via SigV4 HEAD request
 */
export async function headObjectFromR2(key: string): Promise<{
  exists: boolean;
  httpStatus: number;
  contentType?: string;
  contentLength?: number;
  etag?: string;
}> {
  const client = getR2Client();
  if (!client) {
    return { exists: false, httpStatus: 500 };
  }

  try {
    const url = getObjectUrl(key);
    const res = await client.fetch(url, { method: 'HEAD' });
    if (res.status === 404) {
      return { exists: false, httpStatus: 404 };
    }
    if (!res.ok) {
      return { exists: false, httpStatus: res.status };
    }

    return {
      exists: true,
      httpStatus: res.status,
      contentType: res.headers.get('content-type') || undefined,
      contentLength: Number(res.headers.get('content-length') || 0),
      etag: res.headers.get('etag') || undefined,
    };
  } catch (error) {
    console.error('[R2 Storage] Network/Signing exception during HEAD check');
    return { exists: false, httpStatus: 500 };
  }
}

/**
 * Generates a short-lived presigned upload URL for direct client-to-R2 uploads
 */
export async function generatePresignedUploadUrl(params: {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<string | null> {
  const client = getR2Client();
  if (!client) return null;

  try {
    const url = getObjectUrl(params.key);
    const signedRequest = await client.sign(url, {
      method: 'PUT',
      headers: {
        'Content-Type': params.contentType,
      },
      aws: {
        signQuery: true,
      },
    });

    return signedRequest.url;
  } catch (error) {
    console.error('[R2 Storage] Failed to generate presigned upload URL');
    return null;
  }
}

/**
 * Removes an object from Cloudflare R2 storage
 * Fails explicitly if R2 is not configured or if deletion fails.
 */
export async function deleteFromR2(key: string): Promise<{ success: boolean; httpStatus: number }> {
  const client = getR2Client();
  if (!client) {
    console.error('[R2 Storage] Operation rejected: R2 credentials or account ID are not configured.');
    return { success: false, httpStatus: 500 };
  }

  try {
    const url = getObjectUrl(key);
    const res = await client.fetch(url, {
      method: 'DELETE',
    });
    return { success: res.ok, httpStatus: res.status };
  } catch (error) {
    console.error('[R2 Storage] Network/Signing exception during deletion');
    return { success: false, httpStatus: 500 };
  }
}
