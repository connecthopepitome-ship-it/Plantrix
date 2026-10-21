import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/firebase/admin-auth';
import { getAdminOrders } from '@/lib/services/orderService';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized' },
      { status: auth.status }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get('status') as any) || undefined;
    const paymentStatus = (searchParams.get('paymentStatus') as any) || undefined;

    const orders = await getAdminOrders({ status, paymentStatus });
    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error: any) {
    console.error('[API /api/admin/orders] GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve administrative orders.' },
      { status: 500 }
    );
  }
}
