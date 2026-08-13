import {
  getCollectionProducts,
  getProductByHandle,
  getBlogArticles,
  getShopMetafieldImage,
  getSaleEndsAt,
  getTestimonials,
  type ShopifyImage,
  type ShopifyProductCard,
  type ShopifyProductDetail,
  type ShopifyArticle,
  type ShopifyTestimonial,
} from './shopify';

// Which Shopify resources feed each part of the homepage. Editing a product /
// collection / blog in the Shopify admin updates the site with no code change;
// to point a section at a different product, change the handle here.
export const HOMEPAGE_CONTENT = {
  featuredCollection: 'featured-collection',
  heroProduct: 'pilgrimhajj-a-sacred-journey-of-faith-fun-reflection-family-board-game',
  diyProduct: 'diy-sadaqah-box-craft-kit-build-decorate-your-own-charity-box',
  blog: 'news',
  // Dedicated Shop-level file metafield so this image stays off product pages
  // and is swappable in admin (Content → Files + the matching Shop metafield).
  // Overrides the hero product image when set.
  heroImage: { namespace: 'homepage', key: 'hero_image' },
} as const;

export type HomepageContent = {
  featured: ShopifyProductCard[];
  /** Hero image — the metafield override if set, else the hero product image. */
  heroImage: ShopifyImage;
  diy: ShopifyProductDetail | null;
  articles: ShopifyArticle[];
  testimonials: ShopifyTestimonial[];
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

/** Fetch every Shopify-backed piece of the homepage in parallel. */
export async function getHomepageContent(): Promise<HomepageContent> {
  const [featured, hero, heroOverride, diy, articles, testimonials, saleEndsAt] = await Promise.all([
    safe('featured collection', () => getCollectionProducts(HOMEPAGE_CONTENT.featuredCollection, 3), []),
    safe('hero product', () => getProductByHandle(HOMEPAGE_CONTENT.heroProduct), null),
    safe(
      'hero image',
      () => getShopMetafieldImage(HOMEPAGE_CONTENT.heroImage.namespace, HOMEPAGE_CONTENT.heroImage.key),
      null,
    ),
    safe('DIY product', () => getProductByHandle(HOMEPAGE_CONTENT.diyProduct), null),
    safe('blog articles', () => getBlogArticles(HOMEPAGE_CONTENT.blog, 3), []),
    safe('testimonials', () => getTestimonials(), []),
    safe('sale end date', () => getSaleEndsAt(), null),
  ]);
  return { featured, heroImage: heroOverride ?? hero?.image ?? null, diy, articles, testimonials, saleEndsAt };
}
