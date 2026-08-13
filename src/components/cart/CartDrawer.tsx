'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import FreeShippingNote from './FreeShippingNote';

export default function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, updateItem, removeItem, isPending, error } = useCart();

  // Lock body scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDrawer();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [drawerOpen, closeDrawer]);

  const lines = cart?.lines ?? [];
  const isEmpty = lines.length === 0;

  return (
    <div
      className={`fixed inset-0 z-50 ${drawerOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!drawerOpen}
    >
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="flex items-center gap-2 font-fredoka text-xl font-bold text-brand-purple">
            <ShoppingBag className="h-5 w-5" />
            Your cart
            {cart && cart.totalQuantity > 0 && (
              <span className="text-sm font-semibold text-gray-400">({cart.totalQuantity})</span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="text-gray-500 transition-colors hover:text-brand-purple"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        {error && (
          <p className="bg-red-50 px-6 py-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="text-5xl" aria-hidden>
              🧺
            </span>
            <p className="mt-4 font-fredoka text-lg font-semibold text-gray-700">
              Your cart is empty
            </p>
            <p className="mt-1 text-sm text-gray-500">Let&rsquo;s find something meaningful to play with.</p>
            <Link
              href="/products"
              onClick={closeDrawer}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-purple px-7 py-3 font-fredoka text-sm font-semibold tracking-wide text-white shadow-md transition-transform hover:scale-[1.03]"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-6">
              {lines.map((line) => {
                const cap = line.merchandise.quantityAvailable;
                const atMax = cap != null && line.quantity >= cap;
                return (
                  <li key={line.id} className="flex gap-4 py-5">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-bg-cream">
                      {line.merchandise.image ? (
                        <Image
                          src={line.merchandise.image.src}
                          alt={line.merchandise.image.alt || line.merchandise.productTitle}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-2xl">🧸</span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/products/${line.merchandise.productHandle}`}
                        onClick={closeDrawer}
                        className="font-fredoka text-sm font-semibold text-brand-purple hover:underline"
                      >
                        {line.merchandise.productTitle}
                      </Link>
                      {line.merchandise.variantTitle &&
                        line.merchandise.variantTitle !== 'Default Title' && (
                          <span className="text-xs text-gray-500">{line.merchandise.variantTitle}</span>
                        )}
                      {!line.merchandise.availableForSale && (
                        <span className="mt-0.5 text-xs font-semibold text-red-500">
                          No longer available
                        </span>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-gray-200">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={isPending}
                            onClick={() => updateItem(line.id, line.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:text-brand-purple disabled:opacity-50"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold">{line.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={isPending || atMax}
                            onClick={() => updateItem(line.id, line.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:text-brand-purple disabled:opacity-30"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <span className="font-fredoka text-sm font-bold text-gray-800">
                          {line.lineTotal}
                        </span>
                      </div>
                      {atMax && (
                        <span className="mt-1 text-xs text-brand-orange">Max stock reached</span>
                      )}
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${line.merchandise.productTitle}`}
                      disabled={isPending}
                      onClick={() => removeItem(line.id)}
                      className="self-start text-gray-300 transition-colors hover:text-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t border-gray-100 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="font-fredoka text-base font-semibold text-gray-700">Subtotal</span>
                <span className="font-fredoka text-lg font-bold text-brand-purple">
                  {cart?.subtotal}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Taxes calculated at checkout · prices in {cart?.currencyCode}
              </p>
              <div className="mt-3">
                <FreeShippingNote subtotal={cart?.subtotalAmount ?? 0} />
              </div>
              <a
                href={cart?.checkoutUrl}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-brand-purple px-8 py-4 font-fredoka text-base font-semibold tracking-wide text-white shadow-md transition-transform hover:scale-[1.02]"
              >
                Checkout
              </a>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="mt-2 flex w-full items-center justify-center py-2 font-fredoka text-sm font-semibold text-gray-500 transition-colors hover:text-brand-purple"
              >
                View full cart
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
