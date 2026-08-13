// Portrait showcase clip (public/videos/trust-showcase.mp4) replacing the old
// `homepage.trust_image` banner. Kept at its native 9:16 aspect ratio and
// centered rather than cropped to a wide box, since the clip is vertical.
export default function TrustShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-8">
      <video
        src="/videos/trust-showcase.mp4"
        autoPlay
        muted
        loop
        playsInline
        controls
        className="aspect-[9/16] h-auto max-h-[80vh] w-auto max-w-full mx-auto rounded-3xl bg-bg-cream object-contain"
      />
    </section>
  );
}
