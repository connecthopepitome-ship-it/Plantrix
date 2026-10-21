# Product Requirements Document — Plantrix Botanics

**Status:** Draft for approval  
**Domain:** `plantrixbotanics.com`  
**Primary market:** India  
**Business model:** Online reselling of products sourced from suppliers/marketplaces, subject to supplier terms and applicable policies.

## 1. Vision

Plantrix Botanics helps customers discover attractive botanical products and useful everyday home products through one carefully curated, trustworthy online store.

## 2. Goals

- Build a recognizable, premium brand rather than a generic marketplace clone.
- Make it easy to browse and purchase products on mobile and desktop.
- Enable an administrator to manage products, categories, images, stock, prices, and orders without editing code.
- Keep source costs, supplier URLs, supplier SKUs, and internal fulfilment notes private.
- Provide reliable order creation, payment verification, and order-status tracking.
- Keep operating costs low and architecture maintainable for a small business.

## 3. Non-goals for initial release

- Unattended automated purchasing from Meesho or another supplier.
- A multi-vendor marketplace where third parties manage their own storefronts.
- Complex loyalty points, subscriptions, or a mobile application.
- Public customer reviews until moderation and authenticity controls exist.
- International checkout unless explicitly approved later.
- Claims of real-time supplier stock unless a supported integration exists.

## 4. Customer segments

- Plant lovers and people styling balconies or indoor spaces.
- Customers looking for attractive planters and gardening accessories.
- Customers seeking practical home organization and everyday utility products.
- Mobile-first shoppers who expect fast product discovery and transparent checkout.

## 5. Main departments and taxonomy

### Plants & Botanics
- Indoor plants
- Artificial plants
- Pots and planters
- Hanging and wall planters
- Plant stands and shelves
- Watering and gardening tools
- Propagation accessories
- Balcony and garden décor

### Home & Everyday Essentials
- Kitchen utilities
- Kitchen and pantry storage
- Home organization
- Bathroom organization
- Cleaning accessories
- Laundry utilities
- Space-saving products
- Travel and everyday accessories

Categories must be editable in admin. Product-specific specifications must be configurable rather than hardcoded into the common product schema.

## 6. Storefront requirements

### Homepage
- Announcement bar configurable by admin.
- Header with logo, department navigation, search, account, wishlist, and cart.
- Editorial hero section with primary and secondary calls to action.
- Two visually distinct department cards.
- Configurable collections such as Best Sellers, New Arrivals, Trending Finds, Under ₹499, Small-Space Solutions, and Botanical Living.
- Product grids/carousels driven by actual Firestore data.
- Brand story/editorial content, trust information, newsletter signup with consent, and footer.

Empty collections should be hidden. Promotions and trust claims must be truthful and configurable.

### Listing and search
- Category/collection pages with search, sort, pagination or load-more, and filters.
- Filters should include price, availability, and category-relevant attributes.
- Sort options: relevance, newest, price low-to-high, price high-to-low.
- Active filter chips, clear-all, result count, and useful empty state.
- Search should not expose private fields.

### Product detail
- Responsive gallery and image zoom.
- Name, SKU where appropriate, price, valid compare-at price, availability, variants, quantity, add-to-cart, buy-now, wishlist.
- Highlights, dynamic specifications, dimensions/material/capacity where applicable, care instructions, delivery/return information, related products.
- Plant-specific attributes such as sunlight/watering care when relevant.
- Home-utility attributes such as capacity, material, dimensions, and compatibility when relevant.
- Only display ratings/reviews when genuine and available.

### Cart and checkout
- Add/remove/update items and variants.
- Persist cart appropriately across refreshes.
- Revalidate current prices, stock, variants, discounts, shipping, and totals on the server.
- Guest checkout where approved.
- Collect necessary contact and delivery details only.
- Create an order idempotently.
- Never mark payment successful based only on client-side redirect.
- COD is enabled only if operationally supported.

### Customer account
- Sign-in and sign-out.
- Order history and order detail.
- Saved addresses only if implemented securely.
- Customers can access only their own data.

### Order tracking
- Show order status and tracking information only after safe ownership or order-verification checks.
- Do not expose another customer's address, phone, items, or payment references through guessable order IDs.

## 7. Admin requirements

- Role-protected admin dashboard.
- Overview metrics calculated from appropriate order/payment states.
- Product create/edit/archive and publish/draft controls.
- Category and collection management.
- Product image upload, ordering, replacement, and removal.
- Variant/SKU and stock management.
- Bulk CSV import/export with validation, duplicate detection, dry-run/preview, and import report.
- Orders, payment status, fulfilment status, courier and tracking details.
- Supplier URL, supplier SKU, source cost, last source-cost verification, and internal notes visible only to authorized admins.
- Configurable homepage banners, policies, contact details, shipping settings, and social links.
- Audit trail for sensitive administrative actions.

## 8. Product pricing and margin

- Selling price and compare-at price are separate fields.
- Compare-at price must be a legitimate reference price and must not be used to fabricate discounts.
- Source cost is private.
- Estimated gross margin should be clearly labelled as an estimate and should account for source cost and configurable known costs; it is not net profit.
- Checkout totals are calculated on the server.
- Currency is INR for initial launch unless otherwise approved.

## 9. Functional acceptance criteria

- Both departments are browsable and visually differentiated.
- Product data comes from Firestore.
- Images load from the approved image domain.
- Search, filters, sorting, variants, and cart actions work.
- Checkout revalidates prices and stock on the server.
- Duplicate submissions do not create duplicate orders.
- Payment status is verified server-side.
- Customer access is scoped to the authenticated customer.
- Admin operations require server-verified admin authorization.
- Supplier data is absent from public API responses and client bundles.
- No Google Sheets/Apps Script live-backend dependency remains.
- Responsive, keyboard-accessible layouts work on common screen sizes.
- Production build and deployment smoke tests pass.

## 10. Launch dependencies

- Approved business policies for shipping, returns, cancellations, privacy, and terms.
- Confirmed supplier/reselling terms and fulfilment process.
- Firebase project, rules, indexes, and admin provisioning.
- Cloudflare account, R2 bucket, and image domain.
- Payment gateway account and credentials if online payment is enabled.
- Customer support contact details.
- Real product data and legally usable product images.
