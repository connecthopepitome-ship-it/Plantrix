import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/firebase/admin-auth';
import { getOrderById, updateOrderStatus } from '@/lib/services/orderService';
import { z } from 'zod';

const OrderStatusUpdateSchema = z.object({
  status: z.enum([
    'PENDING_PAYMENT',
    'PLACED',
    'CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'DELIVERED',
    'CANCEL_REQUESTED',
    'CANCELLED',
    'RETURN_REQUESTED',
    'RETURNED',
    'REFUND_PENDING',
    'REFUNDED',
  ]),
  note: z.string().optional(),
});

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

  const order = await getOrderById(params.id, undefined, true);
  if (!order) {
    return NextResponse.json(
      { success: false, error: 'Order not found.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: order }, { status: 200 });
}

export async function PATCH(
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

  try {
    const body = await req.json();
    const parsed = OrderStatusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid order status update payload.',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { order, error } = await updateOrderStatus(
      params.id,
      parsed.data.status,
      parsed.data.note
    );

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to update order status.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error: any) {
    console.error(`[API /api/admin/orders/${params.id}] PATCH Error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal error updating order status.' },
      { status: 500 }
    );
  }
}
