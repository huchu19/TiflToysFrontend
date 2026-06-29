'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-20 text-center">
      <span className="text-5xl" aria-hidden>
        🧸
      </span>
      <h1 className="mt-6 font-fredoka text-3xl font-bold text-brand-purple">
        Oops — something went wrong
      </h1>
      <p className="mt-3 text-gray-600">
        We hit a snag loading this page. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="inline-flex items-center justify-center rounded-full bg-brand-purple px-8 py-3.5 font-fredoka text-sm font-semibold tracking-wide text-white shadow-md transition-transform hover:scale-[1.03]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border-2 border-brand-purple px-8 py-3 font-fredoka text-sm font-semibold tracking-wide text-brand-purple transition-colors hover:bg-brand-purple hover:text-white"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
