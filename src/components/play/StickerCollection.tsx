'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Download, PartyPopper } from 'lucide-react';
import { useStickers } from '@/context/StickerContext';
import { STICKERS } from '@/lib/stickers';
import { Kaaba } from '@/components/play/designs/Kaaba';

/** Keepsake grid + the completion celebration + printable download. The
 *  printable is a blank (uncoloured) mat outline exported the same way the
 *  Colouring Studio saves artwork — kids can print it and colour by hand. */
export function StickerCollection() {
  const { found, foundCount, total, complete, hydrated } = useStickers();
  const reduceMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  // Not state — firing the confetti burst doesn't need to trigger a render,
  // it just needs to happen once per completion.
  const celebrated = useRef(false);

  useEffect(() => {
    if (complete && !celebrated.current && !reduceMotion) {
      confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 }, colors: ['#6B4FA0', '#F5862E', '#5AB65C', '#93B1E0'] });
      celebrated.current = true;
    }
  }, [complete, reduceMotion]);

  function downloadPrintable() {
    const svg = svgRef.current;
    if (!svg) return;
    const svgString = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 880;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const a = document.createElement('a');
        a.download = 'tifltoys-printable-mat.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  if (!hydrated) return null;

  return (
    <div>
      {/* Hidden blank template used only for the printable export. */}
      <Kaaba fills={{}} svgRef={svgRef} svgProps={{ className: 'sr-only', 'aria-hidden': true }} />

      <div className="rounded-3xl bg-white p-6" style={{ boxShadow: 'var(--shadow-sticker)' }}>
        <div className="flex items-center justify-between">
          <p className="font-fredoka text-lg font-bold text-brand-purple">
            {foundCount} / {total} found
          </p>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-bg-cream">
            <motion.div
              className="h-full rounded-full bg-brand-orange"
              animate={{ width: `${(foundCount / total) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {STICKERS.map((s) => {
            const isFound = found.has(s.id);
            return (
              <div
                key={s.id}
                className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center ${
                  isFound ? 'bg-bg-yellow' : 'bg-bg-cream'
                }`}
              >
                <span className={`text-3xl ${isFound ? '' : 'opacity-30 grayscale'}`} aria-hidden>
                  {s.emoji}
                </span>
                <span className="font-fredoka text-xs font-semibold text-gray-700">
                  {isFound ? s.label : '???'}
                </span>
                {!isFound && <span className="text-[11px] text-gray-400">{s.location}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {complete && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-3xl bg-bg-mint p-8 text-center text-on-mint"
            style={{ boxShadow: 'var(--shadow-sticker-lg)' }}
          >
            <PartyPopper className="mx-auto h-8 w-8" />
            <h2 className="mt-2 font-fredoka text-2xl font-bold">You found them all!</h2>
            <p className="mt-2 text-sm">Here&rsquo;s a printable colouring page as your keepsake.</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={downloadPrintable}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-fredoka text-sm font-semibold text-on-mint shadow-sm"
              >
                <Download className="h-4 w-4" /> Download printable
              </button>
              <Link
                href="/play/colouring"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-2.5 font-fredoka text-sm font-semibold text-on-mint"
              >
                Colour it online instead
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
