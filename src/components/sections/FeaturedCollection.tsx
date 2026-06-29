import { Star, Sparkle } from '@/components/ui/Doodles';
import { ProductCard, toProductCard, type ProductCardProps } from './ProductCard';
import type { ShopifyProductCard } from '@/lib/shopify';

// Shown only if the Shopify "featured-collection" can't be loaded.
const FALLBACK: ProductCardProps[] = [
  { title: 'Kaaba Money Box', price: '$19.99', href: '/products', label: 'Wooden Kaaba money box', emoji: '🕋', tone: 'bg-bg-mint' },
  { title: 'Colorable Prayer Mat', price: '$17.00', href: '/products', label: 'Colour-in prayer mat', emoji: '🎨', tone: 'bg-bg-pink' },
  { title: 'Islamic Baby Board', price: '$14.00', href: '/products', label: 'Islamic baby board book', emoji: '📖', tone: 'bg-bg-blue' },
];

export default function FeaturedCollection({ products = [] }: { products?: ShopifyProductCard[] }) {
  const cards = products.length ? products.map((p, i) => toProductCard(p, i)) : FALLBACK;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Star className="h-7 w-7 text-brand-orange" />
          <h2 className="font-fredoka text-4xl font-bold text-brand-purple sm:text-5xl">
            Featured Collection
          </h2>
          <Sparkle className="h-7 w-7 text-brand-green" />
        </div>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Toys that go beyond fun, helping kids discover new knowledge through play.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <ProductCard key={card.href + card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
