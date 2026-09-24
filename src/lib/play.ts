import { getProductByHandle, getProductPage, type ShopifyVariant } from './shopify';

// Which Shopify products power the /play experiences — same pattern as
// HOMEPAGE_CONTENT in lib/homepage.ts. Editing a product in the Shopify admin
// (renaming a variant, changing price) flows through automatically; only
// change these constants if the underlying product/variant is replaced.
export const PLAY_CONTENT = {
  matProductHandle: 'mosque-and-landscape-colorable-islamic-prayer-mat-for-kids-copy',
  hajjProductHandle: 'pilgrimhajj-a-sacred-journey-of-faith-fun-reflection-family-board-game',
} as const;

/** Resolve a fetch, logging and falling back instead of breaking the page —
 *  mirrors the `safe()` helper in lib/homepage.ts. */
async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[play] failed to load ${label}:`, err);
    return fallback;
  }
}

// The five colourable mat designs. `id` is the studio's internal key (used by
// the SVG line-art components and the ?design= query param); `variantTitle`
// must match the Shopify variant option value exactly so quantity/price/
// availability resolve live rather than being hardcoded.
export const MAT_DESIGNS = [
  { id: 'kaaba', name: 'Kaaba', variantTitle: 'Kaaba' },
  { id: 'road-to-mosque', name: 'Road to Mosque', variantTitle: 'Road to Mosque' },
  { id: 'walkway-to-mosque', name: 'Walkway to Mosque', variantTitle: 'Walkway to Mosque' },
  { id: 'mosque-under-stars', name: 'Mosque Under Stars', variantTitle: 'Mosque Under Stars' },
  { id: 'mosque-and-flowerets', name: 'Mosque & Flowerets', variantTitle: 'Mosque & Flowerets' },
] as const;

export type MatDesignId = (typeof MAT_DESIGNS)[number]['id'];

/** Live mat product + variants, resolved via the existing getProductPage(). */
export async function getMatProduct() {
  return safe('mat product', () => getProductPage(PLAY_CONTENT.matProductHandle), null);
}

/** Match a design id to its live Shopify variant, by variant title. Returns
 *  null if the variant has been renamed/removed in Shopify — callers fall
 *  back to linking to the product page instead of a broken add-to-cart. */
export function resolveMatVariant(
  variants: ShopifyVariant[],
  designId: MatDesignId,
): ShopifyVariant | null {
  const design = MAT_DESIGNS.find((d) => d.id === designId);
  if (!design) return null;
  return variants.find((v) => v.title === design.variantTitle) ?? null;
}

/** Live Hajj board game product, for the /play/hajj journey's closing CTA. */
export async function getHajjProduct() {
  return safe('hajj product', () => getProductByHandle(PLAY_CONTENT.hajjProductHandle), null);
}
