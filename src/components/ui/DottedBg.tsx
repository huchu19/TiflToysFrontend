// Polka-dot pattern overlay used on the promo, search, newsletter and footer
// blocks. Render it as the first child of a `relative` container; it fills the
// parent and sits behind the content (which should be wrapped in `relative`).

type DottedBgProps = {
  /** Dot colour (any CSS colour). */
  color: string;
  /** Grid size in px between dots. */
  size?: number;
  className?: string;
};

export function DottedBg({ color, size = 22, className = '' }: DottedBgProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `radial-gradient(${color} 2px, transparent 2px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}
