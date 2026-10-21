import { NextRequest, NextResponse } from 'next/server';
import { CheckoutRequestSchema } from '@/lib/validation/schemas';
import { createOrder } from '@/lib/services/orderService';
import { createPaymentSession } from '@/lib/services/paymentService';
import { verifyFirebaseIdToken } from '@/lib/firebase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid checkout data submitted.',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    // Optional customer token authentication
    let customerUid: string | undefined = undefined;
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const verified = await verifyFirebaseIdToken(token);
      if (verified) {
        customerUid = verified.uid;
      }
    }

    const { customer, shippingAddress, items, paymentMethod, customerNotes } = parsed.data;

    // Execute order creation with inventory reservation
    const { order, error } = await createOrder({
      customer,
      shippingAddress,
      items,
      paymentMethod,
      customerUid,
      customerNotes,
    });

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to place order.' },
        { status: 422 }
      );
    }

    // If online payment method selected, initialize payment intent/session
    let paymentSession = null;
    if (order.paymentMethod === 'ONLINE') {
      try {
        paymentSession = await createPaymentSession(order);
      } catch (payErr: any) {
        console.error('[API /api/checkout] Payment initialization warning:', payErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        order,
        paymentSession,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API /api/checkout] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing checkout.' },
      { status: 500 }
    );
  }
}
