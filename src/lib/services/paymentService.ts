/**
 * Plantrix Botanics — Payment Provider Integration & Verification Service
 * Supports Razorpay and standard payment gateways with HMAC-SHA256 signature verification.
 * Includes explicit DEV_TEST mode when credentials are unconfigured.
 */

import { Order } from '@/types/order';
import { getOrderById, updateOrderStatus } from './orderService';
import { setFirestoreDoc } from '../firebase/firestore-rest';

const PAYMENT_PROVIDER = process.env.PAYMENT_PROVIDER || 'TEST_SIMULATOR';
const PAYMENT_KEY_ID = process.env.PAYMENT_PUBLIC_KEY || '';
const PAYMENT_KEY_SECRET = process.env.PAYMENT_SECRET_KEY || '';
const PAYMENT_WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || '';

export const isPaymentConfigured = (): boolean => {
  return Boolean(PAYMENT_KEY_ID && PAYMENT_KEY_SECRET);
};

export interface PaymentSessionResult {
  provider: string;
  orderId: string;
  providerOrderId: string;
  amountPaise: number;
  currency: 'INR';
  keyId?: string;
  isTestMode: boolean;
}

/**
 * Creates a server-side payment order/session
 */
export async function createPaymentSession(order: Order): Promise<PaymentSessionResult> {
  // If Razorpay credentials configured:
  if (PAYMENT_PROVIDER.toLowerCase() === 'razorpay' && isPaymentConfigured()) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${PAYMENT_KEY_ID}:${PAYMENT_KEY_SECRET}`).toString('base64');
      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: order.totalPaise,
          currency: 'INR',
          receipt: order.orderNumber,
          notes: {
            plantrixOrderId: order.orderId,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Razorpay order creation failed: ${await res.text()}`);
      }

      const rzpOrder = await res.json();
      return {
        provider: 'razorpay',
        orderId: order.orderId,
        providerOrderId: rzpOrder.id,
        amountPaise: order.totalPaise,
        currency: 'INR',
        keyId: PAYMENT_KEY_ID,
        isTestMode: false,
      };
    } catch (error) {
      console.error('[PaymentService] Razorpay session error:', error);
      throw error;
    }
  }

  // DEV_TEST SIMULATION MODE
  // Clearly marked; does not pretend to be live production payments
  return {
    provider: 'DEV_TEST_SIMULATOR',
    orderId: order.orderId,
    providerOrderId: `sim_order_${Date.now()}`,
    amountPaise: order.totalPaise,
    currency: 'INR',
    isTestMode: true,
  };
}

/**
 * Verifies webhook HMAC SHA256 signature
 */
export async function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret = PAYMENT_WEBHOOK_SECRET
): Promise<boolean> {
  if (!secret || !signature) return false;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Convert hex signature to Uint8Array
    const sigBytes = new Uint8Array(
      signature.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    return await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      encoder.encode(rawBody)
    );
  } catch (error) {
    console.error('[PaymentService] Webhook verification error:', error);
    return false;
  }
}

/**
 * Reconciles payment and marks order as PAID
 */
export async function markOrderPaid(params: {
  orderId: string;
  providerReference: string;
  provider: string;
}): Promise<boolean> {
  const order = await getOrderById(params.orderId, undefined, true);
  if (!order) return false;

  // Prevent duplicate payment application (idempotency)
  if (order.paymentStatus === 'PAID') {
    return true;
  }

  const updated: Order = {
    ...order,
    paymentStatus: 'PAID',
    status: order.status === 'PENDING_PAYMENT' ? 'PLACED' : order.status,
    paymentProvider: params.provider,
    paymentReference: params.providerReference,
    updatedAt: new Date().toISOString(),
  };

  await setFirestoreDoc('orders', order.orderId, updated);
  return true;
}
