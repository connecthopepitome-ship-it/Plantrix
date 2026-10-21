import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/firebase/admin-auth';
import {
  executeImportJob,
  getImportJobs,
} from '@/lib/services/bulkImportService';
import { DuplicatePolicy, ValidatedImportRow } from '@/types/import';
import { z } from 'zod';

const ExecuteImportSchema = z.object({
  rows: z.array(z.any()).min(1, 'No rows provided for import'),
  duplicatePolicy: z
    .enum(['CREATE_NEW', 'UPDATE_EXISTING', 'SKIP_EXISTING', 'FLAG_REVIEW'])
    .default('CREATE_NEW'),
  isDryRun: z.boolean().default(false),
  importAsDraftDefault: z.boolean().default(true),
  fileName: z.string().default('import.csv'),
  fileSizeBytes: z.number().optional(),
  imagePayloads: z
    .record(
      z.string(),
      z.object({
        base64: z.string(),
        contentType: z.string(),
      })
    )
    .optional(),
});

export async function GET(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized' },
      { status: auth.status }
    );
  }

  try {
    const jobs = await getImportJobs(25);
    return NextResponse.json({
      success: true,
      data: jobs,
    });
  } catch (err: any) {
    console.error('[API /api/admin/imports GET] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve import jobs history' },
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
    const parsed = ExecuteImportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid execution parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      rows,
      duplicatePolicy,
      isDryRun,
      importAsDraftDefault,
      fileName,
      fileSizeBytes,
      imagePayloads,
    } = parsed.data;

    // Convert base64 image map into Uint8Array buffers
    let imageBinaries: Record<string, { buffer: Uint8Array; contentType: string }> | undefined;
    if (imagePayloads && Object.keys(imagePayloads).length > 0) {
      imageBinaries = {};
      for (const [key, val] of Object.entries(imagePayloads)) {
        try {
          const binaryStr = atob(val.base64);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          imageBinaries[key] = {
            buffer: bytes,
            contentType: val.contentType,
          };
        } catch {
          // Skip corrupt image binary
        }
      }
    }

    const jobRecord = await executeImportJob({
      rows: rows as ValidatedImportRow[],
      duplicatePolicy: duplicatePolicy as DuplicatePolicy,
      isDryRun,
      importAsDraftDefault,
      initiatingAdminId: auth.user?.uid || 'admin-user',
      fileName,
      fileSizeBytes,
      imageBinaries,
    });

    return NextResponse.json({
      success: true,
      data: jobRecord,
    });
  } catch (err: any) {
    console.error('[API /api/admin/imports POST] Error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to execute import job' },
      { status: 500 }
    );
  }
}
