// Decorative hand-drawn doodles used throughout the homepage.
// All are purely ornamental, so they are hidden from assistive tech.

type DoodleProps = {
  className?: string;
};

/** Chunky 5-point star (used near the logo and section headings). */
export function Star({ className = '' }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 1.5l2.85 6.6 7.15.62-5.42 4.7 1.64 6.98L12 16.9l-6.22 3.5 1.64-6.98L2 8.72l7.15-.62z" />
    </svg>
  );
}

/** Small curl / squiggle (the purple flourish above the hero image). */
export function Curl({ className = '' }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <path
        d="M8 30c-3-1-5-4-4-8 1-3 5-4 7-1 2 4-2 8-6 7-5-2-6-9-1-14 4-4 11-4 16 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Open hook / arc (the orange flourish near the hero image corner). */
export function Arc({ className = '' }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <path
        d="M30 8c4 3 6 9 2 14-3 4-9 4-12 0-2-3-1-7 2-8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Little burst of lines (the green sparkle beside headings). */
export function Sparkle({ className = '' }: DoodleProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <path d="M16 2v8M27 6l-5 6M30 18l-8 1M5 6l5 6M2 18l8 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
