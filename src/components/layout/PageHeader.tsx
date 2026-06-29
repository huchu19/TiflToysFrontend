import { Star, Sparkle } from '@/components/ui/Doodles';

// Consistent playful page heading (matches the homepage section headers).
export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-3">
        <Star className="h-7 w-7 text-brand-orange" />
        <h1 className="font-fredoka text-4xl font-bold text-brand-purple sm:text-5xl">{title}</h1>
        <Sparkle className="h-7 w-7 text-brand-green" />
      </div>
      {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-gray-600">{subtitle}</p> : null}
    </div>
  );
}
