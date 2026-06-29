// Skeleton shown while a product page loads.
export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="h-4 w-32 animate-pulse rounded-full bg-gray-100" />
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="aspect-square w-full animate-pulse rounded-3xl bg-gray-100" />
        <div>
          <div className="h-9 w-2/3 animate-pulse rounded-full bg-gray-100" />
          <div className="mt-4 h-7 w-32 animate-pulse rounded-full bg-gray-100" />
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-gray-100" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-gray-100" />
            <div className="h-4 w-4/6 animate-pulse rounded-full bg-gray-100" />
          </div>
          <div className="mt-8 h-14 w-56 animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>
    </main>
  );
}
