'use client';

import { Children, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Shows the first `initial` server-rendered review cards and reveals the rest
 * on demand. Every card is already in the HTML (good for SEO) — this only
 * toggles visibility, no extra fetch.
 */
export function ReviewsExpander({ children, initial = 6 }: { children: ReactNode; initial?: number }) {
  const [expanded, setExpanded] = useState(false);
  const items = Children.toArray(children);
  const hidden = items.length - initial;

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div key={i} className={!expanded && i >= initial ? 'hidden' : undefined}>
            {item}
          </div>
        ))}
      </div>
      {hidden > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand-purple px-7 py-3 font-fredoka text-sm font-semibold tracking-wide text-brand-purple transition-colors hover:bg-brand-purple hover:text-white"
          >
            {expanded ? 'Show fewer reviews' : `Show ${hidden} more review${hidden === 1 ? '' : 's'}`}
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </>
  );
}
