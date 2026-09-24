import { Stars } from '@/components/ui/Stars';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import type { ShopifyTestimonial } from '@/lib/shopify';

export default function Testimonials({ testimonials }: { testimonials: ShopifyTestimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <Reveal className="rounded-3xl bg-bg-mint px-6 py-14 sm:px-10">
        {/* text-on-mint (not white) — white-on-bg-bg-mint was ~1.6:1 contrast. */}
        <h2 className="text-center font-fredoka text-3xl font-bold uppercase tracking-wide text-on-mint sm:text-4xl">
          Hear from our happy customers!
        </h2>

        <Stagger className="mx-auto mt-10 grid max-w-5xl gap-7 sm:grid-cols-2">
          {testimonials.map(({ quote, author, role }) => (
            <div
              key={author}
              className="flex flex-col rounded-2xl bg-card-yellow px-6 py-8 text-center"
              style={{ boxShadow: 'var(--shadow-sticker)' }}
            >
              <div className="flex justify-center text-brand-green">
                <Stars value={5} size={20} />
              </div>
              <p className="mt-5 font-fredoka text-lg font-semibold leading-snug text-brand-green">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-brand-green/20">
                <p className="font-fredoka text-base font-bold text-brand-green">{author}</p>
                {role && <p className="mt-1 font-nunito text-sm text-brand-green/80">{role}</p>}
              </div>
            </div>
          ))}
        </Stagger>
      </Reveal>
    </section>
  );
}
