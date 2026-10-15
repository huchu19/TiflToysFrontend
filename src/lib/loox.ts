/* eslint-disable @typescript-eslint/no-explicit-any -- Loox responses are
   normalized into the exported types by the map* helpers below. */
import { SITE_URL } from './site';

// ---------------------------------------------------------------------------
// Loox reviews (Storefront API — https://developers.loox.app/documentation/).
//
// Reviews are collected by the Loox Shopify app; this module reads the
// published ones so new reviews show up on the site automatically, with no code
// or admin change. Reads run server-side (Server Components) and are cached via
// ISR, so reviews are in the HTML for SEO and nothing Loox-related ships to the
// browser.
//
// Setup: set `LOOX_PUBLIC_STORE_ID` (Loox admin → Settings → API Keys), and
// allowlist the site's domain in Loox (Settings → General → External domains).
// The Storefront API authorizes by request origin, so we send the site's own
// origin. When unset or unreachable, every helper fails soft (null / []) and
// the site falls back to the Shopify rating metafields + testimonial copy.
// ---------------------------------------------------------------------------

const LOOX_API = 'https://storefront-api.loox.io/storefront/v1/store';

/** How long Loox reads are cached before revalidating (seconds). */
const LOOX_REVALIDATE = 300;

export type LooxMedia = {
  type: 'photo' | 'video';
  url: string;
  /** Poster image — present only for videos. */
  thumbnailUrl: string | null;
};

export type LooxReview = {
  id: string;
  rating: number;
  body: string;
  /** ISO date the review was submitted. */
  date: string;
  verified: boolean;
  /** Abbreviated by Loox, e.g. "Sarah M.". */
  reviewer: string;
  /** `handle` is parsed from the Loox product URL; null if it can't be. */
  product: { id: string; name: string; handle: string | null } | null;
  media: LooxMedia[];
  reply: string | null;
};

export type LooxBottomline = {
  totalReviews: number;
  averageRating: number;
  /** Review count per star, keyed 1–5. */
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

async function looxFetch<T>(path: string, params: Record<string, string | number> = {}): Promise<T | null> {
  const storeId = process.env.LOOX_PUBLIC_STORE_ID;
  if (!storeId) return null;

  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ).toString();
  const url = `${LOOX_API}/${encodeURIComponent(storeId)}${path}${qs ? `?${qs}` : ''}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', Origin: SITE_URL },
      next: { revalidate: LOOX_REVALIDATE },
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`[loox] ${path} responded with HTTP ${res.status}: ${detail.slice(0, 200)}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[loox] ${path} request failed:`, err);
    return null;
  }
}

/** Shopify GID ("gid://shopify/Product/123") → the numeric ID Loox expects. */
export function toLooxProductId(shopifyId: string): string {
  return shopifyId.split('/').pop() ?? shopifyId;
}

/** "https://store.myshopify.com/products/kaaba-set?x=1" → "kaaba-set". */
function handleFromUrl(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  return url.match(/\/products\/([^/?#]+)/)?.[1] ?? null;
}

function mapReview(r: any): LooxReview {
  return {
    id: String(r.id),
    rating: Number(r.rating) || 0,
    body: r.body ?? '',
    date: r.date ?? r.createdAt ?? '',
    verified: Boolean(r.verified),
    reviewer: r.reviewer?.name || 'Verified buyer',
    product: r.product?.id
      ? { id: String(r.product.id), name: r.product.name ?? '', handle: handleFromUrl(r.product.url) }
      : null,
    media: (r.media ?? [])
      .filter((m: any) => m?.url && (m.type === 'photo' || m.type === 'video'))
      .map((m: any) => ({ type: m.type, url: m.url, thumbnailUrl: m.thumbnailUrl ?? null })),
    reply: r.reply?.body || null,
  };
}

/** Published reviews for one product, best first (pinned → with media → newest). */
export async function getProductReviews(shopifyProductId: string, limit = 50): Promise<LooxReview[]> {
  const data = await looxFetch<any>('/product-reviews', {
    product_id: toLooxProductId(shopifyProductId),
    sort: 'featured',
    limit,
  });
  return (data?.reviews ?? []).map(mapReview);
}

/** Review count, average and per-star breakdown for one product. */
export async function getProductBottomline(shopifyProductId: string): Promise<LooxBottomline | null> {
  const data = await looxFetch<any>(
    `/product-reviews/bottomline/${encodeURIComponent(toLooxProductId(shopifyProductId))}`,
  );
  if (!data) return null;
  return {
    totalReviews: Number(data.totalReviews) || 0,
    averageRating: Number(data.averageRating) || 0,
    ratingDistribution: {
      1: Number(data.ratingDistribution?.['1']) || 0,
      2: Number(data.ratingDistribution?.['2']) || 0,
      3: Number(data.ratingDistribution?.['3']) || 0,
      4: Number(data.ratingDistribution?.['4']) || 0,
      5: Number(data.ratingDistribution?.['5']) || 0,
    },
  };
}

/**
 * Store-wide highlight reel for the homepage: 4–5★ reviews with written text,
 * in Loox's "featured" order (pinned first, then photo reviews, then newest).
 * Pin a review in Loox to feature it here.
 */
export async function getFeaturedReviews(count = 6): Promise<LooxReview[]> {
  const data = await looxFetch<any>('/product-reviews', {
    sort: 'featured',
    rating: '4,5',
    // Over-fetch so photo-only reviews can be dropped without coming up short.
    limit: count * 3,
  });
  return (data?.reviews ?? [])
    .map(mapReview)
    .filter((r: LooxReview) => r.body.trim().length > 0)
    .slice(0, count);
}
