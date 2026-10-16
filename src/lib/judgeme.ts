/* eslint-disable @typescript-eslint/no-explicit-any -- Judge.me responses are
   normalized into the exported types by mapReview below. */

// ---------------------------------------------------------------------------
// Judge.me reviews (REST API — https://judge.me/api/docs).
//
// Reviews are collected by the Judge.me Shopify app; this module reads the
// published ones so new reviews show up on the site automatically, with no code
// or admin change. Reads run server-side only (the private API token never
// reaches the browser) and are cached via ISR, so reviews are in the HTML for
// SEO.
//
// The store's whole review list is fetched once per cache window and filtered
// locally — at our volume that's one or two requests, and it saves mapping
// Shopify product IDs to Judge.me's internal ones.
//
// Setup: set `JUDGEME_API_TOKEN` (Judge.me → Settings → Integrations → View API
// tokens → *private* token). When unset or unreachable, every helper fails soft
// (null / []) and the site falls back to the Shopify rating metafields +
// testimonial copy.
// ---------------------------------------------------------------------------

const JUDGEME_API = 'https://api.judge.me/api/v1';

/** How long Judge.me reads are cached before revalidating (seconds). */
const JUDGEME_REVALIDATE = 300;

/** Page size + cap for the store-wide fetch (100 × 10 = up to 1,000 reviews). */
const PER_PAGE = 100;
const MAX_PAGES = 10;

const VERIFIED = new Set(['confirmed-buyer', 'buyer', 'verified-purchase', 'semi-verified-purchase', 'admin']);

export type ReviewMedia = {
  type: 'photo' | 'video';
  url: string;
  /** Poster image — present only for videos. */
  thumbnailUrl: string | null;
};

export type Review = {
  id: string;
  rating: number;
  title: string;
  body: string;
  /** ISO date the review was submitted. */
  date: string;
  verified: boolean;
  /** Pinned in Judge.me — sorted first. */
  pinned: boolean;
  /** Display name, e.g. "Sarah M.". */
  reviewer: string;
  /** Null for store (non-product) reviews. */
  product: { id: string; name: string; handle: string | null } | null;
  media: ReviewMedia[];
  reply: string | null;
};

export type ReviewBottomline = {
  totalReviews: number;
  averageRating: number;
  /** Review count per star, keyed 1–5. */
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

async function judgemeFetch(path: string, params: Record<string, string | number>): Promise<any | null> {
  const token = process.env.JUDGEME_API_TOKEN;
  const shop = process.env.SHOPIFY_STORE_DOMAIN;
  if (!token || !shop) return null;

  const qs = new URLSearchParams({
    shop_domain: shop,
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });

  try {
    const res = await fetch(`${JUDGEME_API}${path}?${qs}`, {
      headers: { Accept: 'application/json', 'X-Api-Token': token },
      next: { revalidate: JUDGEME_REVALIDATE },
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`[judgeme] ${path} responded with HTTP ${res.status}: ${detail.slice(0, 200)}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`[judgeme] ${path} request failed:`, err);
    return null;
  }
}

/** Shopify GID ("gid://shopify/Product/123") → the numeric external ID Judge.me stores. */
function toExternalId(shopifyId: string): string {
  return shopifyId.split('/').pop() ?? shopifyId;
}

/** Shown on the storefront: curated "ok" and not archived. */
function isPublished(r: any): boolean {
  return r?.curated === 'ok' && !r?.hidden;
}

function mapReview(r: any): Review {
  return {
    id: String(r.id),
    rating: Number(r.rating) || 0,
    title: r.title ?? '',
    body: r.body ?? '',
    date: r.created_at ?? '',
    verified: VERIFIED.has(r.verified),
    pinned: Boolean(r.pinned),
    reviewer: r.reviewer?.name || 'Verified buyer',
    product: r.product_external_id
      ? { id: String(r.product_external_id), name: r.product_title ?? '', handle: r.product_handle ?? null }
      : null,
    media: (r.pictures ?? [])
      .filter((p: any) => !p?.hidden && (p?.urls?.huge || p?.urls?.original))
      .map((p: any) => ({ type: 'photo' as const, url: p.urls.huge || p.urls.original, thumbnailUrl: null })),
    reply: null,
  };
}

/** Best first: pinned → with photos → newest. */
function byFeatured(a: Review, b: Review): number {
  return (
    Number(b.pinned) - Number(a.pinned) ||
    Number(b.media.length > 0) - Number(a.media.length > 0) ||
    b.date.localeCompare(a.date)
  );
}

/** Every published review in the store (cached), or null if Judge.me is unavailable. */
async function getAllReviews(): Promise<Review[] | null> {
  const all: Review[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await judgemeFetch('/reviews', { per_page: PER_PAGE, page });
    if (!data) return page === 1 ? null : all;
    const batch: any[] = data.reviews ?? [];
    all.push(...batch.filter(isPublished).map(mapReview));
    if (batch.length < PER_PAGE) break;
  }
  return all;
}

/** Published reviews for one product, best first. */
export async function getProductReviews(shopifyProductId: string, limit = 50): Promise<Review[]> {
  const id = toExternalId(shopifyProductId);
  const all = await getAllReviews();
  return (all ?? []).filter((r) => r.product?.id === id).sort(byFeatured).slice(0, limit);
}

/** Review count, average and per-star breakdown for one product (null if Judge.me is unavailable). */
export async function getProductBottomline(shopifyProductId: string): Promise<ReviewBottomline | null> {
  const all = await getAllReviews();
  if (!all) return null;
  const id = toExternalId(shopifyProductId);
  const reviews = all.filter((r) => r.product?.id === id);

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    ratingDistribution[star]++;
  }
  const total = reviews.length;
  const average = total ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  return { totalReviews: total, averageRating: Math.round(average * 10) / 10, ratingDistribution };
}

/**
 * Store-wide highlight reel for the homepage: 4–5★ reviews with written text,
 * pinned first, then photo reviews, then newest. Pin a review in Judge.me to
 * feature it here.
 */
export async function getFeaturedReviews(count = 6): Promise<Review[]> {
  const all = await getAllReviews();
  return (all ?? [])
    .filter((r) => r.rating >= 4 && r.body.trim().length > 0)
    .sort(byFeatured)
    .slice(0, count);
}
