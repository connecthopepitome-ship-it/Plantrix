import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/firebase/admin-auth';
import { getImportJobById } from '@/lib/services/bulkImportService';

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

  const job = await getImportJobById(params.id);
  if (!job) {
    return NextResponse.json(
      { success: false, error: 'Import job not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: job,
  });
}
