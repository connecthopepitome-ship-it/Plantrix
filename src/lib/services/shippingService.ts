/**
 * Plantrix Botanics — Shipping & Logistics Service
 * Indian courier logistics, delivery timeline calculation, and order dispatch tracking.
 */

import { Shipment, ShipmentStatus } from '@/types/shipment';
import { getOrderById, updateOrderStatus } from './orderService';
import { setFirestoreDoc, getFirestoreDoc, queryFirestoreCollection } from '../firebase/firestore-rest';

const SHIPMENTS_COLLECTION = 'shipments';

export interface ServiceabilityResult {
  pincode: string;
  serviceable: boolean;
  courierPartner: string;
  estimatedDays: number;
  estimatedDeliveryDate: string;
  codAvailable: boolean;
  message: string;
}

/**
 * Checks PIN-code serviceability and calculates transit conditioning time
 */
export async function checkPincodeServiceability(
  pincode: string
): Promise<ServiceabilityResult> {
  const cleanPin = pincode.trim();
  if (!/^\d{6}$/.test(cleanPin)) {
    return {
      pincode: cleanPin,
      serviceable: false,
      courierPartner: 'None',
      estimatedDays: 0,
      estimatedDeliveryDate: '',
      codAvailable: false,
      message: 'Invalid Indian PIN code format (must be 6 numeric digits).',
    };
  }

  // Calculate estimated transit date (2-4 business days from Bengaluru Hub)
  const days = 3;
  const delivDate = new Date();
  delivDate.setDate(delivDate.getDate() + days);
  const dateFormatted = delivDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return {
    pincode: cleanPin,
    serviceable: true,
    courierPartner: 'Blue Dart Air Express / Delhivery',
    estimatedDays: days,
    estimatedDeliveryDate: dateFormatted,
    codAvailable: true,
    message: `Express dispatch to PIN ${cleanPin} serviceable via Air Priority.`,
  };
}

/**
 * Creates a Shipment record for an order and links tracking
 */
export async function createShipmentForOrder(params: {
  orderId: string;
  courierPartner: string;
  trackingNumber?: string;
}): Promise<{ shipment?: Shipment; error?: string }> {
  const order = await getOrderById(params.orderId, undefined, true);
  if (!order) {
    return { error: 'Order not found' };
  }

  const shipmentId = `ship-${Date.now()}`;
  const now = new Date().toISOString();
  const trackNum =
    params.trackingNumber || `BLR${Math.floor(10000000 + Math.random() * 90000000)}IN`;
  const trackingUrl = `https://track.bluedart.com/tracking?ref=${trackNum}`;

  const shipment: Shipment = {
    shipmentId,
    orderId: order.orderId,
    orderNumber: order.orderNumber,
    customerName: order.customer.name,
    customerPhone: order.customer.phone,
    shippingAddress: order.shippingAddress,
    items: order.items.map((i) => ({
      productId: i.productId,
      sku: i.sku,
      name: i.nameSnapshot,
      quantity: i.quantity,
    })),
    provider: 'BLUEDART',
    carrierName: params.courierPartner || 'Blue Dart Express',
    serviceType: 'AIR_EXPRESS',
    awbCode: trackNum,
    status: 'BOOKED',
    weightGrams: 1400,
    dimensionsCm: {
      length: 20,
      width: 20,
      height: 20,
    },
    expectedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    trackingEvents: [
      {
        eventId: `evt-${Date.now()}`,
        timestamp: now,
        status: 'BOOKED',
        statusLabel: 'Manifest Created',
        location: 'IN-BLR-01 Bengaluru Hub',
        description: 'Specimen conditioned, packaged in shockproof molded pulp, and manifesting generated.',
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  await setFirestoreDoc(SHIPMENTS_COLLECTION, shipmentId, shipment);

  // Advance order status to SHIPPED and link tracking details
  await updateOrderStatus(order.orderId, 'SHIPPED');

  return { shipment };
}

/**
 * Retrieves shipment by ID
 */
export async function getShipmentById(shipmentId: string): Promise<Shipment | null> {
  try {
    return await getFirestoreDoc<Shipment>(SHIPMENTS_COLLECTION, shipmentId);
  } catch {
    return null;
  }
}
