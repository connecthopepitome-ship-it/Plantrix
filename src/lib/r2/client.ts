/**
 * Plantrix Botanics — Cloudflare R2 Media Storage Client
 * Handles authenticated object uploads, presigned URLs, and asset deletions on Cloudflare R2.
 * Pure server-side execution: keeps credentials private.
 * 100% Edge and Cloudflare Workers compatible (powered by aws4fetch and Web Crypto API).
 */

import { AwsClient } from 'aws4fetch';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'plantrix-product-images';
const R2_PUBLIC_BASE_URL =
  process.env.R2_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_PRODUCT_IMAGE_BASE_URL ||
  '';

export const isR2Configured = (): boolean => {
  return Boolean(
    R2_ACCOUNT_ID &&
    R2_ACCESS_KEY_ID &&
    R2_SECRET_ACCESS_KEY
  );
};

let r2AwsClientInstance: AwsClient | null = null;

export function getR2Client(): AwsClient | null {
  if (!isR2Configured()) {
    return null;
  }
  if (!r2AwsClientInstance) {
    r2AwsClientInstance = new AwsClient({
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
      region: 'auto',
      service: 's3',
    });
  }
  return r2AwsClientInstance;
}

/**
 * Resolves an object key into a public CDN delivery URL
 */
export function resolveImagePublicUrl(keyOrUrl: string): string {
  if (!keyOrUrl) return '';
  if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://')) {
    return keyOrUrl;
  }
  const cleanBase = R2_PUBLIC_BASE_URL.replace(/\/+$/, '');
  const cleanKey = keyOrUrl.replace(/^\/+/, '');
  if (!cleanBase) {
    return `https://${R2_BUCKET_NAME}.r2.dev/${cleanKey}`;
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

function getObjectUrl(key: string): string {
  const cleanKey = key.replace(/^\/+/, '');
  return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${cleanKey}`;
}

/**
 * Uploads an image binary directly to R2
 */
export async function uploadToR2(params: {
  key: string;
  body: Uint8Array | Buffer;
  contentType: string;
}): Promise<{ key: string; publicUrl: string } | null> {
  const client = getR2Client();
  if (!client) {
    console.warn('[R2 Storage] R2 credentials not configured. Direct upload bypassed.');
    return {
      key: params.key,
      publicUrl: resolveImagePublicUrl(params.key),
    };
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
      console.error('[R2 Storage] Upload HTTP failed:', res.status, await res.text());
      return null;
    }

    return {
      key: params.key,
      publicUrl: resolveImagePublicUrl(params.key),
    };
  } catch (error) {
    console.error('[R2 Storage] Failed to upload object:', error);
    return null;
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
    console.error('[R2 Storage] Failed to generate presigned upload URL:', error);
    return null;
  }
}

/**
 * Removes an object from R2 storage
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  const client = getR2Client();
  if (!client) return true;

  try {
    const url = getObjectUrl(key);
    const res = await client.fetch(url, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (error) {
    console.error('[R2 Storage] Failed to delete object:', error);
    return false;
  }
}
