import type { Metadata } from 'next';
import { Palette } from 'lucide-react';
import { getMatProduct } from '@/lib/play';
import { Reveal } from '@/components/motion/Reveal';
import { ColouringStudio } from '@/components/play/ColouringStudio';

export const metadata: Metadata = {
  title: 'Colouring Studio',
  description:
    'Colour the real TiflToys prayer mat designs online — tap to fill, freehand brush, save or print your artwork, then buy the physical mat.',
};

export default async function ColouringPage() {
  const product = await getMatProduct();

  return (
    <main className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
      <Reveal className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Palette className="h-7 w-7 text-brand-orange" aria-hidden />
          <h1 className="font-fredoka text-4xl font-bold text-brand-purple sm:text-5xl">
            Colouring Studio
          </h1>
        </div>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Colour the real prayer mat designs, tap or brush your way through five patterns, then
          bring your favourite home as the real thing.
        </p>
      </Reveal>

      <div className="mt-10">
        <ColouringStudio variants={product?.variants ?? null} />
      </div>
    </main>
  );
}
