import { NextRequest, NextResponse } from 'next/server';
import {
  generateImportTemplateCsv,
  generateImportSampleCsv,
} from '@/lib/services/bulkImportService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'template';

  const isSample = type === 'sample';
  const csvContent = isSample ? generateImportSampleCsv() : generateImportTemplateCsv();
  const filename = isSample
    ? 'plantrix-product-import-sample.csv'
    : 'plantrix-product-import-template.csv';

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
