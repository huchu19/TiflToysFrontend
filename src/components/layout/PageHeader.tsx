import { Star, Sparkle } from '@/components/ui/Doodles';
import { Reveal } from '@/components/motion/Reveal';
import { StickerSpot } from '@/components/play/StickerSpot';

// Consistent playful page heading (matches the homepage section headers).
export default function PageHeader({
  title,
  subtitle,
  stickerId,
}: {
  title: string;
  subtitle?: string;
  /** Optional hidden sticker-hunt spot (see lib/stickers.ts) shown beside the heading. */
  stickerId?: string;
}) {
  return (
    <Reveal className="relative text-center">
      <div className="flex items-center justify-center gap-3">
        <Star className="h-7 w-7 text-brand-orange" />
        <h1 className="font-fredoka text-4xl font-bold text-brand-purple sm:text-5xl">{title}</h1>
        <Sparkle className="h-7 w-7 text-brand-green" />
        {stickerId && <StickerSpot id={stickerId} className="absolute -right-2 top-0 sm:right-6" />}
      </div>
      {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-gray-600">{subtitle}</p> : null}
    </Reveal>
  );
}
