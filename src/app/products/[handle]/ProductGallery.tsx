'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ShopifyImageData } from '@/lib/shopify';

export default function ProductGallery({ images, title }: { images: ShopifyImageData[]; title: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-3xl bg-bg-cream">
        <span className="text-6xl" aria-hidden>
          🧸
        </span>
      </div>
    );
  }

  const main = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-bg-cream">
        <Image
          src={main.src}
          alt={main.alt || title}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`relative h-20 w-20 overflow-hidden rounded-xl bg-bg-cream ring-2 transition-colors ${
                i === active ? 'ring-brand-purple' : 'ring-transparent hover:ring-brand-purple/40'
              }`}
            >
              <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
