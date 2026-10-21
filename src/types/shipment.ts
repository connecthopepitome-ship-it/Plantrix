/**
 * Plantrix Botanics — Shipment Data Definitions & Logistics Schema
 * Complies with docs/DATA_MODEL.md & Operational Logistics Requirements
 */

import { ShippingAddress } from './order';

export type ShipmentStatus =
  | 'AWAITING_SHIPMENT'
  | 'READY_TO_DISPATCH'
  | 'BOOKED'
  | 'PICKUP_PENDING'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELAYED'
  | 'EXCEPTION'
  | 'RTO_INITIATED'
  | 'CANCELLED';

export interface TrackingEvent {
  eventId: string;
  timestamp: string;
  status: ShipmentStatus;
  statusLabel: string;
  location?: string;
  description: string;
  carrierStatusCode?: string;
}

export interface ShipmentItemSummary {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
}

export interface Shipment {
  shipmentId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: ShipmentItemSummary[];

  // Carrier & Service Details
  provider: 'SHIPROCKET' | 'BLUEDART' | 'DELHIVERY' | 'CUSTOM';
  carrierName: string; // e.g. "Blue Dart Express", "Delhivery Surface", "Xpressbees"
  serviceType: 'AIR_EXPRESS' | 'SURFACE_STANDARD';
  awbCode: string; // Air Waybill / Tracking number
  providerShipmentId?: string;
  pickupTokenNumber?: string;

  // Status & Timestamps
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  bookedAt?: string;
  dispatchedAt?: string;
  expectedDeliveryDate?: string;
  deliveredAt?: string;

  // Parcel Metrics
  weightGrams: number;
  dimensionsCm: {
    length: number;
    width: number;
    height: number;
  };

  // Documents
  labelUrl?: string;
  manifestUrl?: string;
  invoiceUrl?: string;

  // Tracking Events History
  trackingEvents: TrackingEvent[];
  internalNotes?: string;
}
