'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { DottedBg } from '@/components/ui/DottedBg';
import { Reveal } from '@/components/motion/Reveal';

const TAGS = ['Baby Toys', 'Lego', 'Learning Toys'];

export default function SearchBlock() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const go = (term: string) => {
    const t = term.trim();
    router.push(t ? `/products?q=${encodeURIComponent(t)}` : '/products');
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <Reveal className="relative overflow-hidden rounded-3xl bg-bg-blue px-6 py-14 text-center">
        <DottedBg color="#B7C8EC" />

        <div className="relative">
          {/* text-on-blue (not white) — white-on-bg-bg-blue was low contrast. */}
          <h2 className="font-fredoka text-3xl font-bold text-on-blue sm:text-4xl">
            Looking for something special?
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(query);
            }}
            className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-full bg-white px-5 py-3 shadow-sm"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by age, activity or collection."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
            <button type="submit" aria-label="Search" className="shrink-0">
              <Search className="h-5 w-5 text-brand-blue" strokeWidth={2} />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => go(tag)}
                className="rounded-full border border-on-blue/40 px-4 py-1 text-sm text-on-blue transition-colors hover:bg-white hover:text-brand-blue"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
