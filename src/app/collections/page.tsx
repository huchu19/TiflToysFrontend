import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollections } from '@/lib/shopify';
import { CATEGORY_LABELS } from '@/lib/categories';
import PageHeader from '@/components/layout/PageHeader';
import { Media } from '@/components/ui/Media';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Browse our curated collections of Islamic educational toys.',
};

const TONES = ['bg-bg-mint', 'bg-bg-pink', 'bg-bg-blue', 'bg-bg-yellow', 'bg-bg-peach'];

export default async function CollectionsPage() {
  const live = await getCollections(50);
  // Merge live Shopify collections with the curated footer categories (deduped).
  const seen = new Set(live.map((c) => c.handle));
  const categories = Object.entries(CATEGORY_LABELS)
    .filter(([handle]) => !seen.has(handle))
    .map(([handle, title]) => ({ handle, title, image: null }));
  const all = [...live, ...categories];

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <PageHeader
        title="Collections"
        subtitle="Explore our toys grouped by what they teach and who they’re for."
      />

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((c, i) => (
          <Link key={c.handle} href={`/collections/${c.handle}`} className="group block">
            <div className={`overflow-hidden rounded-3xl ${TONES[i % TONES.length]} transition-transform group-hover:scale-[1.02]`}>
              <Media image={c.image} emoji="🧸" label={c.title} className="aspect-[4/3] w-full" sizes="(min-width: 1024px) 33vw, 100vw" />
            </div>
            <h2 className="mt-4 font-fredoka text-lg font-semibold text-brand-purple">{c.title}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
