# Environments and Deployment

## 1. Environments

Use separate configuration for:
- Local development.
- Staging/preview.
- Production.

Prefer separate Firebase projects for staging and production when practical. Never test payment or destructive migrations against production data.

## 2. Required services

- Firebase project with Authentication and Firestore enabled.
- Firestore security rules and indexes deployed.
- Firebase Admin credentials configured securely for the server runtime.
- Cloudflare account and compatible Next.js/OpenNext deployment target.
- R2 bucket and chosen image delivery domain.
- Custom domain `plantrixbotanics.com`.
- Payment gateway account if online payments are enabled.
- Email/SMS provider only if the product requires transactional notifications.

## 3. Environment variables

See `.env.example`. Public Firebase configuration values may be exposed by design, but they are not authorization controls. Server credentials, payment secrets, and signing secrets must remain private.

## 4. Cloudflare compatibility checks

Before production deployment:
- Confirm the installed Next.js, React, OpenNext, and Cloudflare runtime versions are compatible.
- Verify Node.js APIs used by Firebase Admin SDK and other dependencies work in the chosen runtime.
- Verify server routes, authentication, cookies/session handling, image uploads, webhooks, and dynamic rendering.
- Verify environment variables and secrets are available in the production runtime.
- Configure cache headers carefully. Never publicly cache private account, checkout, order, or admin responses.
- Verify custom domain DNS and HTTPS.
- Run smoke tests against the actual deployed preview.

## 5. R2 configuration

- Create a private bucket for original assets if needed and a deliberate delivery strategy for public product images.
- Decide whether uploads use presigned URLs or a trusted server endpoint.
- Configure custom domain/CDN delivery and cache policy.
- Restrict write operations; public product images may be readable, but uploads and deletions must be authorized.
- Keep the R2 access key and secret in server-side secrets.
- Monitor storage and operation usage.

## 6. Release checklist

- [ ] Production environment values reviewed.
- [ ] No secrets committed.
- [ ] Firestore rules and indexes deployed.
- [ ] Admin role provisioned through trusted process.
- [ ] R2 upload and image delivery tested.
- [ ] Payment sandbox tested, if applicable.
- [ ] Webhook verification tested.
- [ ] Customer data access tests pass.
- [ ] Supplier data does not appear in public responses.
- [ ] Build passes.
- [ ] Mobile and desktop smoke tests pass.
- [ ] Domain and HTTPS verified.
- [ ] Error monitoring and backup plan documented.
- [ ] Rollback plan available.
