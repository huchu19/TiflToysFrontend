import { Truck, PackageCheck, MapPin, BadgeDollarSign } from 'lucide-react';
import { Stagger } from '@/components/motion/Stagger';
import { SHIPPING, shippingMoney } from '@/lib/site';
import { COUNTRIES, type Country } from '@/lib/country';

const ZONE_STYLES = [
  { Icon: MapPin, tone: 'text-brand-orange' },
  { Icon: PackageCheck, tone: 'text-brand-blue' },
];

// Free-shipping / flat-rate terms as real text (the TrustShowcase banner above
// has its trust bar baked into the image, so it can't carry live copy). Values
// come from lib/site so they stay in step with the Shopify shipping zones, and
// only the visitor's own market is shown.
function itemsFor(country: Country) {
  const { freeThreshold, flatRate, area, zones } = SHIPPING[country];
  const free = {
    Icon: Truck,
    title: `Free shipping over ${shippingMoney(freeThreshold, country)}`,
    body: `Orders under ${shippingMoney(freeThreshold, country)} ship for a flat ${shippingMoney(flatRate, country)} — ${area}.`,
    tone: 'text-brand-green',
  };
  // No per-zone delivery estimates for the US yet, so say what's different
  // about shopping from there instead.
  if (zones.length === 0) {
    const { currency } = COUNTRIES[country];
    return [
      free,
      {
        Icon: BadgeDollarSign,
        title: `Prices in ${currency}`,
        body: `Everything on the site and at checkout is priced in ${currency}.`,
        tone: 'text-brand-orange',
      },
    ];
  }
  return [
    free,
    ...zones.map((z, i) => ({
      ...ZONE_STYLES[i % ZONE_STYLES.length],
      title: z.region,
      body: `Delivered in ${z.estimate}.`,
    })),
  ];
}

export default function ShippingBar({ country }: { country: Country }) {
  const items = itemsFor(country);
  return (
    <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
      <Stagger
        className={`grid gap-6 rounded-3xl bg-bg-cream px-8 py-8 sm:gap-8 ${
          items.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
        }`}
        step={0.06}
      >
        {items.map(({ Icon, title, body, tone }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon className={`mt-0.5 h-6 w-6 shrink-0 ${tone}`} aria-hidden />
            <div>
              <h3 className="font-fredoka text-base font-bold text-brand-purple">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{body}</p>
            </div>
          </div>
        ))}
      </Stagger>
    </section>
  );
}
