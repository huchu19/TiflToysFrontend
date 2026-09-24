'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { StickerSpot } from '@/components/play/StickerSpot';
import { formatPrice, type ShopifyProductDetail } from '@/lib/shopify';

const STATIONS = [
  {
    id: 'ihram',
    emoji: '🤍',
    title: 'Ihram',
    kid: 'Everyone puts on simple white clothes — no rich or poor, everyone looks the same.',
    parent: 'At the Miqat boundary, pilgrims enter the sacred state of ihram before Makkah.',
  },
  {
    id: 'tawaf',
    emoji: '🕋',
    title: 'Tawaf',
    kid: 'Pilgrims walk around the Kaaba seven times, all together like one big circle.',
    parent: "Tawaf: seven counter-clockwise circuits of the Kaaba, Islam's holiest site.",
  },
  {
    id: 'sai',
    emoji: '🏃',
    title: "Sa'i",
    kid: 'Then everyone walks briskly between two little hills, seven times each way.',
    parent: "Sa'i between Safa and Marwah re-enacts Hajar's search for water for her son Ismail.",
  },
  {
    id: 'arafat',
    emoji: '🤲',
    title: 'Arafat',
    kid: 'On the Day of Arafat, everyone stands together and prays — this is the heart of Hajj.',
    parent: 'Standing (wuquf) at Arafat is considered the single most essential rite of Hajj.',
  },
  {
    id: 'muzdalifah',
    emoji: '🌌',
    title: 'Muzdalifah',
    kid: 'That night, pilgrims sleep under the open sky and collect little pebbles.',
    parent: 'Pilgrims gather at Muzdalifah overnight, collecting pebbles for the next day.',
  },
  {
    id: 'jamarat',
    emoji: '🪨',
    title: 'Jamarat',
    kid: 'They throw their pebbles at three pillars — a symbol of saying no to bad choices.',
    parent: 'Stoning the Jamarat symbolically rejects the whispers of Shaytan, as Ibrahim did.',
  },
  {
    id: 'farewell',
    emoji: '🕌',
    title: 'Tawaf al-Wida',
    kid: 'Before heading home, pilgrims circle the Kaaba one last time to say goodbye.',
    parent: 'The Farewell Tawaf is the final rite before pilgrims begin their journey home.',
  },
];

export function HajjJourney({ product }: { product: ShopifyProductDetail | null }) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.75', 'end 0.4'],
  });
  const dashOffset = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    if (!product?.variantId) return;
    try {
      setAdding(true);
      await addItem(product.variantId);
      setAdded(true);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      <div ref={containerRef} className="relative">
        {/* Connecting path — pathLength=1 lets us drive strokeDashoffset with
            plain scroll progress instead of measuring real path length. */}
        <svg
          className="absolute left-5 top-0 hidden h-full w-6 sm:block"
          viewBox="0 0 24 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M12,0 L12,100"
            fill="none"
            stroke="#E5DFF0"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <motion.path
            d="M12,0 L12,100"
            fill="none"
            stroke="#6B4FA0"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            style={{ strokeDashoffset: reduceMotion ? 0 : dashOffset }}
          />
        </svg>

        <ol className="relative flex flex-col gap-16 sm:pl-16">
          {STATIONS.map((s, i) => (
            <motion.li
              key={s.id}
              initial={reduceMotion ? undefined : { opacity: 0, y: 30 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <motion.span
                initial={reduceMotion ? undefined : { scale: 0 }}
                whileInView={reduceMotion ? undefined : { scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                className="absolute -left-16 top-0 hidden h-11 w-11 items-center justify-center rounded-full bg-white text-xl sm:flex"
                style={{ boxShadow: 'var(--shadow-sticker-sm)' }}
                aria-hidden
              >
                {s.emoji}
              </motion.span>

              <div className="rounded-3xl bg-bg-cream p-6" style={{ boxShadow: 'var(--shadow-sticker)' }}>
                <p className="font-fredoka text-xs font-bold uppercase tracking-wide text-brand-orange">
                  Station {i + 1} of {STATIONS.length}
                  {s.id === 'jamarat' && <StickerSpot id="compass" className="ml-2 inline-flex align-middle" />}
                </p>
                <h2 className="mt-1 flex items-center gap-2 font-fredoka text-2xl font-bold text-brand-purple">
                  <span className="sm:hidden" aria-hidden>{s.emoji}</span>
                  {s.title}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-gray-700">{s.kid}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.parent}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Closing CTA */}
      <div className="mt-16 rounded-3xl bg-bg-pink p-8 text-center sm:p-12" style={{ boxShadow: 'var(--shadow-sticker-lg)' }}>
        <h2 className="font-fredoka text-3xl font-bold text-white">
          {product?.title ?? 'PilgrimHajj — the board game'}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/90">
          Play the whole journey together at home — a family board game that brings these seven
          stations to your table.
        </p>
        {product?.variantId ? (
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-9 py-4 font-fredoka text-base font-semibold tracking-wide text-brand-purple shadow-md transition-transform hover:scale-[1.03] disabled:opacity-70"
          >
            <ShoppingBag className="h-5 w-5" />
            {added ? 'Added to cart' : adding ? 'Adding…' : `Add to cart — ${formatPrice(product.amount)}`}
          </button>
        ) : (
          <Link
            href="/products"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-9 py-4 font-fredoka text-base font-semibold tracking-wide text-brand-purple shadow-md transition-transform hover:scale-[1.03]"
          >
            <ShoppingBag className="h-5 w-5" />
            Shop the board game
          </Link>
        )}
      </div>
    </div>
  );
}
