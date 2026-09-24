'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Palette } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { Kaaba } from '@/components/play/designs/Kaaba';
import type { Fills } from '@/components/play/designs';

const MINI_PALETTE = ['#6B4FA0', '#F5862E', '#5AB65C', '#93B1E0', '#F4DE7A', '#EFC2CB'];

// A real, tiny live canvas (not a screenshot) — tap-to-fill only, nothing
// persisted, just enough to prove the studio is actually interactive before
// asking anyone to click through to /play/colouring.
export default function ColouringTeaser() {
  const [fills, setFills] = useState<Fills>({});
  const [color, setColor] = useState(MINI_PALETTE[0]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <Reveal className="grid items-center gap-8 rounded-3xl bg-bg-mint p-8 sm:p-12 lg:grid-cols-2">
        <div className="text-on-mint">
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6" aria-hidden />
            <p className="font-fredoka text-sm font-bold uppercase tracking-wide">Try it right here</p>
          </div>
          <h2 className="mt-2 font-fredoka text-3xl font-bold sm:text-4xl">Colouring Studio</h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            Tap a shape to colour it in — this mini Kaaba is live. The full studio has five real mat
            designs, a freehand brush, and lets you buy the one you love.
          </p>

          <div className="mt-5 flex gap-2">
            {MINI_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Colour ${c}`}
                aria-pressed={color === c}
                className={`h-7 w-7 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: c, boxShadow: '0 0 0 1px rgba(58,46,77,0.15)' }}
              />
            ))}
          </div>

          <Link
            href="/play/colouring"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-fredoka text-sm font-semibold tracking-wide text-on-mint shadow-sm transition-transform hover:scale-[1.03]"
          >
            Open the full studio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mx-auto w-full max-w-[220px] rounded-2xl bg-white p-4">
          <Kaaba fills={fills} onSelect={(id) => setFills((f) => ({ ...f, [id]: color }))} />
        </div>
      </Reveal>
    </section>
  );
}
