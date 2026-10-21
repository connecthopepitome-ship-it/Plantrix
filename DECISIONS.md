# Architecture Decision Records

## ADR-001: Firebase is the application backend
**Status:** Proposed

Use Firestore for structured application data and Firebase Authentication for identity. Google Sheets and Google Apps Script are excluded from the live application backend.

**Reason:** Centralized, queryable data model with server-side validation and application security rules.

## ADR-002: Cloudflare R2 is the preferred product image store
**Status:** Proposed

Store image binaries in R2 and store object keys/metadata in Firestore.

**Reason:** Separates media from product records and aligns with Cloudflare hosting. Actual cost depends on storage, operations, image delivery design, and current pricing. Confirm current terms before launch.

## ADR-003: Universal product schema
**Status:** Proposed

Use shared product fields plus structured, category-specific specifications and variants.

**Reason:** Supports both botanical and household product departments without a schema rewrite for every category.

## ADR-004: Supplier data is private
**Status:** Required

Supplier URLs, source costs, supplier SKUs, and internal notes must never be sent to public clients.

**Reason:** Protects business-sensitive sourcing and margin data.

## ADR-005: Supplier purchasing is not automatically assumed
**Status:** Required

Initial fulfilment is admin-reviewed. Any future automation requires a supported and authorized workflow.

**Reason:** Avoids relying on unverified marketplace automation or unsupported fulfilment behavior.
