'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DottedBg } from '@/components/ui/DottedBg';

const pad = (n: number) => String(n).padStart(2, '0');

type TimeParts = { days: string; hours: string; minutes: string; seconds: string };

/** Break the ms until `deadline` into padded d/h/m/s, or null once it's reached. */
function remaining(deadline: number): TimeParts | null {
  const diff = deadline - Date.now();
  if (diff <= 0) return null;
  return {
    days: pad(Math.floor(diff / 86_400_000)),
    hours: pad(Math.floor((diff % 86_400_000) / 3_600_000)),
    minutes: pad(Math.floor((diff % 3_600_000) / 60_000)),
    seconds: pad(Math.floor((diff % 60_000) / 1_000)),
  };
}

// Countdown to the `endsAt` sale deadline (a Shop `promo.sale_ends_at` metafield,
// set in the Shopify admin). Ticks every second on the client. The bar renders
// nothing when no sale is configured or the deadline has passed. To avoid a
// hydration mismatch, the time-sensitive digits start as a placeholder and are
// filled in on mount (client-only), so server and client first paint identically.
export default function PromoBar({ endsAt }: { endsAt?: string | null }) {
  const deadline = endsAt ? new Date(endsAt).getTime() : NaN;
  // undefined = not computed yet (server/first paint) → show placeholder.
  // null = sale ended → hide. TimeParts = live countdown.
  const [time, setTime] = useState<TimeParts | null | undefined>(undefined);

  useEffect(() => {
    if (!Number.isFinite(deadline)) return;
    const tick = () => setTime(remaining(deadline));
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [deadline]);

  // No sale configured (or an unparseable date) → hide the bar entirely.
  if (!Number.isFinite(deadline)) return null;
  // Sale ended (known only after mount, since it's time-based) → hide.
  if (time === null) return null;

  const t = time ?? { days: '--', hours: '--', minutes: '--', seconds: '--' };
  const units = [
    { label: 'Days', value: t.days },
    { label: 'Hours', value: t.hours },
    { label: 'Minutes', value: t.minutes },
    { label: 'Seconds', value: t.seconds },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-bg-yellow px-8 py-8">
        <DottedBg color="#EAD06A" />

        <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">
          {/* Offer copy */}
          <div className="text-center font-fredoka leading-none lg:text-left">
            <p className="text-sm font-semibold tracking-wide text-brand-green">GET UP TO</p>
            <p className="my-1 text-5xl font-bold text-brand-purple">30% OFF</p>
            <p className="text-sm font-semibold tracking-wide text-brand-orange">ON SELECTED TOYS!</p>
          </div>

          {/* Countdown */}
          <div className="flex items-start gap-2">
            {units.map((unit, i) => (
              <div key={unit.label} className="flex items-start gap-2">
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white font-fredoka text-3xl font-bold text-gray-700 shadow-sm">
                    {unit.value}
                  </div>
                  <span className="mt-1 block text-xs text-gray-500">{unit.label}</span>
                </div>
                {i < units.length - 1 && (
                  <span className="pt-3 font-fredoka text-2xl font-bold text-brand-purple">:</span>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 font-fredoka text-sm font-semibold tracking-wide text-white shadow-md transition-transform hover:scale-[1.03]"
          >
            SHOP NOW
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
