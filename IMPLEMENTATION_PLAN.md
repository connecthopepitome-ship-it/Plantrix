# Implementation Plan

Work in small, testable milestones. Do not start with a full rewrite before inspecting the existing repository.

## Phase 0 — Discovery and approval
- Inspect repository, package scripts, routes, components, Firebase configuration, existing data and current deployment.
- Identify reusable MESHOP-derived workflows.
- Confirm versions and Cloudflare compatibility.
- Review PRD, architecture, data model, UX, and security documents.
- Record open decisions before implementation.

**Exit criteria:** agreed scope, architecture, risks, and migration plan.

## Phase 1 — Foundation and design system
- Establish design tokens, fonts, responsive primitives, buttons, inputs, drawers, dialogs, badges, product cards, skeletons, empty states, and toasts.
- Implement brand header/footer and responsive navigation.
- Create accessible Plants & Botanics and Home & Everyday Essentials themes.
- Add lint/typecheck/build scripts if missing.

**Exit criteria:** consistent, responsive visual foundation with no critical accessibility blockers.

## Phase 2 — Firebase and data layer
- Define Firestore schemas and indexes.
- Implement public DTO mapping and server validation.
- Configure Authentication and trusted admin authorization.
- Implement security rules and tests.
- Implement R2 upload/delivery integration.
- Remove Sheets/Apps Script backend dependencies after confirming they are not required elsewhere.

**Exit criteria:** public/private data boundaries tested; images and products persist.

## Phase 3 — Catalogue and merchandising
- Implement homepage, category pages, collection pages, search, filters, sorting, pagination, product detail, variants, and related products.
- Connect all pages to real Firestore data.
- Add admin product/category/collection management and CSV import/export.

**Exit criteria:** catalogue workflows pass functional tests.

## Phase 4 — Cart and checkout
- Implement cart persistence and server-side revalidation.
- Implement order creation with idempotency and inventory safeguards.
- Implement payment provider in test mode if credentials are available.
- Verify signed webhooks and payment-state transitions.
- Implement confirmation and safe order tracking.

**Exit criteria:** duplicate order, price manipulation, stock race, and payment spoofing tests pass.

## Phase 5 — Customer account and operations
- Implement customer orders and address features if in launch scope.
- Implement admin order workflow, tracking, refunds/cancellations where supported, audit trail, and operational dashboard.
- Add safe notifications if configured.

**Exit criteria:** customer isolation and admin workflows pass.

## Phase 6 — SEO, performance, and launch readiness
- Add metadata, canonical URLs, sitemap, robots, structured data, and error pages.
- Optimize images and caching.
- Test accessibility, performance, mobile layout, and browser compatibility.
- Deploy to Cloudflare preview and run smoke tests.
- Complete security and launch checklist.

**Exit criteria:** successful production build, verified preview deployment, and approved launch checklist.

## Definition of done for each phase
- Code reviewed.
- Type checks and lint pass.
- Relevant unit/integration tests pass.
- No secrets or sensitive data committed.
- UI states are implemented.
- Documentation updated.
- Any incomplete integration is explicitly labelled; no false claim of completion.
