import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export const metadata: Metadata = {
  title: 'Our Sectors',
  description: 'Who we make for — families, schools and madrasahs, and gifting.',
};

const SECTORS = [
  { emoji: '🏡', title: 'Families & Homes', body: 'Toys that bring faith and learning into everyday family time, for curious kids and the grown-ups who love them.' },
  { emoji: '🏫', title: 'Schools & Madrasahs', body: 'Hands-on educational resources that make Islamic learning engaging in the classroom and beyond.' },
  { emoji: '🎁', title: 'Gifting', body: 'Meaningful, beautifully made gifts for Eid, Aqiqah, birthdays and every special moment.' },
];

export default function SectorsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <PageHeader
        title="Our Sectors"
        subtitle="Meaningful toys, made for every kind of curious mind."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {SECTORS.map((s) => (
          <div key={s.title} className="rounded-3xl bg-bg-cream p-8 text-center">
            <div className="text-4xl" aria-hidden>
              {s.emoji}
            </div>
            <h2 className="mt-3 font-fredoka text-lg font-bold text-brand-purple">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full border-2 border-brand-purple px-9 py-3.5 font-fredoka text-sm font-semibold tracking-wide text-brand-purple transition-colors hover:bg-brand-purple hover:text-white"
        >
          Work with us
        </Link>
      </div>
    </main>
  );
}
