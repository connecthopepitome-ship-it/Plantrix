import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/firebase/admin-auth';
import {
  getInternalProductById,
  updateProduct,
  archiveProduct,
} from '@/lib/services/productService';
import { ProductUpdateSchema } from '@/lib/validation/schemas';

export async function GET(
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

  const product = await getInternalProductById(params.id);
  if (!product) {
    return NextResponse.json(
      { success: false, error: 'Product not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: product }, { status: 200 });
}

export async function PATCH(
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

  try {
    const body = await req.json();
    const parsed = ProductUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed for product update.',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const updated = await updateProduct(params.id, parsed.data as any);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    console.error(`[API /api/admin/products/${params.id}] PATCH Error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal error while updating product.' },
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

  try {
    const success = await archiveProduct(params.id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Product archived and marked as discontinued.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`[API /api/admin/products/${params.id}] DELETE Error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal error while archiving product.' },
      { status: 500 }
    );
  }
}
