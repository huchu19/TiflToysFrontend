import type { Metadata } from 'next';
import { Compass } from 'lucide-react';
import { getHajjProduct } from '@/lib/play';
import { Reveal } from '@/components/motion/Reveal';
import { HajjJourney } from '@/components/play/HajjJourney';

export const metadata: Metadata = {
  title: 'The Hajj Journey',
  description:
    'Scroll through the seven stations of Hajj, from Ihram to the farewell Tawaf, told for curious young minds.',
};

export default async function HajjPage() {
  const product = await getHajjProduct();

  return (
    <main className="mx-auto max-w-3xl px-6 py-14 lg:px-8">
      <Reveal className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Compass className="h-7 w-7 text-brand-orange" aria-hidden />
          <h1 className="font-fredoka text-4xl font-bold text-brand-purple sm:text-5xl">
            The Hajj Journey
          </h1>
        </div>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Scroll through the seven stations of the pilgrimage — one story, one step at a time.
        </p>
      </Reveal>

      <div className="mt-14">
        <HajjJourney product={product} />
      </div>
    </main>
  );
}
