import { Truck } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD, freeShippingProgress } from '@/lib/site';

/**
 * Free-shipping nudge shown above the checkout button in the cart drawer and
 * the full cart. Reads the raw subtotal so the "$X away" maths matches what
 * Shopify checkout actually charges (see SHIPPING_ZONES in lib/site).
 */
export default function FreeShippingNote({ subtotal }: { subtotal: number }) {
  const progress = freeShippingProgress(subtotal);
  if (!progress) return null;

  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className={`rounded-2xl px-4 py-3 ${progress.qualified ? 'bg-bg-mint' : 'bg-bg-cream'}`}>
      <p className="flex items-center gap-2 font-fredoka text-sm font-semibold text-brand-purple">
        <Truck className={`h-4 w-4 shrink-0 ${progress.qualified ? 'text-brand-green' : 'text-brand-orange'}`} />
        {progress.message}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/70">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${
            progress.qualified ? 'bg-brand-green' : 'bg-brand-orange'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
