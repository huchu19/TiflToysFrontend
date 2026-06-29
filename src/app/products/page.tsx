import type { Metadata } from 'next';
import { getAllProductCards, searchProductCards, type ProductSort as Sort } from '@/lib/shopify';
import { ProductCard, toProductCard } from '@/components/sections/ProductCard';
import { Star, Sparkle } from '@/components/ui/Doodles';
import ProductSort from './ProductSort';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse meaningful Islamic educational toys for curious minds.',
};

const VALID_SORTS: Sort[] = ['featured', 'newest', 'price-asc', 'price-desc'];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { q, sort: sortParam } = await searchParams;
  const query = q?.trim();
  const sort: Sort = VALID_SORTS.includes(sortParam as Sort) ? (sortParam as Sort) : 'featured';
  const products = query
    ? await searchProductCards(query, 50, sort)
    : await getAllProductCards(50, sort);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Star className="h-7 w-7 text-brand-orange" />
          <h1 className="font-fredoka text-4xl font-bold text-brand-purple sm:text-5xl">
            {query ? 'Search results' : 'All Products'}
          </h1>
          <Sparkle className="h-7 w-7 text-brand-green" />
        </div>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          {query
            ? `Showing ${products.length} result${products.length === 1 ? '' : 's'} for “${query}”.`
            : 'Toys that go beyond fun, helping kids discover new knowledge through play.'}
        </p>
      </div>

      {products.length > 0 && (
        <div className="mt-10 flex items-center justify-between border-b border-gray-100 pb-4">
          <p className="text-sm text-gray-500">
            {products.length} product{products.length === 1 ? '' : 's'}
          </p>
          <ProductSort current={sort} />
        </div>
      )}

      {products.length === 0 ? (
        <p className="mt-16 text-center font-fredoka text-lg text-gray-500">
          {query
            ? `No products match “${query}”. Try a different search.`
            : 'No products found.'}
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} {...toProductCard(p, i)} />
          ))}
        </div>
      )}
    </main>
  );
}
