'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DottedBg } from '@/components/ui/DottedBg';

const pad = (n: number) => String(n).padStart(2, '0');

// Countdown ticks down from ~1 day 1 hour 1 minute. The initial state matches
// what the effect first computes, so server and client render identically (no
// hydration mismatch); the timer then updates on the client only.
export default function PromoBar() {
  const [time, setTime] = useState({ days: '01', hours: '01', minutes: '01' });

  useEffect(() => {
    const deadline = Date.now() + (1 * 86400 + 1 * 3600 + 1 * 60) * 1000;
    const tick = () => {
      const diff = Math.max(0, deadline - Date.now());
      setTime({
        days: pad(Math.floor(diff / 86_400_000)),
        hours: pad(Math.floor((diff % 86_400_000) / 3_600_000)),
        minutes: pad(Math.floor((diff % 3_600_000) / 60_000)),
      });
    };
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
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
