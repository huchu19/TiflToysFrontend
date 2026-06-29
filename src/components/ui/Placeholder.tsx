// Soft image placeholder. The design uses photographic product/lifestyle shots
// that aren't available yet, so each image slot renders this friendly box.
// Swap in `next/image` (or a Shopify image URL) when real assets arrive — the
// surrounding containers already define the correct size and rounding.

type PlaceholderProps = {
  /** Short caption describing what image belongs here. */
  label?: string;
  /** Emoji shown as a visual stand-in. */
  emoji?: string;
  /** Sizing / rounding / background classes for the box. */
  className?: string;
};

export function Placeholder({ label, emoji = '🧸', className = '' }: PlaceholderProps) {
  return (
    <div className={`flex items-center justify-center overflow-hidden ${className}`}>
      <div className="px-4 text-center">
        <div className="text-5xl drop-shadow-sm" aria-hidden>
          {emoji}
        </div>
        {label ? (
          <span className="mt-2 block font-fredoka text-sm font-medium text-brand-purple/60">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
