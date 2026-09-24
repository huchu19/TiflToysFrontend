import { formatPrice, type ShopifyImage, type ShopifyProductCard } from '@/lib/shopify';

// Rotating placeholder visuals (tile colour + emoji) applied by position, used
// when a product has no image.
const TONES = ['bg-bg-mint', 'bg-bg-pink', 'bg-bg-blue', 'bg-bg-yellow', 'bg-bg-peach'];
const EMOJIS = ['🕋', '🎨', '📖', '🧩', '🧸'];

export type ProductCardProps = {
  title: string;
  price: string;
  href: string;
  image?: ShopifyImage;
  /** Placeholder caption + emoji shown only when no image is available. */
  label: string;
  emoji: string;
  /** Tailwind background class for the image tile. */
  tone: string;
  /** Show a "Sold out" badge and dim the tile when no variant is purchasable. */
  soldOut?: boolean;
  /** Single-variant products can be quick-added straight from the grid. */
  variantId?: string | null;
};

/**
 * Map a Shopify product into card props (shared by all product grids). Kept
 * in its own plain (non-'use client') module — ProductCard.tsx itself is a
 * Client Component (it needs useState/useCart for the quick-add button), and
 * a 'use client' file's exports can only be rendered, not called directly, so
 * Server Components calling this (FeaturedCollection, /products) need it from
 * a server-safe file.
 */
export function toProductCard(p: ShopifyProductCard, i = 0): ProductCardProps {
  return {
    title: p.title,
    price: formatPrice(p.amount),
    href: `/products/${p.handle}`,
    image: p.image,
    label: p.title,
    emoji: EMOJIS[i % EMOJIS.length],
    tone: TONES[i % TONES.length],
    soldOut: !p.availableForSale,
    // Quick-add only for single-variant products — a multi-variant product
    // (e.g. the 5-way prayer mat) needs the buyer to pick a design first.
    variantId: p.hasMultipleVariants ? null : p.variantId,
  };
}
