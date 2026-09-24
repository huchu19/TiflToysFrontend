import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';

// A compressed three-station strip of the full /play/hajj journey — just
// enough to show what's there and pull curious visitors through.
const PREVIEW = [
  { emoji: '🤍', title: 'Ihram', body: 'Simple white clothes — everyone looks the same.' },
  { emoji: '🕋', title: 'Tawaf', body: 'Seven circles around the Kaaba, together.' },
  { emoji: '🕌', title: 'Farewell', body: 'One last circle before heading home.' },
];

export default function HajjTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="rounded-3xl bg-bg-blue p-8 sm:p-12" style={{ boxShadow: 'var(--shadow-sticker-lg)' }}>
        <Reveal className="text-center">
          <div className="flex items-center justify-center gap-2 text-white">
            <Compass className="h-6 w-6" aria-hidden />
            <p className="font-fredoka text-sm font-bold uppercase tracking-wide">A story to scroll through</p>
          </div>
          <h2 className="mt-2 font-fredoka text-3xl font-bold text-on-blue sm:text-4xl">
            The Hajj Journey
          </h2>
        </Reveal>

        <Stagger className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
          {PREVIEW.map((s) => (
            <div key={s.title} className="rounded-2xl bg-white/90 p-5 text-center">
              <span className="text-3xl" aria-hidden>{s.emoji}</span>
              <h3 className="mt-2 font-fredoka text-base font-bold text-brand-purple">{s.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{s.body}</p>
            </div>
          ))}
        </Stagger>

        <div className="mt-8 text-center">
          <Link
            href="/play/hajj"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-fredoka text-sm font-semibold tracking-wide text-on-blue shadow-sm transition-transform hover:scale-[1.03]"
          >
            Walk the full journey
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
