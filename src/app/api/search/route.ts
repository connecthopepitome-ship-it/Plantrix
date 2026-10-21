import { NextRequest, NextResponse } from 'next/server';
import { getPublicProducts } from '@/lib/services/productService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '8', 10)));

    if (!q.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
        query: '',
      });
    }

    const { products } = await getPublicProducts({
      search: q,
      limit,
    });

    return NextResponse.json(
      {
        success: true,
        data: products,
        query: q,
        count: products.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=120, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('[API /api/search] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while searching catalogue.' },
      { status: 500 }
    );
  }
}
