import { NextRequest, NextResponse } from 'next/server';
import { getPublicProducts, PublicProductQueryFilters } from '@/lib/services/productService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filters: PublicProductQueryFilters = {
      department: searchParams.get('department') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      trending: searchParams.get('trending') === 'true' ? true : undefined,
      newArrival: searchParams.get('newArrival') === 'true' ? true : undefined,
      search: searchParams.get('q') || searchParams.get('search') || undefined,
      sort: (searchParams.get('sort') as any) || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 20,
    };

    if (searchParams.get('minPricePaise')) {
      filters.minPricePaise = parseInt(searchParams.get('minPricePaise')!, 10);
    }
    if (searchParams.get('maxPricePaise')) {
      filters.maxPricePaise = parseInt(searchParams.get('maxPricePaise')!, 10);
    }

    const result = await getPublicProducts(filters);

    return NextResponse.json(
      {
        success: true,
        data: result.products,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: any) {
    console.error('[API /api/products] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while retrieving product catalogue.' },
      { status: 500 }
    );
  }
}
