import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/services/orderService';
import { createPaymentSession } from '@/lib/services/paymentService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = body?.orderId;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required to initiate payment intent.' },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId, undefined, true);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found.' },
        { status: 404 }
      );
    }

    if (order.paymentStatus === 'PAID') {
      return NextResponse.json(
        { success: false, error: 'Order has already been paid in full.' },
        { status: 400 }
      );
    }

    const session = await createPaymentSession(order);

    return NextResponse.json(
      { success: true, data: session },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API /api/payments/create-intent] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment initiation failure.' },
      { status: 500 }
    );
  }
}
