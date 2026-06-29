import Hero from '@/components/sections/Hero';
import PromoBar from '@/components/sections/PromoBar';
import FeaturedCollection from '@/components/sections/FeaturedCollection';
import TrustShowcase from '@/components/sections/TrustShowcase';
import SearchBlock from '@/components/sections/SearchBlock';
import Testimonials from '@/components/sections/Testimonials';
import DIYHighlight from '@/components/sections/DIYHighlight';
import Newsletter from '@/components/sections/Newsletter';
import Insights from '@/components/sections/Insights';
import { getHomepageContent } from '@/lib/homepage';
import { formatPrice } from '@/lib/shopify';

export default async function Home() {
  const { featured, hero, trustImage, diy, articles } = await getHomepageContent();

  return (
    <main className="overflow-x-hidden">
      <Hero image={hero?.image} />
      <PromoBar />
      <FeaturedCollection products={featured} />
      <TrustShowcase image={trustImage ?? undefined} />
      <SearchBlock />
      <Testimonials />
      <DIYHighlight
        image={diy?.image}
        title={diy?.title}
        price={diy ? formatPrice(diy.amount) : undefined}
        description={diy?.description}
        variantId={diy?.variantId}
        href={diy ? `/products/${diy.handle}` : undefined}
      />
      <Newsletter />
      <Insights articles={articles} />
    </main>
  );
}
