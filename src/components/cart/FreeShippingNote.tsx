'use client';

import { useEffect, useRef } from 'react';
import { Truck, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, useReducedMotion } from 'motion/react';
import { FREE_SHIPPING_THRESHOLD, freeShippingProgress } from '@/lib/site';

/**
 * Free-shipping nudge shown above the checkout button in the cart drawer and
 * the full cart. Reads the raw subtotal so the "$X away" maths matches what
 * Shopify checkout actually charges (see SHIPPING_ZONES in lib/site).
 */
export default function FreeShippingNote({ subtotal }: { subtotal: number }) {
  const progress = freeShippingProgress(subtotal);
  const reduceMotion = useReducedMotion();
  const wasQualified = useRef(false);

  // Celebrate the moment the subtotal crosses the free-shipping threshold —
  // only fires on the actual crossing, not on every render while qualified.
  useEffect(() => {
    if (progress?.qualified && !wasQualified.current && !reduceMotion) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#6B4FA0', '#F5862E', '#5AB65C', '#93B1E0'],
      });
    }
    wasQualified.current = !!progress?.qualified;
  }, [progress?.qualified, reduceMotion]);

  if (!progress) return null;

  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className={`rounded-2xl px-4 py-3 ${progress.qualified ? 'bg-bg-mint' : 'bg-bg-cream'}`}>
      <p className="flex items-center gap-2 font-fredoka text-sm font-semibold text-brand-purple">
        {progress.qualified ? (
          <PartyPopper className="h-4 w-4 shrink-0 text-brand-green" />
        ) : (
          <Truck className="h-4 w-4 shrink-0 text-brand-orange" />
        )}
        {progress.message}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/70">
        <motion.div
          className={`h-full rounded-full ${progress.qualified ? 'bg-brand-green' : 'bg-brand-orange'}`}
          animate={{ width: `${pct}%` }}
          initial={false}
          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
