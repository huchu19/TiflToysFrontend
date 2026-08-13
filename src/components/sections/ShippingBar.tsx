import { Truck, PackageCheck, MapPin } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE, SHIPPING_ZONES } from '@/lib/site';

// Free-shipping / flat-rate terms as real text (the TrustShowcase banner above
// has its trust bar baked into the image, so it can't carry live copy). Values
// come from lib/site so they stay in step with the Shopify shipping zones.
const ITEMS = [
  {
    Icon: Truck,
    title: `Free shipping over $${FREE_SHIPPING_THRESHOLD}`,
    body: `Orders under $${FREE_SHIPPING_THRESHOLD} ship for a flat $${SHIPPING_FLAT_RATE} — anywhere in Canada.`,
    tone: 'text-brand-green',
  },
  {
    Icon: MapPin,
    title: SHIPPING_ZONES[0].region,
    body: `Delivered in ${SHIPPING_ZONES[0].estimate}.`,
    tone: 'text-brand-orange',
  },
  {
    Icon: PackageCheck,
    title: SHIPPING_ZONES[1].region,
    body: `Delivered in ${SHIPPING_ZONES[1].estimate}.`,
    tone: 'text-brand-blue',
  },
];

export default function ShippingBar() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
      <div className="grid gap-6 rounded-3xl bg-bg-cream px-8 py-8 sm:grid-cols-3 sm:gap-8">
        {ITEMS.map(({ Icon, title, body, tone }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon className={`mt-0.5 h-6 w-6 shrink-0 ${tone}`} aria-hidden />
            <div>
              <h3 className="font-fredoka text-base font-bold text-brand-purple">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
