'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { DottedBg } from '@/components/ui/DottedBg';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-bg-orange px-6 py-16 text-center">
        <DottedBg color="#E0915F" />

        <div className="relative">
          <h2 className="font-fredoka text-4xl font-bold uppercase tracking-wide text-white sm:text-5xl">
            Get Playful Updates!
          </h2>

          {subscribed ? (
            <p className="mt-6 font-fredoka text-lg font-semibold text-white">
              Thanks for subscribing! 🎉
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
              className="mx-auto mt-6 flex max-w-md flex-col items-stretch gap-3 sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-3">
                <Mail className="h-5 w-5 shrink-0 text-brand-orange" strokeWidth={2} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your mail here.."
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-white px-8 py-3 font-fredoka text-sm font-semibold tracking-wide text-brand-orange shadow-sm transition-transform hover:scale-[1.03]"
              >
                Join Now
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
