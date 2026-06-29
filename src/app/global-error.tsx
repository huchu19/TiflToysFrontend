'use client'; // global-error replaces the root layout, so it ships its own <html>/<body>.

import { useEffect } from 'react';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // globals.css (and Tailwind) are not loaded here because this bypasses the
  // root layout — keep styling inline so the fallback always renders.
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          color: '#4a4a4a',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ fontSize: '3rem' }} aria-hidden>
          🧸
        </div>
        <h1 style={{ color: '#6B4FA0', fontSize: '1.75rem', marginTop: '1rem' }}>
          Something went wrong
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          We hit an unexpected error. Please try again.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            marginTop: '1.5rem',
            background: '#6B4FA0',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.85rem 2rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
