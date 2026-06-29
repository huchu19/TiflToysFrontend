'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Stars } from '@/components/ui/Stars';
import { Media } from '@/components/ui/Media';
import type { ShopifyImage } from '@/lib/shopify';

// Featured product spotlight. Content comes from a Shopify product; when a
// variant id is present QUICK BUY adds it to the cart, otherwise it links to
// the product page so the button is always functional.
type DIYHighlightProps = {
  title?: string;
  price?: string;
  description?: string;
  image?: ShopifyImage;
  variantId?: string | null;
  href?: string;
};

const DEFAULTS = {
  title: 'DIY Paint Kaaba Money Box',
  price: '$19.99',
  description:
    'Combine craft time with a meaningful lesson in giving with this build-your-own wooden Sadaqah box. Laser-cut from natural wood, the flat-pack pieces fit together to form a beautifully detailed box featuring an ornamental mosque-style façade.',
};

export default function DIYHighlight({
  title = DEFAULTS.title,
  price = DEFAULTS.price,
  description = DEFAULTS.description,
  image,
  variantId,
  href = '/products/diy-sadaqah-box-craft-kit-build-decorate-your-own-charity-box',
}: DIYHighlightProps) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  async function quickBuy() {
    if (!variantId) return;
    try {
      setAdding(true);
      await addItem(variantId);
    } finally {
      setAdding(false);
    }
  }

  const buttonClasses =
    'mt-6 inline-flex items-center justify-center rounded-full bg-white px-9 py-3 font-fredoka text-sm font-semibold tracking-wide text-brand-purple shadow-sm transition-transform hover:scale-[1.03]';

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="grid gap-8 rounded-3xl bg-bg-pink p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
        <Media
          image={image}
          label="Painting the DIY Kaaba money box"
          emoji="🎨"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-square w-full rounded-2xl bg-white/40"
        />

        <div className="text-white">
          <div className="flex items-center gap-2">
            <Stars value={4.5} size={18} />
            <span className="text-sm font-semibold text-white/90">4.5 (120)</span>
          </div>

          <h2 className="mt-3 font-fredoka text-3xl font-bold">{title}</h2>
          <p className="mt-2 font-fredoka text-2xl font-bold">{price}</p>

          <p className="mt-4 max-w-md leading-relaxed text-white/90">{description}</p>

          {variantId ? (
            <button type="button" onClick={quickBuy} disabled={adding} className={`${buttonClasses} disabled:opacity-70`}>
              {adding ? 'ADDING…' : 'QUICK BUY'}
            </button>
          ) : (
            <Link href={href} className={buttonClasses}>
              QUICK BUY
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
