// Skeleton shown while the catalogue loads (route-level Suspense fallback).
export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <div className="mx-auto h-10 w-64 animate-pulse rounded-full bg-gray-100" />
        <div className="mx-auto mt-4 h-4 w-80 animate-pulse rounded-full bg-gray-100" />
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square w-full animate-pulse rounded-3xl bg-gray-100" />
            <div className="mt-4 h-5 w-3/4 animate-pulse rounded-full bg-gray-100" />
            <div className="mt-2 h-4 w-1/4 animate-pulse rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    </main>
  );
}
