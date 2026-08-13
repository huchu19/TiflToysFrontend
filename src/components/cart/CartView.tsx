'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import FreeShippingNote from './FreeShippingNote';

export default function CartView() {
  const { cart, updateItem, removeItem, isPending, error } = useCart();
  const lines = cart?.lines ?? [];

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl bg-bg-cream px-6 py-20 text-center">
        <span className="text-5xl" aria-hidden>
          🧺
        </span>
        <p className="mt-4 font-fredoka text-xl font-bold text-gray-700">Your cart is empty</p>
        <p className="mt-1 text-gray-500">Discover toys that make learning a joy.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-purple px-8 py-3.5 font-fredoka text-sm font-semibold tracking-wide text-white shadow-md transition-transform hover:scale-[1.03]"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      {/* Line items */}
      <ul className="divide-y divide-gray-100 lg:col-span-2">
        {error && (
          <li className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
            {error}
          </li>
        )}
        {lines.map((line) => {
          const cap = line.merchandise.quantityAvailable;
          const atMax = cap != null && line.quantity >= cap;
          return (
            <li key={line.id} className="flex gap-5 py-6">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-bg-cream">
                {line.merchandise.image ? (
                  <Image
                    src={line.merchandise.image.src}
                    alt={line.merchandise.image.alt || line.merchandise.productTitle}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-3xl">🧸</span>
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${line.merchandise.productHandle}`}
                      className="font-fredoka text-lg font-semibold text-brand-purple hover:underline"
                    >
                      {line.merchandise.productTitle}
                    </Link>
                    {line.merchandise.variantTitle &&
                      line.merchandise.variantTitle !== 'Default Title' && (
                        <p className="text-sm text-gray-500">{line.merchandise.variantTitle}</p>
                      )}
                    <p className="mt-1 text-sm text-gray-500">{line.merchandise.price} each</p>
                    {!line.merchandise.availableForSale && (
                      <p className="mt-1 text-sm font-semibold text-red-500">No longer available</p>
                    )}
                  </div>
                  <span className="font-fredoka text-lg font-bold text-gray-800">
                    {line.lineTotal}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-gray-200">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={isPending}
                      onClick={() => updateItem(line.id, line.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:text-brand-purple disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={isPending || atMax}
                      onClick={() => updateItem(line.id, line.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:text-brand-purple disabled:opacity-30"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => removeItem(line.id)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-red-500 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
                {atMax && <p className="mt-1 text-xs text-brand-orange">Max stock reached</p>}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Summary */}
      <aside className="h-fit rounded-3xl bg-bg-cream p-6 lg:sticky lg:top-6">
        <h2 className="font-fredoka text-xl font-bold text-brand-purple">Order summary</h2>
        <div className="mt-4 flex items-center justify-between text-gray-700">
          <span>Subtotal</span>
          <span className="font-semibold">{cart?.subtotal}</span>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Taxes calculated at checkout · prices in {cart?.currencyCode}
        </p>
        <div className="mt-4">
          <FreeShippingNote subtotal={cart?.subtotalAmount ?? 0} />
        </div>
        <a
          href={cart?.checkoutUrl}
          className="mt-5 flex w-full items-center justify-center rounded-full bg-brand-purple px-8 py-4 font-fredoka text-base font-semibold tracking-wide text-white shadow-md transition-transform hover:scale-[1.02]"
        >
          Checkout
        </a>
        <Link
          href="/products"
          className="mt-3 flex w-full items-center justify-center py-2 font-fredoka text-sm font-semibold text-gray-500 transition-colors hover:text-brand-purple"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
