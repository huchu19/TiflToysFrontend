'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { ProductSort } from '@/lib/shopify';

const OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export default function ProductSort({ current }: { current: ProductSort }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', e.target.value);
    }
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : '/products');
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-600">
      <span className="font-fredoka font-semibold">Sort</span>
      <select
        value={current}
        onChange={onChange}
        className="rounded-full border border-gray-200 bg-white px-4 py-2 font-fredoka text-sm font-semibold text-gray-700 outline-none focus:border-brand-purple"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
