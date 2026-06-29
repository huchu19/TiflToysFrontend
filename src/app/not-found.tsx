import Link from 'next/link';
import { Star, Curl, Arc, Sparkle } from '@/components/ui/Doodles';

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center lg:px-8">
      <div className="relative">
        <Star className="absolute -left-10 -top-4 hidden h-8 w-8 text-bg-yellow sm:block" />
        <Curl className="absolute -right-12 top-2 hidden h-10 w-10 text-brand-purple sm:block" />
        <Arc className="absolute -bottom-2 -left-14 hidden h-10 w-10 text-brand-orange sm:block" />
        <p className="font-fredoka text-8xl font-bold leading-none text-brand-purple sm:text-9xl">
          4
          <span className="text-brand-green">0</span>
          <span className="text-brand-orange">4</span>
        </p>
        <Sparkle className="absolute -right-8 -top-6 hidden h-7 w-7 text-brand-green sm:block" />
      </div>

      <div className="mt-8 text-6xl" aria-hidden>
        🧸
      </div>

      <h1 className="mt-6 font-fredoka text-3xl font-bold text-brand-orange">
        Oops! This toy wandered off.
      </h1>
      <p className="mt-3 max-w-md text-gray-600">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved. Let&rsquo;s get you back
        to the fun.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-brand-purple px-9 py-4 font-fredoka text-base font-semibold tracking-wide text-white shadow-md transition-transform hover:scale-[1.03]"
        >
          Back home
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full border-2 border-brand-purple px-9 py-3.5 font-fredoka text-base font-semibold tracking-wide text-brand-purple transition-colors hover:bg-brand-purple hover:text-white"
        >
          Browse toys
        </Link>
      </div>
    </main>
  );
}
