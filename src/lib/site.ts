// Canonical site identity — used for metadataBase, sitemap, robots, OG tags.
// Override the URL per-environment with NEXT_PUBLIC_SITE_URL (see .env.example).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tifltoys.com').replace(
  /\/$/,
  '',
);

export const SITE_NAME = 'TiflToys';
export const SITE_DESCRIPTION =
  'Islamic educational toys for Muslim families in Canada — meaningful toys, games, and crafts for curious minds.';

// Pre-order messaging. Every product except prayer mats is a pre-order that
// ships in September — flagged per-product with a `preorder` tag in the Shopify
// admin (add/remove the tag to change which items are pre-order). Update the
// ship label here in one place when the window changes.
export const PREORDER_SHIP_LABEL = 'Ships September 2026';
export const PREORDER_ANNOUNCEMENT =
  'All items are available to pre-order for September — prayer mats ship now.';
