import Link from 'next/link';
import { Media } from '@/components/ui/Media';
import { formatPrice, type ShopifyImage, type ShopifyProductCard } from '@/lib/shopify';

// Rotating placeholder visuals (tile colour + emoji) applied by position, used
// when a product has no image.
const TONES = ['bg-bg-mint', 'bg-bg-pink', 'bg-bg-blue', 'bg-bg-yellow', 'bg-bg-peach'];
const EMOJIS = ['🕋', '🎨', '📖', '🧩', '🧸'];

/** Map a Shopify product into card props (shared by all product grids). */
export function toProductCard(p: ShopifyProductCard, i = 0): ProductCardProps {
  return {
    title: p.title,
    price: formatPrice(p.amount),
    href: `/products/${p.handle}`,
    image: p.image,
    label: p.title,
    emoji: EMOJIS[i % EMOJIS.length],
    tone: TONES[i % TONES.length],
    // Pre-order items stay purchasable, so they never read as "sold out".
    soldOut: !p.preorder && !p.availableForSale,
    preorder: p.preorder,
  };
}

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
  /** Show a "Pre-order" badge — item ships later but is orderable now. */
  preorder?: boolean;
};

export function ProductCard({ title, price, href, image, label, emoji, tone, soldOut, preorder }: ProductCardProps) {
  return (
    <Link href={href} className="group block">
      <div className={`relative overflow-hidden rounded-3xl ${tone} transition-transform group-hover:scale-[1.02]`}>
        <Media
          image={image}
          label={label}
          emoji={emoji}
          className={`aspect-square w-full ${soldOut ? 'opacity-60' : ''}`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        {preorder ? (
          <span className="absolute left-3 top-3 rounded-full bg-brand-purple px-3 py-1 font-fredoka text-xs font-semibold tracking-wide text-white">
            Pre-order
          </span>
        ) : soldOut ? (
          <span className="absolute left-3 top-3 rounded-full bg-gray-900/80 px-3 py-1 font-fredoka text-xs font-semibold tracking-wide text-white">
            Sold out
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 font-fredoka text-lg font-semibold text-brand-purple">{title}</h3>
      <p className="mt-1 font-fredoka text-sm font-bold text-brand-purple/90">{price}</p>
    </Link>
  );
}
