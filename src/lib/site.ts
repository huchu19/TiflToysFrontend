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
