import Link from 'next/link';
import { Star, Sparkle } from '@/components/ui/Doodles';
import { Media } from '@/components/ui/Media';
import type { ShopifyArticle } from '@/lib/shopify';

// Fallback cards shown until the Shopify "news" blog has published articles.
const FALLBACK = [
  { title: 'Honest opinion for informed playtime', date: '24 March, 2026', emoji: '🧒', href: '/products' },
  { title: 'Honest opinion for informed playtime', date: '24 March, 2026', emoji: '👧', href: '/products' },
  { title: 'Honest opinion for informed playtime', date: '24 March, 2026', emoji: '👨‍👦', href: '/products' },
];

const EXCERPT_FALLBACK = 'When it comes to selecting toys for children, it’s essential to make informed decisions….';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

type Card = {
  title: string;
  date: string;
  href: string;
  excerpt: string;
  image?: ShopifyArticle['image'];
  emoji?: string;
};

export default function Insights({ articles = [] }: { articles?: ShopifyArticle[] }) {
  const cards: Card[] = articles.length
    ? articles.map((a) => ({
        title: a.title,
        date: formatDate(a.publishedAt),
        href: `/blog/${a.handle}`,
        excerpt: a.excerpt || EXCERPT_FALLBACK,
        image: a.image,
      }))
    : FALLBACK.map((f) => ({ ...f, excerpt: EXCERPT_FALLBACK }));

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Star className="h-7 w-7 text-bg-pink" />
          <h2 className="font-fredoka text-4xl font-bold text-brand-purple sm:text-5xl">
            Insights &amp; Inspiration
          </h2>
          <Sparkle className="h-7 w-7 text-brand-green" />
        </div>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Discover tips, trends and stories to spark your new adventures!
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {cards.map((card, i) => (
          <article key={card.href + i}>
            <Link href={card.href} className="group block">
              <Media
                image={card.image}
                emoji={card.emoji}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[4/3] w-full rounded-2xl bg-bg-cream transition-transform group-hover:scale-[1.02]"
              />
              <p className="mt-4 text-xs font-medium text-gray-400">{card.date}</p>
              <h3 className="mt-1 font-fredoka text-base font-bold uppercase tracking-wide text-brand-purple">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{card.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
