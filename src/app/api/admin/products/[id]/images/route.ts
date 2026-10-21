import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/firebase/admin-auth';
import {
  addProductImageKey,
  removeProductImageKey,
  getInternalProductById,
} from '@/lib/services/productService';
import {
  uploadToR2,
  deleteFromR2,
  resolveImagePublicUrl,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from '@/lib/r2/client';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized' },
      { status: auth.status }
    );
  }

  const productId = params.id;
  const product = await getInternalProductById(productId);
  if (!product) {
    return NextResponse.json(
      { success: false, error: 'Product not found.' },
      { status: 404 }
    );
  }

  try {
    const contentTypeHeader = req.headers.get('content-type') || '';

    // Approach A: Direct binary file upload via multipart/form-data
    if (contentTypeHeader.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No image file found in form data.' },
          { status: 400 }
        );
      }

      if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid file type "${file.type}". Permitted: ${ALLOWED_IMAGE_MIME_TYPES.join(', ')}`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return NextResponse.json(
          { success: false, error: 'Image exceeds maximum 5MB size limit.' },
          { status: 400 }
        );
      }

      const extension = file.name.split('.').pop() || 'webp';
      const key = `products/${productId}/${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}.${extension}`;
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);

      const uploaded = await uploadToR2({
        key,
        body: uint8,
        contentType: file.type,
      });

      if (!uploaded) {
        return NextResponse.json(
          { success: false, error: 'Failed to upload image to R2 storage.' },
          { status: 500 }
        );
      }

      const updated = await addProductImageKey(productId, uploaded.key);
      return NextResponse.json(
        {
          success: true,
          key: uploaded.key,
          publicUrl: uploaded.publicUrl,
          product: updated,
        },
        { status: 201 }
      );
    }

    // Approach B: JSON body registering an existing/presigned R2 key
    const body = await req.json();
    const imageKey = body?.imageKey;
    if (!imageKey || typeof imageKey !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing required imageKey string in request body.' },
        { status: 400 }
      );
    }

    const updated = await addProductImageKey(productId, imageKey);
    return NextResponse.json(
      {
        success: true,
        key: imageKey,
        publicUrl: resolveImagePublicUrl(imageKey),
        product: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`[API /api/admin/products/${params.id}/images] POST Error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload or link product image.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized' },
      { status: auth.status }
    );
  }

  const productId = params.id;
  try {
    const body = await req.json();
    const imageKey = body?.imageKey;

    if (!imageKey) {
      return NextResponse.json(
        { success: false, error: 'imageKey is required in request body.' },
        { status: 400 }
      );
    }

    // Remove from product record
    const updated = await removeProductImageKey(productId, imageKey);

    // Delete object from R2 if not an external URL
    if (!imageKey.startsWith('http://') && !imageKey.startsWith('https://')) {
      await deleteFromR2(imageKey);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Image removed from product gallery and R2 storage.',
        product: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`[API /api/admin/products/${params.id}/images] DELETE Error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal error while deleting product image.' },
      { status: 500 }
    );
  }
}
