import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseIdToken } from '@/lib/firebase/server';
import { getCustomerOrders } from '@/lib/services/orderService';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication token required.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7).trim();
    const verified = await verifyFirebaseIdToken(token);
    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session token.' },
        { status: 401 }
      );
    }

    const orders = await getCustomerOrders(verified.uid);

    return NextResponse.json(
      { success: true, data: orders },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API /api/account/orders] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while retrieving customer orders.' },
      { status: 500 }
    );
  }
}
