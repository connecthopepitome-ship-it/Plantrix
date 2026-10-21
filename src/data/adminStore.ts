'use client';

import { Product, ProductStatus } from '@/types/product';
import { Order, OrderStatus } from '@/types/order';
import { Shipment, ShipmentStatus, TrackingEvent } from '@/types/shipment';
import { CATALOG_PRODUCTS } from './products';

// Storage keys for client persistence
const ADMIN_PRODUCTS_KEY = 'plantrix_admin_products_v1';
const ADMIN_ORDERS_KEY = 'plantrix_admin_orders_v1';
const ADMIN_SHIPMENTS_KEY = 'plantrix_admin_shipments_v1';

// Seed Products with Full Internal Supplier Data
const SEED_ADMIN_PRODUCTS: Product[] = CATALOG_PRODUCTS.map((p, idx) => ({
  productId: p.productId,
  sku: p.sku,
  slug: p.slug,
  name: p.name,
  shortDescription: p.shortDescription,
  description: p.description,
  department: p.department,
  categoryId: p.categoryId,
  brand: p.brand || 'Plantrix Studio',
  sellingPricePaise: p.sellingPricePaise,
  compareAtPricePaise: p.compareAtPricePaise,
  stock: p.stock,
  status: p.status,
  featured: p.featured,
  trending: p.trending,
  newArrival: p.newArrival,
  imageKeys: p.imageKeys,
  highlights: p.highlights,
  specifications: p.specifications || {
    Material: 'High-fire stoneware ceramic',
    Finish: 'Speckled matte glaze',
    Drainage: 'Integrated bottom aperture',
  },
  dimensions: {
    length: 18,
    width: 18,
    height: 20,
    unit: 'cm',
  },
  weightGrams: 1200 + idx * 250,
  careInstructions: 'Wipe surface with soft damp cloth. Avoid harsh chemical cleaners.',
  shippingInfo: 'Transit-safe double-wall corrugated box with biodegradable molded pulp inserts.',
  returnPolicy: '7-day replacement guarantee against transit damage.',
  createdAt: '2026-10-10T10:00:00Z',
  updatedAt: '2026-10-21T08:30:00Z',
  publishedAt: '2026-10-10T12:00:00Z',

  // STRICT PRIVATE SUPPLIER FIELDS (Internal Only)
  sourceCostPaise: Math.round(p.sellingPricePaise * 0.48), // e.g. 52% gross margin
  sourceProductUrl: `https://artisan-supplier.internal/sku/${p.sku.toLowerCase()}`,
  supplierSku: `SUP-${p.sku}`,
  sourceCostVerifiedAt: '2026-10-15T09:00:00Z',
  internalNotes: 'Batch verified for frost-resistance and indoor root thermal buffering.',
}));

