import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/firebase/admin-auth';
import { getAdminProducts, createProduct } from '@/lib/services/productService';
import { ProductCreateSchema } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized' },
      { status: auth.status }
    );
  }

  try {
    const products = await getAdminProducts();
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error: any) {
    console.error('[API /api/admin/products] GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve administrative catalogue.' },
      { status: 500 }
    );
  }
}

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
    const parsed = ProductCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed for product creation.',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const created = await createProduct(parsed.data as any);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    console.error('[API /api/admin/products] POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error while creating product.' },
      { status: 500 }
    );
  }
}
