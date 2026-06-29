'use client';

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, type ShopifyVariant } from '@/lib/shopify';

export default function AddToCart({ variants }: { variants: ShopifyVariant[] }) {
  const { addItem, openDrawer } = useCart();
  const firstAvailable = variants.find((v) => v.available) ?? variants[0];
  const [selectedId, setSelectedId] = useState(firstAvailable?.id);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const selected = variants.find((v) => v.id === selectedId);
  const multiple = variants.length > 1;

  // "Low stock" only when inventory is tracked (quantityAvailable non-null) and
  // running low. Untracked variants report null and show no count.
  const LOW_STOCK_THRESHOLD = 5;
  const lowStock =
    selected?.available &&
    selected.quantityAvailable != null &&
    selected.quantityAvailable > 0 &&
    selected.quantityAvailable <= LOW_STOCK_THRESHOLD;

  async function handleAdd() {
    if (!selectedId) return;
    try {
      setAdding(true);
      await addItem(selectedId);
      setAdded(true);
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
              <button
                key={v.id}
                type="button"
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
              </button>
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

      <button
        type="button"
        onClick={handleAdd}
        disabled={adding || !selected?.available}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-purple px-9 py-4 font-fredoka text-base font-semibold tracking-wide text-white shadow-md transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
        {!selected?.available
          ? 'Sold out'
          : adding
            ? 'Adding…'
            : added
              ? 'Added to cart'
              : selected
                ? `Add to cart — ${formatPrice(selected.amount)}`
                : 'Add to cart'}
      </button>

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
