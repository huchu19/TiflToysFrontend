import {
  getCollectionProducts,
  getProductByHandle,
  getBlogArticles,
  getHeroImage,
  getSaleEndsAt,
  getTestimonials,
  type ShopifyImage,
  type ShopifyProductCard,
  type ShopifyProductDetail,
  type ShopifyArticle,
} from './shopify';
import { getFeaturedReviews } from './judgeme';
import type { Country } from './country';

// Which Shopify resources feed each part of the homepage. Editing a product /
// collection / blog in the Shopify admin updates the site with no code change;
// to point a section at a different product, change the handle here.
export const HOMEPAGE_CONTENT = {
  featuredCollection: 'featured-collection',
  heroProduct: 'pilgrimhajj-a-sacred-journey-of-faith-fun-reflection-family-board-game',
  diyProduct: 'diy-sadaqah-box-craft-kit-build-decorate-your-own-charity-box',
  blog: 'news',
} as const;

/** One card in the homepage "happy customers" section. */
export type HomepageTestimonial = {
  id: string;
  quote: string;
  author: string;
  /** Subtitle under the name — the reviewed product, or a role like "Mom of 3". */
  role: string;
  /** Stars shown on the card (1–5). */
  rating: number;
  /** Optional link for the subtitle (e.g. the reviewed product page). */
  href?: string;
};

export type HomepageContent = {
  featured: ShopifyProductCard[];
  /** Hero image — the "Hero" metaobject's image if set, else the hero product's first image. */
  heroImage: ShopifyImage;
  diy: ShopifyProductDetail | null;
  articles: ShopifyArticle[];
  /** Live Judge.me reviews when available, else the hand-picked testimonial metaobjects. */
  testimonials: HomepageTestimonial[];
  /** ISO end time for the promo-bar sale, or null when no sale is configured. */
  saleEndsAt: string | null;
};

/** Resolve a fetch, logging and falling back instead of breaking the page. */
async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[homepage] failed to load ${label}:`, err);
    return fallback;
  }
}

/** Fetch every Shopify-backed piece of the homepage in parallel, priced for
 *  the visitor's market. */
export async function getHomepageContent(country: Country): Promise<HomepageContent> {
  const [featured, hero, heroOverride, diy, articles, reviews, testimonials, saleEndsAt] = await Promise.all([
    safe('featured collection', () => getCollectionProducts(HOMEPAGE_CONTENT.featuredCollection, 3, country), []),
    safe('hero product', () => getProductByHandle(HOMEPAGE_CONTENT.heroProduct), null),
    safe('hero image', () => getHeroImage(), null),
    safe('DIY product', () => getProductByHandle(HOMEPAGE_CONTENT.diyProduct, country), null),
    safe('blog articles', () => getBlogArticles(HOMEPAGE_CONTENT.blog, 3), []),
    safe('Judge.me reviews', () => getFeaturedReviews(4), []),
    safe('testimonials', () => getTestimonials(), []),
    safe('sale end date', () => getSaleEndsAt(), null),
  ]);

  // Real customer reviews win; the curated metaobject testimonials are the
  // fallback (Judge.me not configured / unreachable / no 4–5★ written reviews yet).
  const cards: HomepageTestimonial[] = reviews.length
    ? reviews.map((r) => ({
        id: r.id,
        quote: r.body,
        author: r.reviewer,
        role: r.product?.name ?? (r.verified ? 'Verified buyer' : ''),
        rating: r.rating,
        href: r.product?.handle ? `/products/${r.product.handle}` : undefined,
      }))
    : testimonials.map((t, i) => ({ id: `t${i}`, ...t, rating: 5 }));

  return { featured, heroImage: heroOverride ?? hero?.image ?? null, diy, articles, testimonials: cards, saleEndsAt };
}