// Seed Orders
const SEED_ORDERS: Order[] = [
  {
    orderId: 'ord-01',
    orderNumber: 'PLX-849201',
    customerUid: 'cust-101',
    customer: {
      name: 'Ananya Rao',
      email: 'ananya.rao@example.com',
      phone: '+91 98765 43210',
    },
    shippingAddress: {
      line1: 'Apartment 4B, Greenwood Sanctuary',
      line2: '12th Main Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'IN',
    },
    items: [
      {
        productId: 'pb-01',
        sku: 'PLX-POT-001',
        nameSnapshot: 'Sculptural Ribbed Fluted Planter',
        unitPricePaise: 189900,
        quantity: 1,
        lineTotalPaise: 189900,
      },
      {
        productId: 'pb-02',
        sku: 'PLX-MIS-002',
        nameSnapshot: 'Brass Mist & Dew Spray Vessel',
        unitPricePaise: 129900,
        quantity: 1,
        lineTotalPaise: 129900,
      },
    ],
    subtotalPaise: 319800,
    discountPaise: 0,
    shippingPaise: 0,
    taxPaise: 0,
    totalPaise: 319800,
    paymentMethod: 'ONLINE',
    paymentStatus: 'PAID',
    paymentProvider: 'Razorpay / UPI',
    paymentReference: 'pay_Nz9K28xLm019',
    status: 'SHIPPED',
    courierPartner: 'Blue Dart Express',
    trackingNumber: 'BLUEDART-84920192',
    trackingUrl: 'https://track.bluedart.com/BLUEDART-84920192',
    customerNotes: 'Please ring bell upon delivery. Live plant parcel.',
    createdAt: '2026-10-18T14:32:00Z',
    updatedAt: '2026-10-20T09:15:00Z',
  },
  {
    orderId: 'ord-02',
    orderNumber: 'PLX-849202',
    customerUid: 'cust-102',
    customer: {
      name: 'Devendra Sharma',
      email: 'd.sharma@example.com',
      phone: '+91 98112 34567',
    },
    shippingAddress: {
      line1: 'Villa 18, Magnolia Park',
      line2: 'Sector 54, Golf Course Road',
      city: 'Gurugram',
      state: 'Haryana',
      postalCode: '122002',
      country: 'IN',
    },
    items: [
      {
        productId: 'pb-04',
        sku: 'PLX-MON-004',
        nameSnapshot: 'Architectural Monstera Deliciosa (Curated Specimen)',
        unitPricePaise: 249900,
        quantity: 1,
        lineTotalPaise: 249900,
      },
      {
        productId: 'pb-03',
        sku: 'PLX-WAL-003',
        nameSnapshot: 'Floating Botanical Wall Sconce',
        unitPricePaise: 229900,
        quantity: 1,
        lineTotalPaise: 229900,
      },
    ],
    subtotalPaise: 479800,
    discountPaise: 0,
    shippingPaise: 0,
    taxPaise: 0,
    totalPaise: 479800,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    status: 'PROCESSING',
    courierPartner: 'Delhivery Surface',
    trackingNumber: 'DELHIVERY-92018471',
    createdAt: '2026-10-19T10:15:00Z',
    updatedAt: '2026-10-21T07:20:00Z',
  },
  {
    orderId: 'ord-03',
    orderNumber: 'PLX-849203',
    customerUid: 'cust-103',
    customer: {
      name: 'Priya Nair',
      email: 'priya.nair@example.com',
      phone: '+91 94471 23456',
    },
    shippingAddress: {
      line1: 'House No 12, Panampilly Nagar',
      city: 'Kochi',
      state: 'Kerala',
      postalCode: '682036',
      country: 'IN',
    },
    items: [
      {
        productId: 'pb-01',
        sku: 'PLX-POT-001',
        nameSnapshot: 'Sculptural Ribbed Fluted Planter',
        unitPricePaise: 189900,
        quantity: 1,
        lineTotalPaise: 189900,
      },
    ],
    subtotalPaise: 189900,
    discountPaise: 0,
    shippingPaise: 0,
    taxPaise: 0,
    totalPaise: 189900,
    paymentMethod: 'ONLINE',
    paymentStatus: 'PAID',
    paymentProvider: 'UPI Instant',
    status: 'CONFIRMED',
    createdAt: '2026-10-21T06:10:00Z',
    updatedAt: '2026-10-21T06:12:00Z',
  },
  {
    orderId: 'ord-04',
    orderNumber: 'PLX-849204',
    customerUid: 'cust-104',
    customer: {
      name: 'Vikramaditya Sengupta',
      email: 'v.sengupta@example.com',
      phone: '+91 98300 11223',
    },
    shippingAddress: {
      line1: 'Flat 6A, Southern Avenue Heights',
      city: 'Kolkata',
      state: 'West Bengal',
      postalCode: '700029',
      country: 'IN',
    },
    items: [
      {
        productId: 'he-02',
        sku: 'PLX-PAN-002',
        nameSnapshot: 'Airtight Fluted Pantry Canisters (Set of 3)',
        unitPricePaise: 249900,
        quantity: 1,
        lineTotalPaise: 249900,
      },
    ],
    subtotalPaise: 249900,
    discountPaise: 0,
    shippingPaise: 0,
    taxPaise: 0,
    totalPaise: 249900,
    paymentMethod: 'ONLINE',
    paymentStatus: 'PAID',
    status: 'DELIVERED',
    courierPartner: 'Blue Dart Express',
    trackingNumber: 'BLUEDART-83910281',
    createdAt: '2026-10-14T09:00:00Z',
    updatedAt: '2026-10-17T16:45:00Z',
  },
];

