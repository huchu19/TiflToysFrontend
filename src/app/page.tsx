import Hero from '@/components/sections/Hero';
import FeaturedCollection from '@/components/sections/FeaturedCollection';
import TrustShowcase from '@/components/sections/TrustShowcase';
import ShippingBar from '@/components/sections/ShippingBar';
import SearchBlock from '@/components/sections/SearchBlock';
import Testimonials from '@/components/sections/Testimonials';
import DIYHighlight from '@/components/sections/DIYHighlight';
import Newsletter from '@/components/sections/Newsletter';
import { getHomepageContent } from '@/lib/homepage';
import { formatPrice } from '@/lib/shopify';

export default async function Home() {
  const { featured, heroImage, diy, testimonials } = await getHomepageContent();

  return (
    <main className="overflow-x-hidden">
      <Hero image={heroImage ?? undefined} />
      <FeaturedCollection products={featured} />
      <TrustShowcase />
      <ShippingBar />
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
