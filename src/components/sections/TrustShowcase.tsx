import { Reveal } from '@/components/motion/Reveal';

// Portrait showcase clip (public/videos/trust-showcase.mp4). Kept at its
// native 9:16 aspect ratio and centered rather than cropped to a wide box,
// since the clip is vertical.
export default function TrustShowcase() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <Reveal className="text-center">
        <h2 className="font-fredoka text-3xl font-bold text-brand-purple sm:text-4xl">
          See it in play
        </h2>
        <p className="mx-auto mt-3 max-w-md text-gray-600">
          A peek at how our toys turn into real family moments.
        </p>
        <video
          src="/videos/trust-showcase.mp4"
          autoPlay
          muted
          loop
          playsInline
          controls
          className="mx-auto mt-8 aspect-[9/16] h-auto max-h-[80vh] w-auto max-w-full rounded-3xl bg-bg-cream object-contain"
          style={{ boxShadow: 'var(--shadow-sticker-lg)' }}
        />
      </Reveal>
    </section>
  );
}
