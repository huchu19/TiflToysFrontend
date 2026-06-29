import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollectionPage, getCollections } from '@/lib/shopify';
import { CATEGORY_LABELS } from '@/lib/categories';
import PageHeader from '@/components/layout/PageHeader';
import { ProductCard, toProductCard } from '@/components/sections/ProductCard';

export async function generateStaticParams() {
  try {
    const collections = await getCollections(100);
    const handles = new Set([...collections.map((c) => c.handle), ...Object.keys(CATEGORY_LABELS)]);
    return [...handles].map((handle) => ({ handle }));
  } catch {
    return Object.keys(CATEGORY_LABELS).map((handle) => ({ handle }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionPage(handle);
  const title = collection?.title ?? CATEGORY_LABELS[handle];
  return { title: title ? `${title}` : 'Collection not found' };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const collection = await getCollectionPage(handle);
  const knownLabel = CATEGORY_LABELS[handle];

  // Real Shopify collection OR a curated footer category → render; else 404.
  if (!collection && !knownLabel) notFound();

  const title = collection?.title ?? knownLabel;
  const products = collection?.products ?? [];

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <PageHeader title={title} subtitle={collection?.description || undefined} />

      {products.length === 0 ? (
        <div className="mt-14 text-center">
          <div className="text-6xl" aria-hidden>
            🧸
          </div>
          <p className="mt-4 font-fredoka text-lg font-semibold text-brand-purple">
            This collection is coming soon.
          </p>
          <p className="mx-auto mt-2 max-w-md text-gray-600">
            We&rsquo;re still curating toys for this collection. In the meantime, explore everything we have.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-purple px-8 py-3.5 font-fredoka text-sm font-semibold tracking-wide text-white shadow-md transition-transform hover:scale-[1.03]"
          >
            Browse all toys
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} {...toProductCard(p, i)} />
          ))}
        </div>
      )}
    </main>
  );
}
