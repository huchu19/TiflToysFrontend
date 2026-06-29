import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Meaningful Islamic educational toys that help curious minds play, imagine and grow.',
};

const VALUES = [
  { emoji: '🌱', title: 'Learning through play', body: 'Every toy is designed to spark curiosity and teach something meaningful while kids have fun.' },
  { emoji: '🕌', title: 'Rooted in faith', body: 'Thoughtfully crafted around Islamic values, helping families share their faith in joyful, hands-on ways.' },
  { emoji: '♻️', title: 'Made to last', body: 'Natural materials and sturdy builds, made to be played with, loved, and passed on.' },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <PageHeader title="About TiflToys" subtitle="Meaningful toys for curious minds." />

      <div className="mt-10 space-y-6 text-lg leading-relaxed text-gray-600">
        <p>
          TiflToys began with a simple idea: that the toys our children play with should help them{' '}
          <span className="font-semibold text-brand-purple">play, imagine, and grow</span> — all at once.
          We create Islamic educational toys that turn everyday playtime into moments of discovery, wonder,
          and connection to faith.
        </p>
        <p>
          From colourable prayer mats to build-your-own Sadaqah boxes, each product is designed to go beyond
          fun — helping kids discover new knowledge through play, and giving families beautiful tools to learn
          together.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-3xl bg-bg-cream p-8 text-center">
            <div className="text-4xl" aria-hidden>
              {v.emoji}
            </div>
            <h2 className="mt-3 font-fredoka text-lg font-bold text-brand-purple">{v.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full bg-brand-purple px-9 py-4 font-fredoka text-base font-semibold tracking-wide text-white shadow-md transition-transform hover:scale-[1.03]"
        >
          Explore our toys
        </Link>
      </div>
    </main>
  );
}
