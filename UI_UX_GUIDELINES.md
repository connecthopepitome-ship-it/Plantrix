# UI/UX Guidelines — Plantrix Botanics

## 1. Design direction

A modern botanical lifestyle brand with two complementary shopping departments. The experience should feel editorial, product-led, confident, warm, and polished—not like a generic dropshipping template.

## 2. Brand tokens

Suggested initial palette:

| Token | Value | Use |
|---|---|---|
| Forest | `#183D30` | Deep brand surfaces and footer |
| Botanical | `#285744` | Primary actions and links |
| Sage | `#E4EBDD` | Soft botanical backgrounds |
| Ivory | `#FAF8F2` | Main warm background |
| White | `#FFFFFF` | Product surfaces |
| Charcoal | `#202520` | Main text |
| Muted | `#70776F` | Secondary text |
| Terracotta | `#C47756` | Restrained accent |

Confirm contrast ratios before release. Colour alone must not communicate status.

## 3. Typography

Preferred pairing:
- Headings: Manrope or Outfit.
- Body/UI: Inter.

Use local/self-hosted fonts where practical. Establish a responsive type scale and avoid overly thin body text. Keep line length comfortable for reading.

## 4. Department personality

### Plants & Botanics
- Forest green, sage, warm ivory.
- Editorial plant and interior photography.
- Natural textures only as subtle accents.
- Focus on atmosphere, care, and styling.

### Home & Everyday Essentials
- White, warm stone, charcoal, terracotta accent.
- Clean utility-focused product photography.
- Strong information hierarchy for size, material, capacity, and use.
- Focus on solving a practical problem.

Shared header, checkout, buttons, product primitives, spacing, and accessibility rules should remain consistent.

## 5. Layout principles

- Strong visual hierarchy and intentional whitespace.
- Use a consistent spacing scale.
- Avoid excessive card borders, shadows, gradients, and rounded pills.
- Use clear image aspect ratios and consistent product grids.
- Use asymmetric editorial compositions only where they improve storytelling.
- Mobile-first layout with accessible touch targets.
- Sticky elements should not obscure content or keyboard focus.
- Respect `prefers-reduced-motion`.

## 6. Product cards

Required states:
- Default.
- Hover/focus.
- Out of stock.
- Sale (only if the reference price is valid).
- Variant available.
- Quick-add success/error.

Do not invent ratings, review counts, urgency labels, low-stock claims, or sales counts. Use alt text appropriate to the product image.

## 7. Motion

Use subtle opacity, transform, and drawer transitions. Avoid scroll-jacking, long animation sequences, excessive parallax, and motion that delays core shopping actions.

## 8. Accessibility

- Semantic headings and landmarks.
- Keyboard-operable navigation, filters, modals, drawers, and galleries.
- Visible focus indicators.
- Accessible form labels and errors.
- Appropriate colour contrast.
- Descriptive alt text.
- Dialog focus management.
- Reduced-motion support.
- Screen-reader announcements for cart updates and validation feedback.

## 9. Responsive breakpoints

Use the project's existing breakpoint conventions if consistent. Test at minimum:
- Small mobile: 320–375 px.
- Typical mobile: 390–430 px.
- Tablet: 768 px.
- Laptop: 1024–1280 px.
- Wide desktop: 1440 px and above.

## 10. Required UX states

Design and implement loading, skeleton, empty, error, success, offline/network failure, out-of-stock, expired-session, invalid-coupon, payment-pending, payment-failed, and order-confirmation states.
