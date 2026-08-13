// Canonical site identity — used for metadataBase, sitemap, robots, OG tags.
// Override the URL per-environment with NEXT_PUBLIC_SITE_URL (see .env.example).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tifltoys.com').replace(
  /\/$/,
  '',
);

export const SITE_NAME = 'TiflToys';
export const SITE_DESCRIPTION =
  'Islamic educational toys for Muslim families in Canada — meaningful toys, games, and crafts for curious minds.';

// Pre-order messaging. Every product except prayer mats is a pre-order with
// Canadian deliveries beginning Fall 2026 — flagged per-product with a
// `preorder` tag in the Shopify admin (add/remove the tag to change which
// items are pre-order). Update the ship label here in one place when the
// window changes.
export const PREORDER_SHIP_LABEL = 'Ships Fall 2026';
export const PREORDER_ANNOUNCEMENT =
  'Colorable Prayer Mats Available Now (limited quantity). Canadian deliveries for remaining catalogue begins Fall 2026, pre-order now';

// Shipping. These MUST stay in sync with the Shopify shipping zones (Settings →
// Shipping and delivery → General profile), which is what actually charges at
// checkout: the "Ontario & Quebec" and "Rest of Canada" zones each carry a
// $3.00 Standard rate (subtotal ≤ $29.99) and a $0.00 Free rate (subtotal ≥ $30).
export const FREE_SHIPPING_THRESHOLD = 30;
export const SHIPPING_FLAT_RATE = 3;
/** Delivery estimates by destination — matches the two Shopify zones. */
export const SHIPPING_ZONES = [
  { region: 'Ontario & Quebec', estimate: '2–3 business days' },
  { region: 'Rest of Canada', estimate: '7–10 business days' },
] as const;

/** One-line summary used in the trust strip, cart and product pages. */
export const SHIPPING_SUMMARY = `Free shipping on orders over $${FREE_SHIPPING_THRESHOLD} · $${SHIPPING_FLAT_RATE} flat rate Canada-wide`;

/**
 * Free-shipping nudge for a cart subtotal: how much more to spend, or a
 * congratulation once the threshold is met. `null` for an empty cart.
 */
export function freeShippingProgress(subtotal: number): {
  qualified: boolean;
  remaining: number;
  message: string;
} | null {
  if (!Number.isFinite(subtotal) || subtotal <= 0) return null;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  if (remaining <= 0) {
    return { qualified: true, remaining: 0, message: 'Your order ships free 🎉' };
  }
  return {
    qualified: false,
    remaining,
    message: `You're $${remaining.toFixed(2)} away from free shipping`,
  };
}
