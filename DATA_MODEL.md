# Data Model — Firestore and R2

**Status:** Proposed schema. Review indexes, rules, and query patterns before migration.

## 1. General conventions

- Use stable IDs and server timestamps.
- Store money as integer paise where practical, or consistently as integer INR only if all supported operations avoid fractional amounts. Do not mix representations.
- Use explicit status enums.
- Validate all writes server-side.
- Never accept price, role, payment state, or supplier-cost authority from the browser.
- Avoid storing duplicated personal information unless required for an order snapshot.
- Firestore does not store image binaries; store R2 object keys and/or approved delivery URLs.

## 2. Collections

### `products/{productId}`

```ts
type ProductStatus = "DRAFT" | "ACTIVE" | "OUT_OF_STOCK" | "HIDDEN" | "DISCONTINUED";

interface Product {
  productId: string;
  sku: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  categoryId: string;
  subcategoryId?: string;
  brand?: string;
  sellingPricePaise: number;
  compareAtPricePaise?: number;
  stock: number;
  status: ProductStatus;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  imageKeys: string[]; // R2 object keys, not binary data
  variants?: ProductVariant[];
  specifications?: Record<string, string | number | boolean>;
  highlights?: string[];
  dimensions?: { length?: number; width?: number; height?: number; unit?: string };
  weightGrams?: number;
  careInstructions?: string;
  shippingInfo?: string;
  returnPolicy?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  // Private fields; never include in public DTO:
  sourceCostPaise?: number;
  sourceProductUrl?: string;
  supplierSku?: string;
  sourceCostVerifiedAt?: Timestamp;
  internalNotes?: string;
}

interface ProductVariant {
  variantId: string;
  sku: string;
  label: string;
  attributes: Record<string, string>;
  priceAdjustmentPaise?: number;
  stock: number;
  imageKey?: string;
  active: boolean;
}
```

### `categories/{categoryId}`

```ts
interface Category {
  categoryId: string;
  name: string;
  slug: string;
  department: "PLANTS_BOTANICS" | "HOME_ESSENTIALS";
  description?: string;
  imageKey?: string;
  parentCategoryId?: string;
  sortOrder: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### `collections/{collectionId}`

```ts
interface Collection {
  collectionId: string;
  title: string;
  slug: string;
  description?: string;
  imageKey?: string;
  productIds?: string[];
  rule?: Record<string, unknown>; // Validate supported rule schema; never execute arbitrary code.
  active: boolean;
  sortOrder: number;
}
```

### `users/{uid}`

```ts
interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
  phone?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Roles should be granted through trusted admin processes.
}
```

Keep authorization roles in trusted custom claims or a server-protected role store. Never let users self-assign admin.

### `orders/{orderId}`

```ts
type OrderStatus =
  | "PENDING_PAYMENT" | "PLACED" | "CONFIRMED" | "PROCESSING"
  | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCEL_REQUESTED"
  | "CANCELLED" | "RETURN_REQUESTED" | "RETURNED"
  | "REFUND_PENDING" | "REFUNDED";

interface Order {
  orderId: string;
  orderNumber: string;
  customerUid?: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
  };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: "IN";
  };
  items: Array<{
    productId: string;
    sku: string;
    nameSnapshot: string;
    variantSnapshot?: Record<string, string>;
    imageKeySnapshot?: string;
    unitPricePaise: number;
    quantity: number;
    lineTotalPaise: number;
  }>;
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
  paymentMethod: "COD" | "ONLINE";
  paymentStatus: "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUNDED";
  paymentProvider?: string;
  paymentReference?: string;
  status: OrderStatus;
  courierPartner?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  customerNotes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Do not store card numbers, CVVs, payment secrets, or unnecessary payment credentials.

### Supporting collections
- `carts/{uid}` — optional server-side cart; client cart may be used before login, but checkout must revalidate everything.
- `reviews/{reviewId}` — only genuine submissions with moderation/status.
- `coupons/{couponId}` — validity windows, limits, eligibility, and server-validated rules.
- `siteSettings/{documentId}` — public-safe settings only; separate private settings from public config.
- `inventoryEvents/{eventId}` — stock adjustments, reason, actor, and timestamp.
- `orderEvents/{eventId}` or an order subcollection — status changes and audit trail.
- `adminAuditLogs/{eventId}` — privileged action metadata; avoid excessive sensitive payloads.

## 3. R2 object key convention

Suggested key layout:

```text
products/{productId}/{randomId}-original.webp
products/{productId}/{randomId}-card.webp
products/{productId}/{randomId}-detail.webp
categories/{categoryId}/{randomId}.webp
site/{assetName}/{randomId}.webp
```

Use generated keys instead of trusting user-provided filenames. Validate actual file type, size, dimensions, and upload authorization. Strip EXIF metadata where practical. Store image key, alt text, dimensions, ordering, and optional variant association in Firestore.

## 4. Data migration

- Inspect existing records before migration.
- Back up existing data.
- Map legacy fields explicitly.
- Keep a dry-run mode and migration report.
- Detect duplicate SKUs/slugs and invalid prices.
- Never migrate supplier details into public DTOs.
- Verify counts and sample records before switching production traffic.
