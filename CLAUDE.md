@AGENTS.md

# TiflToys — Headless Shopify Storefront

Custom **Next.js storefront** for **Tifl Toys** (tifltoys.com) — Islamic educational toys for
Muslim families in Canada. Shopify is used **headless**: this app renders the catalog and cart via
the **Storefront API**, and payment happens on **Shopify-hosted checkout**. We do not use the
Shopify theme/Liquid storefront. Editing a product/collection/blog in the Shopify admin flows
through to the site with no code change.

> See `MILESTONES.md` for the launch checklist and current status.

## Deployment
- Git repo root is **`tifltoys/`** (not the parent folder). Remote `origin` →
  **https://github.com/huchu19/TiflToysFrontend**, default branch **`main`**.
- Hosted on **Vercel**, connected to that GitHub repo: **pushing to `main` auto-deploys** to
  production (tifltoys.com). No manual deploy step.
- `.env.local` holds Shopify secrets and is gitignored — never commit it; env vars are set in the
  Vercel project settings.

## Stack
- **Next.js 16** (App Router) — read `node_modules/next/dist/docs/` before writing Next code; this
  version has breaking changes vs. older Next (see `AGENTS.md`).
- **React 19**, **TypeScript**, **Tailwind CSS v4** (config-in-CSS via `@theme` in `globals.css`).
- **lucide-react** for icons.

## Commands (run from `tifltoys/`)
- `npm run dev` — local dev server (http://localhost:3000)
- `npm run build` — production build (also the canonical type-check / pre-launch gate)
- `npm run lint` — ESLint (`eslint-config-next`)

## Shopify integration
- **Reads** live in `src/lib/shopify.ts` via `shopifyFetch<T>(query, variables)` against
  `https://{domain}/api/{API_VERSION}/graphql.json`. Reuse the existing helpers and the
  `PRODUCT_CARD_FRAGMENT`, `mapProductNode`, `mapImage`, `formatPrice` utilities — don't hand-roll
  new queries when one of these fits.
- **Homepage content** is sourced from specific Shopify handles in `src/lib/homepage.ts`
  (`HOMEPAGE_CONTENT`). To point a section at a different product/collection/blog, change the handle
  there. The `safe()` wrapper makes a section fail soft (logs + falls back) instead of breaking the page.
- **Cart** is the Shopify cart (source of truth): create/add/update/remove via Storefront cart
  mutations; checkout is the Shopify-hosted `checkoutUrl`. Cart state lives server-side keyed by a
  cart-id cookie (see `src/lib/shopify/cart.ts` + `src/components/cart/`). Do **not** track item
  counts locally — derive them from the fetched cart's `totalQuantity`.
- **Store facts:** currency **CAD**, market **Canada** only (v1, single market). Catalog mixes
  tracked-inventory and untracked products, and some products are multi-variant (e.g. 5-variant
  prayer mats). Treat `availableForSale` as the truth for purchasability; only show stock counts
  when `quantityAvailable` is non-null.

## Environment variables
Set in `.env.local` (see `.env.example`). Shopify access is **server-only** — no `NEXT_PUBLIC_`
token should be exposed to the browser once the cart refactor lands.
- `SHOPIFY_STORE_DOMAIN` — e.g. `xgmq1a-uw.myshopify.com` (the `.myshopify.com` domain, not the
  custom domain).
- `SHOPIFY_STOREFRONT_TOKEN` — Storefront API access token.

## Conventions
- **Server Components by default**; add `'use client'` only for interactivity (cart UI, forms,
  menus). Cart mutations go through **Server Actions**, not client fetches.
- **Brand tokens** (defined in `src/app/globals.css` `@theme`): colors `brand-purple #6B4FA0`,
  `brand-orange #F5862E`, `brand-green #5AB65C`, `brand-blue #93B1E0`, plus soft `bg-*` section
  backgrounds. Fonts: `font-fredoka` (headings/display) and `font-nunito` (body, default).
- **Routes:** `src/app/` — products (`/products`, catalogue supports `?q=` search), product detail
  (`/products/[handle]`), collections (`/collections`, `/collections/[handle]`), plus marketing/legal
  pages. Shared UI in `src/components/{layout,sections,ui}`.
- **Money:** format with `formatPrice` from `src/lib/shopify.ts`; never hardcode currency symbols.
- **Resilience:** keep Shopify reads fail-soft where a missing section shouldn't 500 the page.

## Verification
Before marking work done: `npm run build && npm run lint` clean, then exercise the affected flow in
`npm run dev`. Use the Shopify MCP tools to drive/confirm catalog + inventory states
(`get-shop-info`, `search_products`, `get-inventory-levels`, `set-inventory`).
