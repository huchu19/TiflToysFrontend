import { Media } from '@/components/ui/Media';
import type { ShopifyImage } from '@/lib/shopify';

// Single banner image for the Free Shipping section. The trust bar (free
// shipping / warranty / guarantee) is baked into the image itself, set in the
// Shopify admin via the `homepage.trust_image` Shop metafield — so it stays off
// product pages. The ~4:3 ratio matches the source so the baked-in bar at the
// top edge isn't cropped by object-cover.
export default function TrustShowcase({ image }: { image?: ShopifyImage }) {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8">
      <Media
        image={image}
        label="Children building the Mosque Kaaba LEGO set"
        emoji="🕌"
        sizes="(min-width: 1280px) 1280px, 100vw"
        className="aspect-[4/3] w-full rounded-3xl bg-bg-cream"
      />
    </section>
  );
}
