import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { StickerCollection } from '@/components/play/StickerCollection';

export const metadata: Metadata = {
  title: 'Sticker Hunt',
  description: 'Six stickers are hiding around the TiflToys site — find them all for a keepsake collection.',
};

export default function StickersPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <Reveal className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="h-7 w-7 text-brand-orange" aria-hidden />
          <h1 className="font-fredoka text-4xl font-bold text-brand-purple sm:text-5xl">
            Sticker Hunt
          </h1>
        </div>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Six stickers are hiding around the site — on the homepage, About Us, Our Sectors, All
          Products, and both of the other Play pages. Tap one wherever you spot it.
        </p>
      </Reveal>

      <div className="mt-12">
        <StickerCollection />
      </div>
    </main>
  );
}
