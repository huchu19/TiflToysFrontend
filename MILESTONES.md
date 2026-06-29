# TiflToys — Launch Milestones

Living checklist to take the custom Next.js storefront from "browsable demo" to a launch-ready
headless Shopify store. See `CLAUDE.md` for architecture and the full plan for rationale.

**Status key:** ☐ not started · ◐ in progress · ☑ done

**Scope locked for v1:** guest checkout only (accounts deferred) · single market Canada/CAD ·
search yes / wishlist hidden · host on Vercel.

---

## M0 — Foundation, docs & hardening
- ☑ `CLAUDE.md` — architecture, stack, conventions, Shopify integration
- ☑ `MILESTONES.md` — this checklist
- ☑ `.env.example` documenting required vars
- ☑ Replace `!` env assertions in `src/lib/shopify.ts` with a checked accessor (`requireEnv`, clear error if missing)
- ☑ Move Shopify token to **server-only** env (drop `NEXT_PUBLIC_`); `.env.local` migrated, accessor still reads legacy names as fallback
- ☑ `src/app/error.tsx`, `src/app/global-error.tsx`, route-level `loading.tsx` (products + product detail)
- ☑ Centralize Shopify error handling in `shopifyFetch` (network, HTTP, GraphQL errors)

**Done when:** docs exist, app fails with a clear message if env is missing, and a thrown
Shopify error renders a friendly error boundary instead of a crash.

## M1 — Cart as Shopify source of truth ⭐ (core of the launch)
- ☑ `src/lib/shopify/cart.ts` — `getCart`, `createCart`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`;
  cart query returns lines, `cost`, `totalQuantity`, `checkoutUrl`
- ☑ Server Actions (`src/components/cart/actions.ts`) — add / update qty / remove via httpOnly cart-id cookie
- ☑ Rewrite `src/context/CartContext.tsx` — holds fetched cart, `useOptimistic`, real `itemCount`
- ☑ `src/components/cart/CartDrawer.tsx` — line items, qty stepper, remove, subtotal, Checkout link
- ☑ `src/app/cart/page.tsx` — full cart view (`CartView`)
- ☑ Wire `Navbar.tsx` cart button to open drawer (not jump to checkout)
- ☑ Update `AddToCart.tsx` to add + open drawer

**Done when:** add/update/remove all sync to Shopify, cart persists across reloads, and Checkout
lands on Shopify-hosted checkout with matching items/total in CAD.
_Verified: cartCreate → 2× line → subtotal 49.98 CAD → checkoutUrl on tifltoys.com._

## M2 — Stock / inventory accuracy
- ☑ Add `availableForSale` (cards + variants), `currentlyNotInStock`, `quantityAvailable` to queries
- ☑ Cards + product page: Sold out badge / "Low stock — only N left" / disable add when unavailable
- ☑ Cart: cap qty at `quantityAvailable`; flag lines that became unavailable
- ⚠️ **Action needed:** `quantityAvailable`/`currentlyNotInStock` require the
  `unauthenticated_read_product_inventory` Storefront scope. The current token lacks it, so stock
  counts/caps are **gracefully disabled** (auto-detected fallback in `shopifyFetchInventory`).
  Grant the scope in Shopify admin to light up "only N left" + qty caps. `availableForSale`
  (Sold-out) works without it.

**Done when:** setting a variant to 0 in Shopify shows Sold out and blocks add-to-cart on the site.

## M3 — Search & catalogue polish
- ☑ Wire navbar search → `/products?q=…` (expandable search bar)
- ☑ Basic sort (featured / newest / price asc / desc) via `?sort=` + `ProductSort` control
- ☑ Confirm multi-variant rendering — per-variant price + availability; all variant images in gallery
  (auto image-switch on variant select deferred as polish)

**Done when:** searching from the navbar returns correct results with a clean empty state.

## M4 — Contact form & legal/trust content
- ☑ `ContactForm.tsx` sends via Server Action (`sendContactMessage`) — validation, honeypot, Resend REST;
  logs server-side when no provider configured (dev-safe)
- ☑ Privacy / terms / refunds have store-accurate draft text + shipping/returns section
  (final legal sign-off remains the owner's; `draft` banner now opt-in)

**Done when:** a submitted contact message is received and policy pages are launch-accurate.

## M5 — SEO & launch readiness
- ☑ `src/app/sitemap.ts` (static + product/collection handles) and `src/app/robots.ts`
- ☑ `metadataBase` + default Open Graph/Twitter metadata; per-product OG + canonical
- ☑ JSON-LD `Product` structured data on product pages (AggregateOffer + availability)
- ☑ `manifest.ts` + `/icon.svg`; favicon present; `next.config.ts` image domains confirmed (cdn.shopify.com)

**Done when:** sitemap/robots resolve, product pages pass the Rich Results test, OG previews render.

## M6 — Cleanup of deferred features
- ☑ Hide wishlist icon in `Navbar.tsx`; account icon stubbed disabled ("Accounts coming soon")
- ☐ Optional: Vercel Analytics + Shopify Web Pixel / GA4 (deferred)

**Done when:** no dead icons ship; deferred features have clean TODO extension points.

## M7 — Deploy to Vercel & domain cutover
- ☐ Add env vars in Vercel; deploy preview; run smoke tests
- ☐ DNS cutover plan: point apex + `www` → Vercel; Shopify keeps serving checkout on its domain
- ☐ Post-deploy end-to-end smoke test (browse → cart → checkout) before flipping DNS

**Done when:** the live custom domain serves the Next.js site and a test order completes on
Shopify checkout.

---

## Post-launch backlog (deferred)
- Customer accounts / login / order history (Shopify Customer Account API)
- Wishlist (client-side or metafield-backed)
- Shopify Markets — multi-currency / international pricing (`@inContext`, country selector)
- Product reviews, related products, advanced filtering/facets
