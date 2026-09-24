'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Media } from '@/components/ui/Media';
import { useCart } from '@/context/CartContext';
import type { ProductCardProps } from './toProductCard';

// `toProductCard` itself is NOT re-exported here — this file is a Client
// Component, and a plain function can't be called across that boundary by a
// Server Component. Import it straight from './toProductCard' instead (see
// FeaturedCollection.tsx / app/products/page.tsx).
export type { ProductCardProps };

export function ProductCard({
  title,
  price,
  href,
  image,
  label,
  emoji,
  tone,
  soldOut,
  variantId,
}: ProductCardProps) {
  const { addItem } = useCart();
  const reduceMotion = useReducedMotion();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!variantId || adding) return;
    try {
      setAdding(true);
      await addItem(variantId);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setAdding(false);
    }
  }

  return (
    <motion.div whileHover={reduceMotion ? undefined : { y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      <Link href={href} className="group block">
        <div
          className={`relative overflow-hidden rounded-3xl ${tone}`}
          style={{ boxShadow: 'var(--shadow-sticker)' }}
        >
          <Media
            image={image}
            label={label}
            emoji={emoji}
            className={`aspect-square w-full transition-transform duration-500 group-hover:scale-105 ${soldOut ? 'opacity-60' : ''}`}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          {soldOut && (
            <span className="absolute left-3 top-3 -rotate-3 rounded-full bg-gray-900/85 px-3 py-1 font-fredoka text-xs font-semibold tracking-wide text-white">
              Sold out
            </span>
          )}

          {!soldOut && variantId && (
            <button
              type="button"
              onClick={quickAdd}
              aria-label={`Quick add ${title} to cart`}
              disabled={adding}
              className="absolute inset-x-3 bottom-3 flex translate-y-14 items-center justify-center gap-2 rounded-full bg-white/95 px-4 py-2.5 font-fredoka text-sm font-semibold text-brand-purple opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 disabled:cursor-wait"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> {adding ? 'Adding…' : 'Quick add'}
                </>
              )}
            </button>
          )}
        </div>
        <h3 className="mt-4 font-fredoka text-lg font-semibold text-brand-purple">{title}</h3>
        <p className="mt-1 inline-block rounded-full bg-bg-cream px-2.5 py-0.5 font-fredoka text-sm font-bold text-brand-purple/90">
          {price}
        </p>
      </Link>
    </motion.div>
  );
}
