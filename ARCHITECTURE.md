# System Architecture

**Status:** Proposed architecture — verify against the existing repository before implementation.

## 1. High-level design

```text
Customer browser
  └── Plantrix storefront (Next.js)
        ├── Public catalogue queries / server routes
        ├── Firebase Authentication (customer identity)
        ├── Cart and checkout UI
        └── Server-side commerce operations
              ├── Firebase Admin SDK
              ├── Cloud Firestore
              ├── Payment provider API + verified webhooks
              └── Cloudflare R2 image object storage

Admin browser
  └── Protected admin UI
        └── Server-verified admin authorization
              ├── Product/category/collection management
              ├── Image upload/signing or controlled upload endpoint
              ├── Inventory and order management
              └── Audit events

Hosting and delivery
  ├── Cloudflare + compatible Next.js/OpenNext deployment
  └── R2 custom image domain or approved image delivery route
```

## 2. Responsibilities

### Next.js application
- Storefront, listing, product, cart, checkout, account, tracking, and admin UI.
- Server-side route handlers/server actions for privileged operations.
- Server-side validation of prices, inventory, discounts, and checkout payloads.
- SEO metadata and public product rendering.
- Do not rely on client-only checks for security.

### Firebase Authentication
- Customer identity.
- Admin identity, with role/claim or server-managed role records.
- Admin status must be verified server-side. Hiding admin routes in the UI is not authorization.

### Cloud Firestore
- Structured product and category data.
- Orders and immutable order item snapshots.
- Customer-owned account data.
- Collections, coupons, settings, inventory events, and audit records.
- No binary image files.

### Cloudflare R2
- Product image binaries and approved marketing media.
- Object keys stored in Firestore.
- Prefer controlled uploads, safe MIME/type checks, size limits, and generated object keys.
- Never use supplier URLs as the permanent public image host without rights and reliability checks.

### Payment provider
- Create payment intents/orders on the server.
- Verify signed webhooks.
- Store provider references and normalized payment state.
- Process events idempotently.

## 3. Public and private data boundaries

Public product DTO may include:
- productId, slug, name, descriptions, category, selling price, legitimate compare-at price, public images, public variants, public specifications, availability, and published policy snippets.

Private fields must never be included in public DTOs:
- sourceCost, sourceProductUrl, supplierSku, supplier notes, internal margin, admin notes, credentials, private customer information, and raw payment secrets.

Use explicit mapping functions such as `toPublicProduct()` instead of returning raw Firestore documents.

## 4. Data access strategy

- Use server-side Firestore reads for public product pages when suitable for SEO and caching.
- Use pagination and indexed queries.
- Avoid broad unbounded collection reads.
- Keep cached public catalogue data separate from personalized/customer data.
- Revalidate product pages and collections after admin edits.
- Orders, account details, and admin operations must not be publicly cached.
- Ensure cache keys cannot mix users or leak personalized data.

## 5. Order lifecycle

Suggested states:

`PENDING_PAYMENT` → `PLACED` → `CONFIRMED` → `PROCESSING` → `PACKED` → `SHIPPED` → `DELIVERED`

Exceptional states:
`PAYMENT_FAILED`, `CANCEL_REQUESTED`, `CANCELLED`, `RETURN_REQUESTED`, `RETURNED`, `REFUND_PENDING`, `REFUNDED`.

The exact workflow must be approved before implementation. COD orders need a distinct payment state and must not be treated as paid at placement.

- Validate legal transitions on the server.
- Record state changes in an order event/audit trail.
- Use transactions or atomic operations for inventory reservations/decrements.
- Make checkout and webhook handling idempotent.
- Snapshot price, product name, selected variant, and quantity into each order item so later catalogue edits do not change historical orders.

## 6. Meesho/supplier fulfilment boundary

The initial system is supplier-assisted, not unattended automated purchasing. An admin reviews source availability, current cost, supplier terms, and fulfilment eligibility before proceeding. Any future supplier automation requires a documented, authorized integration and privacy review.

## 7. Architecture decisions to confirm

- Exact Next.js and OpenNext versions compatible with the current repository and Cloudflare runtime.
- Whether Firebase Admin SDK can be used in the chosen runtime or should run in a compatible server environment.
- R2 upload approach: server-issued presigned URLs or server-mediated uploads.
- Image delivery domain and cache policy.
- Payment provider and COD eligibility.
- Whether customer accounts are required at launch or guest checkout is sufficient.
