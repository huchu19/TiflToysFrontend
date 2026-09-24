'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { useStickers } from '@/context/StickerContext';
import { STICKERS } from '@/lib/stickers';

/**
 * A single hidden, findable sticker — a real, focusable button (not a pure
 * visual trap) so it's reachable by keyboard/screen reader too. Once found it
 * stays visible in a "collected" state; finding it fires a small confetti
 * burst from its own position and marks it in StickerContext (persisted).
 */
export function StickerSpot({ id, className = '' }: { id: string; className?: string }) {
  const def = STICKERS.find((s) => s.id === id);
  const { isFound, find, hydrated } = useStickers();
  const reduceMotion = useReducedMotion();
  const [justFound, setJustFound] = useState(false);

  if (!def) return null;
  // Avoid a flash of the un-found state before localStorage has been read.
  if (!hydrated) return null;

  const found = isFound(id);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const isNew = find(id);
    if (isNew) {
      setJustFound(true);
      if (!reduceMotion) {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 40,
          spread: 60,
          startVelocity: 28,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
          colors: ['#6B4FA0', '#F5862E', '#5AB65C', '#93B1E0'],
        });
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={found}
      aria-label={found ? `${def.label} sticker — collected` : 'A hidden sticker — tap to collect it'}
      title={found ? def.label : 'Psst — a hidden sticker!'}
      className={`group inline-flex items-center justify-center rounded-full text-2xl leading-none outline-none focus-visible:ring-2 focus-visible:ring-brand-purple ${className}`}
    >
      <motion.span
        animate={
          reduceMotion
            ? undefined
            : justFound
              ? { scale: [1, 1.6, 1], rotate: [0, 15, -15, 0] }
              : found
                ? {}
                : { y: [0, -4, 0] }
        }
        transition={
          justFound
            ? { duration: 0.5 }
            : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
        }
        className={found ? 'opacity-100' : 'opacity-70 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0'}
      >
        {def.emoji}
      </motion.span>
      <AnimatePresence>
        {justFound && (
          <motion.span
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -28, scale: 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setJustFound(false)}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute font-fredoka text-xs font-bold text-brand-purple"
          >
            +1 sticker!
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
