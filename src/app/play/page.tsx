import type { Metadata } from 'next';
import Link from 'next/link';
import { Palette, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { Star, Sparkle } from '@/components/ui/Doodles';

const EXPERIENCES = [
  {
    href: '/play/colouring',
    Icon: Palette,
    tone: 'bg-bg-mint',
    title: 'Colouring Studio',
    body: 'Colour the real prayer mat designs — tap to fill, freehand brush, then bring your favourite home.',
  },
  {
    href: '/play/hajj',
    Icon: Compass,
    tone: 'bg-bg-blue',
    title: 'The Hajj Journey',
    body: 'Scroll through the seven stations of the pilgrimage, one story at a time.',
  },
  {
    href: '/play/stickers',
    Icon: Sparkles,
    tone: 'bg-bg-pink',
    title: 'Sticker Hunt',
    body: 'Six stickers are hiding around the site. Find them all for a keepsake collection.',
  },
];

export const metadata: Metadata = {
  title: 'Play',
  description: 'Colour real prayer mat designs, journey through Hajj, and hunt for hidden stickers.',
};

export default function PlayHub() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <Reveal className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Star className="h-7 w-7 text-brand-orange" />
          <h1 className="font-fredoka text-4xl font-bold text-brand-purple sm:text-5xl">
            Play
          </h1>
          <Sparkle className="h-7 w-7 text-brand-green" />
        </div>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Before you shop, come play. Everything here is free, and every experience links back to
          a real toy you can bring home.
        </p>
      </Reveal>

      <Stagger className="mt-12 grid gap-8 sm:grid-cols-3" step={0.1}>
        {EXPERIENCES.map(({ href, Icon, tone, title, body }) => (
          <Link key={href} href={href} className="group block">
            <div
              className={`flex h-full flex-col rounded-3xl ${tone} p-8 transition-transform group-hover:-translate-y-1`}
              style={{ boxShadow: 'var(--shadow-sticker)' }}
            >
              <Icon className="h-8 w-8 text-white" strokeWidth={1.75} />
              <h2 className="mt-4 font-fredoka text-xl font-bold text-white">{title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/90">{body}</p>
              <span className="mt-4 inline-flex items-center gap-1 font-fredoka text-sm font-semibold text-white">
                Let&rsquo;s go <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </Stagger>
    </main>
  );
}
