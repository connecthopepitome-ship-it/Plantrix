import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/firebase/admin-auth';
import { ImageUploadSignSchema } from '@/lib/validation/schemas';
import { generatePresignedUploadUrl, resolveImagePublicUrl } from '@/lib/r2/client';

export async function POST(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized' },
      { status: auth.status }
    );
  }

  try {
    const body = await req.json();
    const parsed = ImageUploadSignSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid upload signature parameters.',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { fileName, contentType, productId } = parsed.data;
    const extension = fileName.split('.').pop() || 'webp';
    const key = `products/${productId}/${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}.${extension}`;

    const uploadUrl = await generatePresignedUploadUrl({
      key,
      contentType,
      expiresInSeconds: 300,
    });

    if (!uploadUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cloudflare R2 is not configured for presigned URL uploads.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        uploadUrl,
        key,
        publicUrl: resolveImagePublicUrl(key),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API /api/admin/uploads/sign] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error generating presigned upload signature.' },
      { status: 500 }
    );
  }
}