// Seed Shipments
const SEED_SHIPMENTS: Shipment[] = [
  {
    shipmentId: 'SHP-100291',
    orderId: 'ord-01',
    orderNumber: 'PLX-849201',
    customerName: 'Ananya Rao',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      line1: 'Apartment 4B, Greenwood Sanctuary',
      line2: '12th Main Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'IN',
    },
    items: [
      {
        productId: 'pb-01',
        sku: 'PLX-POT-001',
        name: 'Sculptural Ribbed Fluted Planter',
        quantity: 1,
      },
      {
        productId: 'pb-02',
        sku: 'PLX-MIS-002',
        name: 'Brass Mist & Dew Spray Vessel',
        quantity: 1,
      },
    ],
    provider: 'BLUEDART',
    carrierName: 'Blue Dart Express Air',
    serviceType: 'AIR_EXPRESS',
    awbCode: 'BLUEDART-84920192',
    providerShipmentId: 'SR-BLU-9921',
    pickupTokenNumber: 'PKUP-BLR-0941',
    status: 'IN_TRANSIT',
    createdAt: '2026-10-19T11:00:00Z',
    updatedAt: '2026-10-21T06:30:00Z',
    bookedAt: '2026-10-19T11:30:00Z',
    dispatchedAt: '2026-10-19T16:00:00Z',
    expectedDeliveryDate: '2026-10-22T18:00:00Z',
    weightGrams: 1650,
    dimensionsCm: {
      length: 24,
      width: 24,
      height: 26,
    },
    labelUrl: '#',
    trackingEvents: [
      {
        eventId: 'evt-01',
        timestamp: '2026-10-19T11:30:00Z',
        status: 'BOOKED',
        statusLabel: 'Electronic Manifest Generated',
        location: 'Bengaluru Hub',
        description: 'Shipping label & AWB assigned to Blue Dart.',
      },
      {
        eventId: 'evt-02',
        timestamp: '2026-10-19T16:45:00Z',
        status: 'PICKED_UP',
        statusLabel: 'Parcel Picked Up',
        location: 'Plantrix Bengaluru Nursery Facility',
        description: 'Courier agent verified intact moisture-barrier seal.',
      },
      {
        eventId: 'evt-03',
        timestamp: '2026-10-20T21:10:00Z',
        status: 'IN_TRANSIT',
        statusLabel: 'Arrived at Sort Facility',
        location: 'Bengaluru Air Sorting Center',
        description: 'Package scanned into express line haul.',
      },
    ],
  },
  {
    shipmentId: 'SHP-100292',
    orderId: 'ord-02',
    orderNumber: 'PLX-849202',
    customerName: 'Devendra Sharma',
    customerPhone: '+91 98112 34567',
    shippingAddress: {
      line1: 'Villa 18, Magnolia Park',
      line2: 'Sector 54, Golf Course Road',
      city: 'Gurugram',
      state: 'Haryana',
      postalCode: '122002',
      country: 'IN',
    },
    items: [
      {
        productId: 'pb-04',
        sku: 'PLX-MON-004',
        name: 'Architectural Monstera Deliciosa (Curated Specimen)',
        quantity: 1,
      },
      {
        productId: 'pb-03',
        sku: 'PLX-WAL-003',
        name: 'Floating Botanical Wall Sconce',
        quantity: 1,
      },
    ],
    provider: 'DELHIVERY',
    carrierName: 'Delhivery Surface Premium',
    serviceType: 'SURFACE_STANDARD',
    awbCode: 'DELHIVERY-92018471',
    providerShipmentId: 'SR-DEL-4821',
    status: 'READY_TO_DISPATCH',
    createdAt: '2026-10-20T14:00:00Z',
    updatedAt: '2026-10-21T07:20:00Z',
    bookedAt: '2026-10-20T14:15:00Z',
    expectedDeliveryDate: '2026-10-24T18:00:00Z',
    weightGrams: 2800,
    dimensionsCm: {
      length: 32,
      width: 32,
      height: 65,
    },
    trackingEvents: [
      {
        eventId: 'evt-11',
        timestamp: '2026-10-20T14:15:00Z',
        status: 'READY_TO_DISPATCH',
        statusLabel: 'Label & Packaging Complete',
        location: 'Delhi Regional Fulfillment Hub',
        description: 'Reinforced transit cushioning and moisture pack secured.',
      },
    ],
  },
  {
    shipmentId: 'SHP-100290',
    orderId: 'ord-04',
    orderNumber: 'PLX-849204',
    customerName: 'Vikramaditya Sengupta',
    customerPhone: '+91 98300 11223',
    shippingAddress: {
      line1: 'Flat 6A, Southern Avenue Heights',
      city: 'Kolkata',
      state: 'West Bengal',
      postalCode: '700029',
      country: 'IN',
    },
    items: [
      {
        productId: 'he-02',
        sku: 'PLX-PAN-002',
        name: 'Airtight Fluted Pantry Canisters (Set of 3)',
        quantity: 1,
      },
    ],
    provider: 'BLUEDART',
    carrierName: 'Blue Dart Air',
    serviceType: 'AIR_EXPRESS',
    awbCode: 'BLUEDART-83910281',
    status: 'DELIVERED',
    createdAt: '2026-10-14T12:00:00Z',
    updatedAt: '2026-10-17T16:45:00Z',
    bookedAt: '2026-10-14T12:30:00Z',
    dispatchedAt: '2026-10-15T10:00:00Z',
    deliveredAt: '2026-10-17T16:45:00Z',
    weightGrams: 1900,
    dimensionsCm: {
      length: 22,
      width: 22,
      height: 30,
    },
    trackingEvents: [
      {
        eventId: 'evt-21',
        timestamp: '2026-10-17T16:45:00Z',
        status: 'DELIVERED',
        statusLabel: 'Delivered Successfully',
        location: 'Kolkata South Branch',
        description: 'Delivered directly to patron.',
      },
    ],
  },
];

