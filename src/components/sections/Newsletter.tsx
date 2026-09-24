'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Mail } from 'lucide-react';
import { DottedBg } from '@/components/ui/DottedBg';
import { Reveal } from '@/components/motion/Reveal';
import { subscribeToNewsletter, type NewsletterState } from './newsletter-actions';

const initialState: NewsletterState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-white px-8 py-3 font-fredoka text-sm font-semibold tracking-wide text-brand-orange shadow-sm transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? 'Joining…' : 'Join Now'}
    </button>
  );
}

export default function Newsletter() {
  const [state, formAction] = useActionState(subscribeToNewsletter, initialState);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <Reveal className="relative overflow-hidden rounded-3xl bg-bg-orange px-6 py-16 text-center">
        <DottedBg color="#E0915F" />

        <div className="relative">
          <h2 className="font-fredoka text-4xl font-bold uppercase tracking-wide text-white sm:text-5xl">
            Get Playful Updates!
          </h2>

          {state.status === 'success' ? (
            <p className="mt-6 font-fredoka text-lg font-semibold text-white">
              Thanks for subscribing! 🎉
            </p>
          ) : (
            <>
              {state.status === 'error' && state.message && (
                <p className="relative mx-auto mt-4 max-w-md rounded-xl bg-white/90 px-4 py-2 text-sm text-red-600" role="alert">
                  {state.message}
                </p>
              )}
              <form
                action={formAction}
                noValidate
                className="mx-auto mt-6 flex max-w-md flex-col items-stretch gap-3 sm:flex-row"
              >
                <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-3">
                  <Mail className="h-5 w-5 shrink-0 text-brand-orange" strokeWidth={2} />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your mail here.."
                    className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </div>

                {/* Honeypot — hidden from users, catches bots. */}
                <div className="hidden" aria-hidden>
                  <label>
                    Company
                    <input name="company" type="text" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <SubmitButton />
              </form>
            </>
          )}
        </div>
      </Reveal>
    </section>
  );
}
