# Security Baseline

Security must be designed before checkout and admin features are exposed publicly.

## Authentication and authorization
- Verify Firebase ID tokens on the server for protected operations.
- Require a trusted admin role/claim for every admin API and server action.
- Do not treat client-side route guards or hidden buttons as authorization.
- Prevent users from assigning themselves admin roles.
- Apply least-privilege access.

## Firestore rules
- Deny by default.
- Public users may read only explicitly published, public-safe product/category/collection data.
- Public clients must not write product catalogue or privileged settings.
- Customers may read only their own permitted profile and orders.
- Sensitive order creation, payment changes, inventory operations, and admin writes should go through trusted server-side logic.
- Never expose supplier cost, supplier URLs, internal notes, or admin audit records.

## R2 upload security
- Authenticate and authorize uploads.
- Generate object keys server-side.
- Enforce file size and image type/format limits.
- Validate file contents rather than trusting extension or browser MIME.
- Prevent arbitrary path writes and overwrites.
- Remove EXIF metadata where practical.
- Do not expose R2 credentials or secret keys in client code.
- Use a controlled public domain or delivery route with appropriate cache headers.
- Implement deletion/replacement rules to avoid orphaned files.

## Checkout and payments
- Recalculate all prices, variants, stock, discounts, shipping, and totals on the server.
- Use idempotency keys or equivalent duplicate-order protection.
- Verify payment provider webhook signatures.
- Make webhook processing idempotent.
- Do not trust payment success from a browser redirect.
- Do not store card numbers or CVVs.
- Keep provider secrets in deployment secrets, not committed files.
- Record payment state transitions safely.

## Privacy
- Collect only necessary customer data.
- Do not put addresses, phone numbers, email addresses, or supplier URLs in analytics events.
- Limit access and retention for customer data.
- Publish accurate privacy, cancellation, shipping, and returns policies.
- Obtain consent for marketing communications.

## Operational security
- Never commit `.env` files or service account credentials.
- Use separate development/staging/production projects or isolated configuration.
- Enable App Check where compatible and beneficial.
- Rate-limit sensitive endpoints where appropriate.
- Validate input and output schemas.
- Log security-relevant events without logging secrets.
- Keep dependencies updated and run dependency/security checks.
- Create a documented backup and recovery plan.

## Launch gate
Do not launch live checkout until rules, admin authorization, price/stock validation, payment webhooks, customer order isolation, and supplier-data privacy have been tested.
