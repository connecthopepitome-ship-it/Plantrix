# Plantrix Botanics

A modern, mobile-first e-commerce storefront for two product departments: **Plants & Botanics** and **Home & Everyday Essentials**.

> This repository documentation pack is intended to be reviewed and approved before implementation begins. It defines the initial product scope, architecture, data model, UX direction, security baseline, and delivery plan. It is not evidence that integrations or deployment have already been implemented.

## Product goals

- Create a distinctive, premium botanical lifestyle brand with a complementary home-utility shopping experience.
- Support a universal product catalogue rather than a category-specific schema.
- Use Firebase for application data and authentication, Cloudflare for hosting, and Cloudflare R2 as the preferred product-image object store.
- Provide a secure admin dashboard for catalogue, inventory, orders, collections, and site content.
- Support supplier-assisted reselling with supplier details kept private.
- Deliver a responsive, accessible, fast storefront with reliable cart and checkout flows.

## Proposed stack

- Next.js App Router, TypeScript, React, Tailwind CSS.
- Firebase Authentication, Cloud Firestore, Firebase Admin SDK, App Check where appropriate.
- Cloudflare Workers/Pages deployment using a compatible OpenNext adapter, after verifying framework compatibility.
- Cloudflare R2 for product images, served through a controlled public custom domain or image delivery layer.
- Payment provider to be selected and configured before live payments are enabled.

## Product departments

1. **Plants & Botanics** — pots, planters, indoor/artificial plants, gardening accessories, plant stands, watering tools, balcony and botanical décor.
2. **Home & Everyday Essentials** — kitchen utilities, storage, organizers, bathroom accessories, cleaning tools, laundry accessories, space-saving products, and practical home accessories.

## Documentation index

- [Product requirements](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Data model](docs/DATA_MODEL.md)
- [UI/UX guidelines](docs/UI_UX_GUIDELINES.md)
- [Security baseline](docs/SECURITY.md)
- [Deployment and environments](docs/DEPLOYMENT.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Contribution workflow](CONTRIBUTING.md)
- [Environment variable template](.env.example)

## Before development starts

1. Review and approve the PRD, architecture, data model, and security requirements.
2. Inspect the existing repository and preserve working features where practical.
3. Confirm Firebase project and billing setup, Cloudflare account/domain, R2 bucket/domain, and payment provider.
4. Create development/staging/production environment configuration.
5. Implement incrementally and test each milestone before moving to the next.
6. Do not commit secrets, customer data, supplier credentials, or production exports.

## Important boundaries

- Google Sheets and Google Apps Script are **not** part of the live application backend.
- Firestore stores product metadata and image object keys/URLs; image binaries belong in R2.
- The browser must never be trusted for product price, inventory, payment status, discount eligibility, or admin authorization.
- Automated purchasing from Meesho is not assumed. Supplier availability, terms, and fulfilment must be confirmed through an authorized workflow.
- Do not publish fabricated reviews, ratings, sales counts, stock claims, delivery promises, or discounts.
