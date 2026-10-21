/**
 * Plantrix Botanics — Order & Checkout Service
 * Enforces server-side price verification, inventory reservation, and immutable snapshot recording.
 * Zero trust in client-submitted prices or totals.
 */

import { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus, ShippingAddress } from '@/types/order';
import { getInternalProductById, updateProduct } from './productService';
import { getFirestoreDoc, setFirestoreDoc, queryFirestoreCollection } from '../firebase/firestore-rest';

const ORDERS_COLLECTION = 'orders';

// In-memory memory-store for dev resilience when cloud DB is being configured
let localOrdersMemoryStore: Map<string, Order> = new Map();

export interface CheckoutItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CalculatedOrder {
  items: OrderItem[];
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
}

/**
 * Validates checkout items against live database records and calculates server-verified totals
 */
export async function calculateOrderTotals(
  items: CheckoutItemInput[]
): Promise<{
  calculation: CalculatedOrder;
  errors?: string[];
}> {
  const verifiedItems: OrderItem[] = [];
  const errors: string[] = [];
  let subtotalPaise = 0;

  for (const item of items) {
    const product = await getInternalProductById(item.productId);
    if (!product) {
      errors.push(`Product "${item.productId}" is not available in our catalogue.`);
      continue;
    }

    if (product.status !== 'ACTIVE') {
      errors.push(`Specimen "${product.name}" is currently discontinued or unlisted.`);
      continue;
    }

    // Resolve variant if requested
    let unitPrice = product.sellingPricePaise;
    let availableStock = product.stock;
    let variantSnapshot: Record<string, string> | undefined = undefined;

    if (item.variantId && product.variants && product.variants.length > 0) {
      const variant = product.variants.find((v) => v.variantId === item.variantId);
      if (variant) {
        if (!variant.active) {
          errors.push(`Variant "${variant.label}" for "${product.name}" is no longer active.`);
          continue;
        }
        if (variant.priceAdjustmentPaise) {
          unitPrice += variant.priceAdjustmentPaise;
        }
        availableStock = variant.stock;
        variantSnapshot = {
          variantId: variant.variantId,
          label: variant.label,
          ...variant.attributes,
        };
      }
    }

    if (availableStock < item.quantity) {
      errors.push(
        `Insufficient inventory for "${product.name}". Requested ${item.quantity}, only ${availableStock} in fulfillment hub.`
      );
      continue;
    }

    const lineTotal = unitPrice * item.quantity;
    subtotalPaise += lineTotal;

    verifiedItems.push({
      productId: product.productId,
      sku: product.sku,
      nameSnapshot: product.name,
      variantSnapshot,
      imageKeySnapshot: product.imageKeys?.[0],
      unitPricePaise: unitPrice,
      quantity: item.quantity,
      lineTotalPaise: lineTotal,
    });
  }

  // Shipping rules: Free delivery on orders >= ₹999 (99900 paise); else ₹99 (9900 paise)
  const isFreeShipping = subtotalPaise >= 99900;
  const shippingPaise = subtotalPaise > 0 && isFreeShipping ? 0 : 9900;
  const discountPaise = 0; // Future coupon support hook
  const taxPaise = 0; // All retail prices are inclusive of GST
  const totalPaise = subtotalPaise + shippingPaise - discountPaise;

  return {
    calculation: {
      items: verifiedItems,
      subtotalPaise,
      discountPaise,
      shippingPaise,
      taxPaise,
      totalPaise,
    },
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Creates an immutable Order in Firestore and decrements inventory
 */
export async function createOrder(params: {
  customer: { name: string; email?: string; phone: string };
  shippingAddress: ShippingAddress;
  items: CheckoutItemInput[];
  paymentMethod: PaymentMethod;
  customerUid?: string;
  customerNotes?: string;
}): Promise<{ order?: Order; error?: string }> {
  // Step 1: Server-side recalculation and stock check
  const { calculation, errors } = await calculateOrderTotals(params.items);
  if (errors && errors.length > 0) {
    return { error: errors.join('. ') };
  }
  if (calculation.items.length === 0) {
    return { error: 'No valid items found in checkout.' };
  }

  // Step 2: Generate identifiers
  const timestamp = Date.now();
  const orderId = `ord-${timestamp}-${Math.floor(100 + Math.random() * 900)}`;
  const orderNumber = `PLX-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  const initialStatus: OrderStatus =
    params.paymentMethod === 'COD' ? 'PLACED' : 'PENDING_PAYMENT';
  const initialPaymentStatus: PaymentStatus = 'PENDING';

  const order: Order = {
    orderId,
    orderNumber,
    customerUid: params.customerUid,
    customer: params.customer,
    shippingAddress: params.shippingAddress,
    items: calculation.items,
    subtotalPaise: calculation.subtotalPaise,
    discountPaise: calculation.discountPaise,
    shippingPaise: calculation.shippingPaise,
    taxPaise: calculation.taxPaise,
    totalPaise: calculation.totalPaise,
    paymentMethod: params.paymentMethod,
    paymentStatus: initialPaymentStatus,
    status: initialStatus,
    customerNotes: params.customerNotes,
    createdAt: now,
    updatedAt: now,
  };

  // Step 3: Decrement stock for purchased items
  for (const item of calculation.items) {
    const prod = await getInternalProductById(item.productId);
    if (prod) {
      const nextStock = Math.max(0, prod.stock - item.quantity);
      let nextVariants = prod.variants;

      if (item.variantSnapshot?.variantId && nextVariants) {
        nextVariants = nextVariants.map((v) =>
          v.variantId === item.variantSnapshot?.variantId
            ? { ...v, stock: Math.max(0, v.stock - item.quantity) }
            : v
        );
      }

      await updateProduct(item.productId, {
        stock: nextStock,
        variants: nextVariants,
        status: nextStock === 0 ? 'OUT_OF_STOCK' : prod.status,
      });
    }
  }

  // Step 4: Persist in Firestore
  await setFirestoreDoc(ORDERS_COLLECTION, orderId, order);
  localOrdersMemoryStore.set(orderId, order);

  return { order };
}

/**
 * Retrieves order by ID with authorization verification
 */
export async function getOrderById(
  orderId: string,
  requestUid?: string,
  isAdmin = false
): Promise<Order | null> {
  let order: Order | null = null;
  try {
    order = await getFirestoreDoc<Order>(ORDERS_COLLECTION, orderId);
  } catch {
    // Fallback
  }

  if (!order) {
    order = localOrdersMemoryStore.get(orderId) || null;
  }

  if (!order) return null;

  // Authorization check: User can only view their own order unless Admin
  if (!isAdmin && order.customerUid && order.customerUid !== requestUid) {
    return null;
  }

  return order;
}

/**
 * Lists orders for an authenticated customer
 */
export async function getCustomerOrders(customerUid: string): Promise<Order[]> {
  let orders: Order[] = [];
  try {
    const { documents } = await queryFirestoreCollection<Order>(ORDERS_COLLECTION, {
      pageSize: 50,
    });
    orders = documents.filter((o) => o.customerUid === customerUid);
  } catch {
    // Fallback
  }

  if (orders.length === 0) {
    orders = Array.from(localOrdersMemoryStore.values()).filter(
      (o) => o.customerUid === customerUid
    );
  }

  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return orders;
}

/**
 * Lists all orders for Admin Control Center
 */
export async function getAdminOrders(filters?: {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}): Promise<Order[]> {
  let orders: Order[] = [];
  try {
    const { documents } = await queryFirestoreCollection<Order>(ORDERS_COLLECTION, {
      pageSize: 100,
    });
    if (documents.length > 0) {
      orders = documents;
    }
  } catch {
    // Fallback
  }

  if (orders.length === 0) {
    orders = Array.from(localOrdersMemoryStore.values());
  }

  if (filters?.status) {
    orders = orders.filter((o) => o.status === filters.status);
  }

  if (filters?.paymentStatus) {
    orders = orders.filter((o) => o.paymentStatus === filters.paymentStatus);
  }

  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return orders;
}

/**
 * Updates order status with legal state transitions
 */
const LEGAL_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ['PLACED', 'CANCELLED'],
  PLACED: ['CONFIRMED', 'CANCEL_REQUESTED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['PACKED', 'CANCELLED'],
  PACKED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'RETURN_REQUESTED'],
  DELIVERED: ['RETURN_REQUESTED'],
  CANCEL_REQUESTED: ['CANCELLED', 'CONFIRMED'],
  CANCELLED: [],
  RETURN_REQUESTED: ['RETURNED', 'DELIVERED'],
  RETURNED: ['REFUND_PENDING'],
  REFUND_PENDING: ['REFUNDED'],
  REFUNDED: [],
};

export async function updateOrderStatus(
  orderId: string,
  nextStatus: OrderStatus,
  note?: string
): Promise<{ order?: Order; error?: string }> {
  const existing = await getOrderById(orderId, undefined, true);
  if (!existing) {
    return { error: 'Order not found' };
  }

  const allowed = LEGAL_TRANSITIONS[existing.status] || [];
  if (!allowed.includes(nextStatus)) {
    return {
      error: `Illegal state transition from ${existing.status} to ${nextStatus}`,
    };
  }

  const updated: Order = {
    ...existing,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  await setFirestoreDoc(ORDERS_COLLECTION, orderId, updated);
  localOrdersMemoryStore.set(orderId, updated);

  return { order: updated };
}
