import { Media } from '@/components/ui/Media';
import type { ShopifyImage } from '@/lib/shopify';

// Single banner image, set in the Shopify admin via the `homepage.trust_image`
// Shop metafield — so it stays off product pages.
//
// The source image has a trust bar baked into its top edge whose copy is stale
// ("Free shipping over $50"); the live terms now come from ShippingBar below,
// which reads lib/site. This aspect ratio is deliberately taller than the
// source's 1864×1414 so object-cover + object-bottom crops that top strip off —
// the photo itself is untouched. The bar ends 7.9% down, so cropping 10% clears
// it with margin. Once the image is re-exported without the bar, drop
// `imageClassName` and restore `aspect-[4/3]`.
export default function TrustShowcase({ image }: { image?: ShopifyImage }) {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8">
      <Media
        image={image}
        label="Children building the Mosque Kaaba LEGO set"
        emoji="🕌"
        sizes="(min-width: 1280px) 1280px, 100vw"
        className="aspect-[1864/1272] w-full rounded-3xl bg-bg-cream"
        imageClassName="object-bottom"
      />
    </section>
  );
}
