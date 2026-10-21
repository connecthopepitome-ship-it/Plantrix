import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/firebase/admin-auth';
import { validateImportCsv } from '@/lib/services/bulkImportService';
import { DuplicatePolicy } from '@/types/import';
import { z } from 'zod';

const ValidateRequestSchema = z.object({
  csvContent: z.string().min(1, 'CSV content is empty'),
  duplicatePolicy: z
    .enum(['CREATE_NEW', 'UPDATE_EXISTING', 'SKIP_EXISTING', 'FLAG_REVIEW'])
    .default('CREATE_NEW'),
  importAsDraftDefault: z.boolean().default(true),
  archiveFileNames: z.array(z.string()).optional(),
});

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
    const parsed = ValidateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid import parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { csvContent, duplicatePolicy, importAsDraftDefault, archiveFileNames } = parsed.data;

    const summary = await validateImportCsv(csvContent, {
      duplicatePolicy: duplicatePolicy as DuplicatePolicy,
      importAsDraftDefault,
      availableArchiveFiles: archiveFileNames || [],
    });

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (err: any) {
    console.error('[API /api/admin/imports/validate] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to validate import CSV' },
      { status: 500 }
    );
  }
}
