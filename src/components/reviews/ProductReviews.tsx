import { BadgeCheck, MessageCircleHeart } from 'lucide-react';
import { Stars } from '@/components/ui/Stars';
import { SITE_NAME } from '@/lib/site';
import type { Review, ReviewBottomline } from '@/lib/judgeme';
import { ReviewsExpander } from './ReviewsExpander';

const STAR_KEYS = [5, 4, 3, 2, 1] as const;

function formatReviewDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** Average + per-star breakdown, styled as a sticker card. */
function Summary({ bottomline }: { bottomline: ReviewBottomline }) {
  const { totalReviews, averageRating, ratingDistribution } = bottomline;
  return (
    <div
      className="flex flex-col gap-6 rounded-3xl bg-bg-cream px-6 py-7 sm:flex-row sm:items-center sm:gap-10 sm:px-8"
      style={{ boxShadow: 'var(--shadow-sticker)' }}
    >
      <div className="text-center sm:text-left">
        <p className="font-fredoka text-5xl font-bold text-brand-purple">{averageRating.toFixed(1)}</p>
        <div className="mt-1 text-brand-orange">
          <Stars value={averageRating} size={20} />
        </div>
        <p className="mt-1 text-sm text-ink-500">
          Based on {totalReviews} review{totalReviews === 1 ? '' : 's'}
        </p>
      </div>
      <ul className="flex-1 space-y-1.5" aria-label="Rating breakdown">
        {STAR_KEYS.map((star) => {
          const n = ratingDistribution[star];
          const pct = totalReviews ? Math.round((n / totalReviews) * 100) : 0;
          return (
            <li key={star} className="flex items-center gap-3 text-sm text-ink-700">
              <span className="w-8 shrink-0 font-fredoka font-semibold">{star}★</span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-white">
                <span className="block h-full rounded-full bg-brand-orange" style={{ width: `${pct}%` }} />
              </span>
              <span className="w-8 shrink-0 text-right text-ink-500">{n}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ReviewMedia({ media }: { media: Review['media'] }) {
  if (media.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {media.slice(0, 4).map((m) =>
        m.type === 'video' ? (
          <video
            key={m.url}
            src={m.url}
            poster={m.thumbnailUrl ?? undefined}
            controls
            preload="none"
            playsInline
            className="h-24 w-24 rounded-xl bg-bg-blue object-cover"
          />
        ) : (
          <a
            key={m.url}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-xl"
            aria-label="Open customer photo"
          >
            {/* Plain <img>: Judge.me serves photos from its own CDN hosts, which
                aren't (and needn't be) in next/image's remotePatterns. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.url}
              alt="Customer photo"
              loading="lazy"
              className="h-24 w-24 object-cover transition-transform duration-300 hover:scale-105"
            />
          </a>
        ),
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const date = formatReviewDate(review.date);
  return (
    <article className="flex h-full flex-col rounded-2xl border-2 border-bg-cream bg-white px-5 py-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-brand-orange">
          <Stars value={review.rating} size={16} />
        </span>
        {date && (
          <time dateTime={review.date} className="text-xs text-ink-400">
            {date}
          </time>
        )}
      </div>
      <p className="mt-3 flex items-center gap-1.5 font-fredoka text-base font-semibold text-brand-purple">
        {review.reviewer}
        {review.verified && (
          <span className="inline-flex items-center gap-1 font-nunito text-xs font-semibold text-on-mint">
            <BadgeCheck className="h-4 w-4 text-brand-green" aria-hidden />
            Verified buyer
          </span>
        )}
      </p>
      {review.title && <p className="mt-2 font-semibold text-ink-700">{review.title}</p>}
      {review.body && <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-700">{review.body}</p>}
      <ReviewMedia media={review.media} />
      {review.reply && (
        <div className="mt-4 rounded-xl bg-bg-mint/60 px-4 py-3 text-sm">
          <p className="font-fredoka font-semibold text-on-mint">Reply from {SITE_NAME}</p>
          <p className="mt-1 leading-relaxed text-ink-700">{review.reply}</p>
        </div>
      )}
    </article>
  );
}

/**
 * Product-page reviews from Judge.me. Rendered on the server, so new reviews appear
 * automatically (within the ISR window) and are crawlable.
 */
export default function ProductReviews({
  bottomline,
  reviews,
}: {
  bottomline: ReviewBottomline;
  reviews: Review[];
}) {

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="mt-20 scroll-mt-28">
      <h2 id="reviews-heading" className="font-fredoka text-3xl font-bold text-brand-purple">
        What families are saying
      </h2>

      {bottomline.totalReviews > 0 ? (
        <>
          <div className="mt-6">
            <Summary bottomline={bottomline} />
          </div>
          {reviews.length > 0 && (
            <div className="mt-8">
              <ReviewsExpander initial={6}>
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </ReviewsExpander>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 flex items-start gap-4 rounded-3xl bg-bg-cream px-6 py-7 sm:px-8">
          <MessageCircleHeart className="mt-0.5 h-7 w-7 shrink-0 text-brand-orange" aria-hidden />
          <div>
            <p className="font-fredoka text-lg font-semibold text-brand-purple">No reviews yet</p>
            <p className="mt-1 leading-relaxed text-ink-700">
              Bought this one? After your order arrives we&rsquo;ll email you a link to share a review —
              photos of little ones playing are always welcome!
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

/** Small "★★★★★ 4.8 (12)" line used under product titles. Links to #reviews. */
export function RatingSummaryLink({ value, count }: { value: number; count: number }) {
  return (
    <a
      href="#reviews"
      className="mt-3 inline-flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-brand-purple"
    >
      <span className="text-brand-orange">
        <Stars value={value} size={18} />
      </span>
      <span className="font-semibold text-ink-700">{value.toFixed(1)}</span>
      <span>
        ({count} review{count === 1 ? '' : 's'})
      </span>
    </a>
  );
}
