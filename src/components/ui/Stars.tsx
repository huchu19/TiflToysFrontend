import { Star, StarHalf } from 'lucide-react';

// Star rating row. Renders full stars plus an optional half star to represent
// fractional ratings like 4.5. Colour is inherited via `text-*` on a parent
// or the `className` here.

type StarsProps = {
  /** Rating out of 5 (e.g. 4.5). */
  value?: number;
  /** Size in px for each star. */
  size?: number;
  className?: string;
};

export function Stars({ value = 4.5, size = 18, className = '' }: StarsProps) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} width={size} height={size} className="fill-current" strokeWidth={0} />
      ))}
      {hasHalf ? <StarHalf width={size} height={size} className="fill-current" strokeWidth={0} /> : null}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} width={size} height={size} className="opacity-30" strokeWidth={0} fill="currentColor" />
      ))}
    </span>
  );
}
