import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/firebase/admin-auth';
import { runR2ProductionTest } from '@/lib/services/r2DiagnosticsService';

export async function POST(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized diagnostic request' },
      { status: auth.status }
    );
  }

  try {
    const report = await runR2ProductionTest();
    return NextResponse.json(
      {
        success: report.overallStatus === 'PASS',
        report,
      },
      { status: report.overallStatus === 'PASS' ? 200 : 500 }
    );
  } catch (err: any) {
    console.error('[API /api/admin/diagnostics/r2-test] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal diagnostic runner failure' },
      { status: 500 }
    );
  }
}
