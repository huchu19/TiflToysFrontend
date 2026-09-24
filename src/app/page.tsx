import Hero from '@/components/sections/Hero';
import ShippingBar from '@/components/sections/ShippingBar';
import FeaturedCollection from '@/components/sections/FeaturedCollection';
import HajjTeaser from '@/components/sections/HajjTeaser';
import ColouringTeaser from '@/components/sections/ColouringTeaser';
import TrustShowcase from '@/components/sections/TrustShowcase';
import SearchBlock from '@/components/sections/SearchBlock';
import Testimonials from '@/components/sections/Testimonials';
import DIYHighlight from '@/components/sections/DIYHighlight';
import Newsletter from '@/components/sections/Newsletter';
import { getHomepageContent } from '@/lib/homepage';
import { formatPrice } from '@/lib/shopify';

// Parent-first, then play: trust (shipping) lands right under the hero, the
// two /play centrepieces get real estate once the buying case is made, and
// the rest follows the original storefront rhythm.
export default async function Home() {
  const { featured, heroImage, diy, testimonials } = await getHomepageContent();

  return (
    <main className="overflow-x-hidden">
      <Hero image={heroImage ?? undefined} />
      <ShippingBar />
      <FeaturedCollection products={featured} />
      <HajjTeaser />
      <ColouringTeaser />
      <TrustShowcase />
      <SearchBlock />
      <Testimonials testimonials={testimonials} />
      <DIYHighlight
        image={diy?.image}
        title={diy?.title}
        price={diy ? formatPrice(diy.amount) : undefined}
        description={diy?.description}
        variantId={diy?.variantId}
        href={diy ? `/products/${diy.handle}` : undefined}
      />
      <Newsletter />
      {/* Insights & Inspirations temporarily hidden — restore
          <Insights articles={articles} /> (components/sections/Insights)
          when new content is ready. */}
    </main>
  );
}
