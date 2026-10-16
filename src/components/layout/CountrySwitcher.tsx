'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { COUNTRIES, type Country } from '@/lib/country';

const OPTIONS = Object.entries(COUNTRIES) as [Country, (typeof COUNTRIES)[Country]][];

/**
 * Header pill showing the visitor's market (flag + currency). Picking the other
 * country saves it, re-prices the cart, and refreshes the page's prices.
 */
export default function CountrySwitcher({ country }: { country: Country }) {
  const { changeCountry } = useCart();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = COUNTRIES[country];

  // Close on outside click / Escape, like any other popover.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function pick(next: Country) {
    setOpen(false);
    if (next === country) return;
    setSwitching(true);
    try {
      await changeCountry(next);
    } catch {
      // The cart context surfaces the error; the pill keeps the old country.
    } finally {
      setSwitching(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Shopping in ${current.name} (${current.currency}). Change country`}
        disabled={switching}
        className="flex items-center gap-1 rounded-full bg-bg-cream px-2 py-1.5 font-fredoka text-xs font-bold text-brand-purple transition-transform hover:scale-105 disabled:animate-pulse lg:gap-1.5 lg:px-3"
      >
        <span aria-hidden className="text-base leading-none">
          {current.flag}
        </span>
        {/* Flag alone below desktop width, where the header is tight. */}
        <span className="hidden lg:inline">{current.currency}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform max-[359px]:hidden ${open ? 'rotate-180' : ''}`}
          strokeWidth={2.5}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute -right-16 top-full z-50 mt-2 w-60 origin-top-right sm:right-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-lg"
          >
            {OPTIONS.map(([code, c]) => (
              <li key={code} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={code === country}
                  onClick={() => pick(code)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-bg-cream ${
                    code === country ? 'bg-bg-cream/60' : ''
                  }`}
                >
                  <span aria-hidden className="text-xl leading-none">
                    {c.flag}
                  </span>
                  <span className="flex-1">
                    <span className="block font-fredoka text-sm font-semibold text-brand-purple">
                      {c.name}
                    </span>
                    <span className="block text-xs text-gray-500">Prices in {c.currency}</span>
                  </span>
                  {code === country && (
                    <Check className="h-4 w-4 text-brand-green" strokeWidth={2.5} aria-hidden />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
