import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/firebase/admin-auth';
import { createShipmentForOrder } from '@/lib/services/shippingService';
import { queryFirestoreCollection } from '@/lib/firebase/firestore-rest';
import { Shipment } from '@/types/shipment';
import { z } from 'zod';

const CreateShipmentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  courierPartner: z.string().min(1).default('Blue Dart Express'),
  trackingNumber: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized' },
      { status: auth.status }
    );
  }

  try {
    const { documents } = await queryFirestoreCollection<Shipment>('shipments', {
      pageSize: 100,
    });
    return NextResponse.json({ success: true, data: documents }, { status: 200 });
  } catch (error: any) {
    console.error('[API /api/admin/shipments] GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve shipments.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Unauthorized' },
      { status: auth.status }
    );
  }

  try {
    const body = await req.json();
    const parsed = CreateShipmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid shipment creation payload.',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { shipment, error } = await createShipmentForOrder(parsed.data);
    if (error || !shipment) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to dispatch shipment.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: shipment }, { status: 201 });
  } catch (error: any) {
    console.error('[API /api/admin/shipments] POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal error generating shipment.' },
      { status: 500 }
    );
  }
}
