import { NextRequest, NextResponse } from 'next/server';
import { DEPARTMENTS } from '@/types/category';
import { INITIAL_TAXONOMY } from '@/data/taxonomy';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentFilter = searchParams.get('department');

    let categories = INITIAL_TAXONOMY.filter((c) => c.active);
    if (departmentFilter) {
      categories = categories.filter(
        (c) => c.departmentId.toLowerCase() === departmentFilter.toLowerCase()
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          departments: Object.values(DEPARTMENTS),
          categories,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error: any) {
    console.error('[API /api/categories] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while retrieving categories.' },
      { status: 500 }
    );
  }
}
