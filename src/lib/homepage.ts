import {
  getCollectionProducts,
  getProductByHandle,
  getBlogArticles,
  getShopMetafieldImage,
  type ShopifyImage,
  type ShopifyProductCard,
  type ShopifyProductDetail,
  type ShopifyArticle,
} from './shopify';

// Which Shopify resources feed each part of the homepage. Editing a product /
// collection / blog in the Shopify admin updates the site with no code change;
// to point a section at a different product, change the handle here.
export const HOMEPAGE_CONTENT = {
  featuredCollection: 'featured-collection',
  heroProduct: 'pilgrimhajj-a-sacred-journey-of-faith-fun-reflection-family-board-game',
  diyProduct: 'diy-sadaqah-box-craft-kit-build-decorate-your-own-charity-box',
  blog: 'news',
  // Free Shipping section image — a dedicated Shop-level file metafield so the
  // image stays off product pages. Set it in admin (Content → Files, then the
  // "Homepage trust image" Shop metafield).
  trustImage: { namespace: 'homepage', key: 'trust_image' },
} as const;

export type HomepageContent = {
  featured: ShopifyProductCard[];
  hero: ShopifyProductDetail | null;
  trustImage: ShopifyImage;
  diy: ShopifyProductDetail | null;
  articles: ShopifyArticle[];
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
  const [featured, hero, trustImage, diy, articles] = await Promise.all([
    safe('featured collection', () => getCollectionProducts(HOMEPAGE_CONTENT.featuredCollection, 3), []),
    safe('hero product', () => getProductByHandle(HOMEPAGE_CONTENT.heroProduct), null),
    safe(
      'trust image',
      () => getShopMetafieldImage(HOMEPAGE_CONTENT.trustImage.namespace, HOMEPAGE_CONTENT.trustImage.key),
      null,
    ),
    safe('DIY product', () => getProductByHandle(HOMEPAGE_CONTENT.diyProduct), null),
    safe('blog articles', () => getBlogArticles(HOMEPAGE_CONTENT.blog, 3), []),
  ]);
  return { featured, hero, trustImage, diy, articles };
}
