/**
 * Plantrix Botanics — Order & Checkout Data Definitions
 * Complies strictly with docs/DATA_MODEL.md §2 & docs/SECURITY.md
 */

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCEL_REQUESTED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

export type PaymentMethod = 'COD' | 'ONLINE';

export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderCustomer {
  name: string;
  email?: string;
  phone: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string; // 6-digit Indian PIN
  country: 'IN';
}

/**
 * Immutable order item snapshot
 * Ensures future catalog price or name changes do not alter historical records.
 */
export interface OrderItem {
  productId: string;
  sku: string;
  nameSnapshot: string;
  variantSnapshot?: Record<string, string>;
  imageKeySnapshot?: string;
  unitPricePaise: number;
  quantity: number;
  lineTotalPaise: number;
}

export interface Order {
  orderId: string;
  orderNumber: string;
  customerUid?: string;
  customer: OrderCustomer;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProvider?: string;
  paymentReference?: string;
  status: OrderStatus;
  courierPartner?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cart line item stored in customer session or local storage
 */
export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  slug: string;
  pricePaise: number;
  imageKey?: string;
  imageUrl?: string;
  quantity: number;
  selectedVariant?: {
    variantId: string;
    label: string;
    attributes: Record<string, string>;
  };
}
