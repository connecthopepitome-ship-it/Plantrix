import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, markOrderPaid } from '@/lib/services/paymentService';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get('x-razorpay-signature') ||
      req.headers.get('x-signature') ||
      '';

    // Verify webhook signature if secret configured
    if (process.env.PAYMENT_WEBHOOK_SECRET) {
      const isValid = await verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        console.warn('[Webhook /api/payments/webhook] Invalid signature rejected.');
        return NextResponse.json(
          { success: false, error: 'Invalid HMAC signature.' },
          { status: 401 }
        );
      }
    }

    const event = JSON.parse(rawBody);

    // Razorpay payment.captured or order.paid
    if (
      event.event === 'payment.captured' ||
      event.event === 'order.paid'
    ) {
      const payment = event.payload?.payment?.entity;
      const orderId = payment?.notes?.plantrixOrderId;
      const paymentId = payment?.id;

      if (orderId && paymentId) {
        await markOrderPaid({
          orderId,
          providerReference: paymentId,
          provider: 'razorpay',
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('[API /api/payments/webhook] Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal webhook reconciliation error.' },
      { status: 500 }
    );
  }
}