// Helper to safely load or initialize storage
function loadFromStorage<T>(key: string, seed: T): T {
  if (typeof window === 'undefined') return seed;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

function saveToStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to persist to ${key}:`, err);
  }
}

// =========================================================================
// CATALOGUE STORE
// =========================================================================

export function getAdminProducts(): Product[] {
  return loadFromStorage(ADMIN_PRODUCTS_KEY, SEED_ADMIN_PRODUCTS);
}

export function getAdminProductById(productId: string): Product | undefined {
  const products = getAdminProducts();
  return products.find((p) => p.productId === productId);
}

export function saveAdminProduct(productData: Partial<Product> & { name: string; sellingPricePaise: number }): Product {
  const products = getAdminProducts();
  const now = new Date().toISOString();

  let targetId = productData.productId;
  let isNew = false;

  if (!targetId) {
    targetId = `pb-${Date.now().toString(36)}`;
    isNew = true;
  }

  const existing = products.find((p) => p.productId === targetId);

  const updated: Product = {
    productId: targetId,
    sku: productData.sku || `PLX-${Math.floor(100 + Math.random() * 900)}`,
    slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: productData.name,
    shortDescription: productData.shortDescription || '',
    description: productData.description || '',
    department: productData.department || 'PLANTS_BOTANICS',
    categoryId: productData.categoryId || 'pots-planters',
    subcategoryId: productData.subcategoryId,
    brand: productData.brand || 'Plantrix Studio',
    sellingPricePaise: productData.sellingPricePaise,
    compareAtPricePaise: productData.compareAtPricePaise,
    stock: typeof productData.stock === 'number' ? productData.stock : 10,
    status: productData.status || 'ACTIVE',
    featured: !!productData.featured,
    trending: !!productData.trending,
    newArrival: !!productData.newArrival,
    imageKeys: productData.imageKeys && productData.imageKeys.length > 0 ? productData.imageKeys : ['default-pot'],
    specifications: productData.specifications || {},
    highlights: productData.highlights || [],
    dimensions: productData.dimensions || { length: 20, width: 20, height: 20, unit: 'cm' },
    weightGrams: productData.weightGrams || 1000,
    careInstructions: productData.careInstructions || '',
    shippingInfo: productData.shippingInfo || 'Transit-safe packaging',
    returnPolicy: productData.returnPolicy || '7-day replacement guarantee',
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
    publishedAt: productData.status === 'ACTIVE' ? (existing?.publishedAt || now) : undefined,

    // Internal supplier fields
    sourceCostPaise: productData.sourceCostPaise || Math.round(productData.sellingPricePaise * 0.5),
    sourceProductUrl: productData.sourceProductUrl || '',
    supplierSku: productData.supplierSku || `SUP-${targetId}`,
    sourceCostVerifiedAt: now,
    internalNotes: productData.internalNotes || '',
  };

  let newProductsList: Product[];
  if (isNew || !existing) {
    newProductsList = [updated, ...products];
  } else {
    newProductsList = products.map((p) => (p.productId === targetId ? updated : p));
  }

  saveToStorage(ADMIN_PRODUCTS_KEY, newProductsList);
  return updated;
}

export function deleteAdminProduct(productId: string): boolean {
  const products = getAdminProducts();
  const filtered = products.filter((p) => p.productId !== productId);
  saveToStorage(ADMIN_PRODUCTS_KEY, filtered);
  return true;
}

// =========================================================================
// ORDER STORE
// =========================================================================

export function getAdminOrders(): Order[] {
  return loadFromStorage(ADMIN_ORDERS_KEY, SEED_ORDERS);
}

export function getAdminOrderById(orderId: string): Order | undefined {
  const orders = getAdminOrders();
  return orders.find((o) => o.orderId === orderId || o.orderNumber === orderId);
}

export function updateAdminOrderStatus(orderId: string, newStatus: OrderStatus, notes?: string): Order | undefined {
  const orders = getAdminOrders();
  const existing = orders.find((o) => o.orderId === orderId || o.orderNumber === orderId);
  if (!existing) return undefined;

  const now = new Date().toISOString();
  const updated: Order = {
    ...existing,
    status: newStatus,
    customerNotes: notes ? `${existing.customerNotes ? existing.customerNotes + '\n' : ''}[${now.slice(0, 10)}] ${notes}` : existing.customerNotes,
    updatedAt: now,
  };

  const newOrdersList = orders.map((o) => (o.orderId === existing.orderId ? updated : o));
  saveToStorage(ADMIN_ORDERS_KEY, newOrdersList);
  return updated;
}

// =========================================================================
// SHIPMENT STORE
// =========================================================================

export function getAdminShipments(): Shipment[] {
  return loadFromStorage(ADMIN_SHIPMENTS_KEY, SEED_SHIPMENTS);
}

export function getAdminShipmentById(shipmentId: string): Shipment | undefined {
  const shipments = getAdminShipments();
  return shipments.find((s) => s.shipmentId === shipmentId || s.orderNumber === shipmentId);
}

export function createAdminShipmentForOrder(order: Order, carrierName: string, serviceType: 'AIR_EXPRESS' | 'SURFACE_STANDARD'): Shipment {
  const shipments = getAdminShipments();
  const now = new Date().toISOString();
  const shipmentId = `SHP-${Math.floor(100000 + Math.random() * 900000)}`;
  const awbCode = `${carrierName.toUpperCase().replace(/[^A-Z]/g, '')}-${Math.floor(10000000 + Math.random() * 90000000)}`;

  const newShipment: Shipment = {
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
    provider: 'SHIPROCKET',
    carrierName,
    serviceType,
    awbCode,
    status: 'READY_TO_DISPATCH',
    createdAt: now,
    updatedAt: now,
    bookedAt: now,
    expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    weightGrams: 1500,
    dimensionsCm: {
      length: 25,
      width: 25,
      height: 30,
    },
    labelUrl: '#',
    trackingEvents: [
      {
        eventId: `evt-${Date.now()}`,
        timestamp: now,
        status: 'READY_TO_DISPATCH',
        statusLabel: 'Shipment Created & Booked',
        location: 'Plantrix Regional Fulfillment Center',
        description: `Electronic manifest booked with ${carrierName}. AWB: ${awbCode}`,
      },
    ],
  };

  const newShipmentsList = [newShipment, ...shipments];
  saveToStorage(ADMIN_SHIPMENTS_KEY, newShipmentsList);

  // Automatically update the order status to READY_TO_SHIP or SHIPPED
  updateAdminOrderStatus(order.orderId, 'PROCESSING');

  return newShipment;
}

export function updateAdminShipmentStatus(shipmentId: string, newStatus: ShipmentStatus, eventDescription?: string): Shipment | undefined {
  const shipments = getAdminShipments();
  const existing = shipments.find((s) => s.shipmentId === shipmentId);
  if (!existing) return undefined;

  const now = new Date().toISOString();
  const newEvent: TrackingEvent = {
    eventId: `evt-${Date.now()}`,
    timestamp: now,
    status: newStatus,
    statusLabel: newStatus.replace(/_/g, ' '),
    location: 'Bengaluru Logistics Terminal',
    description: eventDescription || `Status advanced to ${newStatus}`,
  };

  const updated: Shipment = {
    ...existing,
    status: newStatus,
    updatedAt: now,
    dispatchedAt: newStatus === 'IN_TRANSIT' || newStatus === 'PICKED_UP' ? (existing.dispatchedAt || now) : existing.dispatchedAt,
    deliveredAt: newStatus === 'DELIVERED' ? now : existing.deliveredAt,
    trackingEvents: [newEvent, ...existing.trackingEvents],
  };

  const newShipmentsList = shipments.map((s) => (s.shipmentId === shipmentId ? updated : s));
  saveToStorage(ADMIN_SHIPMENTS_KEY, newShipmentsList);

  // Also reflect in the linked order
  if (newStatus === 'DELIVERED') {
    updateAdminOrderStatus(existing.orderId, 'DELIVERED');
  } else if (newStatus === 'IN_TRANSIT' || newStatus === 'PICKED_UP') {
    updateAdminOrderStatus(existing.orderId, 'SHIPPED');
  }

  return updated;
}

// =========================================================================
// DASHBOARD AGGREGATE METRICS
// =========================================================================

export interface DashboardMetrics {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  draftProducts: number;
  totalOrders: number;
  newOrders: number;
  ordersAwaitingProcessing: number;
  shipmentsAwaitingDispatch: number;
  shipmentsInTransit: number;
  totalRevenuePaise: number;
}

export function getAdminDashboardMetrics(): DashboardMetrics {
  const products = getAdminProducts();
  const orders = getAdminOrders();
  const shipments = getAdminShipments();

  const activeProducts = products.filter((p) => p.status === 'ACTIVE').length;
  const lowStockProducts = products.filter((p) => p.stock <= 5 && p.status === 'ACTIVE').length;
  const draftProducts = products.filter((p) => p.status === 'DRAFT').length;

  const newOrders = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PENDING_PAYMENT').length;
  const ordersAwaitingProcessing = orders.filter((o) => o.status === 'PROCESSING' || o.status === 'CONFIRMED').length;

  const shipmentsAwaitingDispatch = shipments.filter((s) => s.status === 'READY_TO_DISPATCH' || s.status === 'BOOKED').length;
  const shipmentsInTransit = shipments.filter((s) => s.status === 'IN_TRANSIT' || s.status === 'PICKED_UP' || s.status === 'OUT_FOR_DELIVERY').length;

  const totalRevenuePaise = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalPaise, 0);

  return {
    totalProducts: products.length,
    activeProducts,
    lowStockProducts,
    draftProducts,
    totalOrders: orders.length,
    newOrders,
    ordersAwaitingProcessing,
    shipmentsAwaitingDispatch,
    shipmentsInTransit,
    totalRevenuePaise,
  };
}
