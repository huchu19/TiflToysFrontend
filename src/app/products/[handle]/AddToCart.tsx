'use client';

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, useReducedMotion } from 'motion/react';
import { useCart } from '@/context/CartContext';
import { formatPrice, type ShopifyVariant } from '@/lib/shopify';

export default function AddToCart({ variants }: { variants: ShopifyVariant[] }) {
  const { addItem, openDrawer } = useCart();
  const reduceMotion = useReducedMotion();
  const firstAvailable = variants.find((v) => v.available) ?? variants[0];
  const [selectedId, setSelectedId] = useState(firstAvailable?.id);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const selected = variants.find((v) => v.id === selectedId);
  const multiple = variants.length > 1;
  const canBuy = !!selected?.available;

  // "Low stock" only when inventory is tracked (quantityAvailable non-null) and
  // running low. Untracked variants report null and show no count.
  const LOW_STOCK_THRESHOLD = 5;
  const lowStock =
    selected?.available &&
    selected.quantityAvailable != null &&
    selected.quantityAvailable > 0 &&
    selected.quantityAvailable <= LOW_STOCK_THRESHOLD;

  async function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    if (!selectedId) return;
    try {
      setAdding(true);
      await addItem(selectedId);
      setAdded(true);
      if (!reduceMotion) {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 60,
          spread: 70,
          startVelocity: 32,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
          colors: ['#6B4FA0', '#F5862E', '#5AB65C', '#93B1E0'],
        });
      }
    } catch {
      // Error is surfaced via CartContext/drawer; reset the button state.
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mt-8">
      {multiple && (
        <div className="mb-5">
          <p className="mb-2 font-fredoka text-sm font-semibold text-gray-700">Options</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <motion.button
                key={v.id}
                type="button"
                whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                disabled={!v.available}
                onClick={() => {
                  setSelectedId(v.id);
                  setAdded(false);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  v.id === selectedId
                    ? 'border-brand-purple bg-brand-purple text-white'
                    : 'border-gray-300 text-gray-700 hover:border-brand-purple'
                }`}
              >
                {v.title}
                {!v.available ? ' — sold out' : ''}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {selected?.available ? (
        lowStock && (
          <p className="mb-3 font-fredoka text-sm font-semibold text-brand-orange">
            Low stock — only {selected.quantityAvailable} left
          </p>
        )
      ) : (
        <p className="mb-3 font-fredoka text-sm font-semibold text-red-500">
          This item is sold out
        </p>
      )}

      <motion.button
        type="button"
        whileHover={reduceMotion || !canBuy ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion || !canBuy ? undefined : { scale: 0.98 }}
        onClick={handleAdd}
        disabled={adding || !canBuy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-purple px-9 py-4 font-fredoka text-base font-semibold tracking-wide text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
        {!canBuy
          ? 'Sold out'
          : adding
            ? 'Adding…'
            : added
              ? 'Added to cart'
              : selected
                ? `Add to cart — ${formatPrice(selected.amount)}`
                : 'Add to cart'}
      </motion.button>

      {added && (
        <button
          type="button"
          onClick={openDrawer}
          className="ml-0 mt-3 inline-flex w-full items-center justify-center rounded-full border-2 border-brand-purple px-9 py-3.5 font-fredoka text-base font-semibold tracking-wide text-brand-purple transition-colors hover:bg-brand-purple hover:text-white sm:ml-3 sm:mt-0 sm:w-auto"
        >
          View cart
        </button>
      )}
    </div>
  );
}
