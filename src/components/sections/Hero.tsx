import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Star, Curl, Arc, Sparkle } from '@/components/ui/Doodles';
import { Media } from '@/components/ui/Media';
import type { ShopifyImage } from '@/lib/shopify';

export default function Hero({ image }: { image?: ShopifyImage }) {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-12 pt-4 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* Left — headline + copy */}
        <div className="relative">
          <Star className="absolute -top-2 right-10 hidden h-7 w-7 text-bg-yellow sm:block" />

          <h1 className="font-fredoka text-6xl font-bold leading-[1.02] sm:text-7xl">
            <span className="block text-brand-green">Play.</span>
            <span className="relative inline-block text-brand-purple">
              Imagine.
            </span>
            <span className="block">
              <span className="relative inline-block text-brand-orange">
                Grow.
                <Sparkle className="absolute -right-9 top-1 h-6 w-6 text-brand-green" />
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-sm text-xl text-gray-600">
            Meaningful toys for curious minds.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-brand-purple px-9 py-4 font-fredoka text-base font-semibold tracking-wide text-white shadow-md transition-transform hover:scale-[1.03]"
          >
            SHOP NOW
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Right — hero image with doodles */}
        <div className="relative">
          <Curl className="absolute -top-6 left-6 z-10 hidden h-10 w-10 text-brand-purple sm:block" />
          <Arc className="absolute -top-4 right-2 z-10 hidden h-10 w-10 text-brand-orange sm:block" />
          <Media
            image={image}
            label="Kids playing the PilgrimHajj board game"
            emoji="🧩"
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[4/3] w-full rounded-3xl bg-bg-cream shadow-sm"
          />
        </div>
      </div>
    </section>
  );
}
