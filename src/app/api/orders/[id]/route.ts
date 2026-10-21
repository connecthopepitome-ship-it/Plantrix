import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/services/orderService';
import { verifyFirebaseIdToken, isUserAdmin } from '@/lib/firebase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params?.id;
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID parameter is required.' },
        { status: 400 }
      );
    }

    // Identify user token if provided
    let requestUid: string | undefined = undefined;
    let isAdmin = false;

    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const verified = await verifyFirebaseIdToken(token);
      if (verified) {
        requestUid = verified.uid;
        isAdmin = isUserAdmin(verified);
      }
    }

    const order = await getOrderById(orderId, requestUid, isAdmin);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found or unauthorized.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: order },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`[API /api/orders/${params?.id}] Error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while retrieving order record.' },
      { status: 500 }
    );
  }
}
