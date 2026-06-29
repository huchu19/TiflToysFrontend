'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { sendContactMessage, type ContactState } from './actions';

const initialState: ContactState = { status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-brand-purple px-9 py-3.5 font-fredoka text-sm font-semibold tracking-wide text-white shadow-md transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Sending…' : 'Send message'}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(sendContactMessage, initialState);

  if (state.status === 'success') {
    return (
      <div className="rounded-2xl bg-bg-mint/60 px-6 py-10 text-center">
        <p className="font-fredoka text-xl font-bold text-brand-green">Thanks for reaching out! 🎉</p>
        <p className="mt-2 text-gray-600">We&rsquo;ll get back to you as soon as we can.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.status === 'error' && state.message && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-fredoka text-sm font-semibold text-gray-700">Name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!state.fieldErrors?.name}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-purple"
          />
          {state.fieldErrors?.name && (
            <span className="mt-1 block text-xs text-red-500">{state.fieldErrors.name}</span>
          )}
        </label>
        <label className="block">
          <span className="mb-1 block font-fredoka text-sm font-semibold text-gray-700">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!state.fieldErrors?.email}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-purple"
          />
          {state.fieldErrors?.email && (
            <span className="mt-1 block text-xs text-red-500">{state.fieldErrors.email}</span>
          )}
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block font-fredoka text-sm font-semibold text-gray-700">Message</span>
        <textarea
          name="message"
          rows={5}
          aria-invalid={!!state.fieldErrors?.message}
          className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-purple"
        />
        {state.fieldErrors?.message && (
          <span className="mt-1 block text-xs text-red-500">{state.fieldErrors.message}</span>
        )}
      </label>

      {/* Honeypot — hidden from users, catches bots. */}
      <div className="hidden" aria-hidden>
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <SubmitButton />
    </form>
  );
}
