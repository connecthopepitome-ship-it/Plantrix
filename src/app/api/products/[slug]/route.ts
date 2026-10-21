import { NextRequest, NextResponse } from 'next/server';
import { getPublicProductBySlug } from '@/lib/services/productService';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Product slug parameter is required.' },
        { status: 400 }
      );
    }

    const product = await getPublicProductBySlug(slug);
    if (!product) {
      return NextResponse.json(
        { success: false, error: `Product with slug "${slug}" not found in catalogue.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: product },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=600, stale-while-revalidate=1200',
        },
      }
    );
  } catch (error: any) {
    console.error(`[API /api/products/${params?.slug}] Error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while fetching product detail.' },
      { status: 500 }
    );
  }
}
