import { Stars } from '@/components/ui/Stars';

const TESTIMONIALS = ['My kids can’t get enough', 'Perfect for kids & learning!', 'Keeps them entertained & happy'];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="rounded-3xl bg-bg-mint px-6 py-14 sm:px-10">
        <h2 className="text-center font-fredoka text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
          Hear from our happy customers!
        </h2>

        <div className="mx-auto mt-10 grid max-w-4xl gap-7 sm:grid-cols-3">
          {TESTIMONIALS.map((quote) => (
            <div
              key={quote}
              className="rounded-2xl bg-card-yellow px-6 py-10 text-center"
              style={{ boxShadow: '8px 8px 0 rgba(122, 168, 116, 0.45)' }}
            >
              <div className="flex justify-center text-brand-green">
                <Stars value={4.5} size={20} />
              </div>
              <p className="mt-5 font-fredoka text-lg font-semibold leading-snug text-brand-green">
                &ldquo;{quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
