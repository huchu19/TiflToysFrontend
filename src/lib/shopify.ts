/* eslint-disable @typescript-eslint/no-explicit-any -- GraphQL responses are
   dynamic; nodes are typed as `any` at this fetch boundary and normalized into
   exported types by the map* helpers below. */
const API_VERSION = '2026-04';

/**
 * Read a required env var, preferring the server-only name and falling back to
 * the legacy `NEXT_PUBLIC_` one. Throws a clear, actionable error if missing so
 * the app fails loudly at the boundary instead of sending `undefined` to fetch.
 *
 * Shopify credentials are server-only — these are read inside `shopifyFetch`,
 * which only runs in Server Components / Server Actions, so the token is never
 * shipped to the browser. See `.env.example`.
 */
function requireEnv(name: string): string {
  const value = process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. ` +
        `Set it in .env.local (see .env.example).`,
    );
  }
  return value;
}

/** Per-call cache control: read queries revalidate; cart mutations opt out. */
export type ShopifyFetchOptions = {
  /** ISR revalidation window in seconds. Omit for the default 60s. */
  revalidate?: number;
  /** Skip the cache entirely (cart reads/mutations need live data). */
  noStore?: boolean;
};

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: ShopifyFetchOptions = {},
): Promise<T> {
  const domain = requireEnv('SHOPIFY_STORE_DOMAIN');
  const token = requireEnv('SHOPIFY_STOREFRONT_TOKEN');

  let res: Response;
  try {
    res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      ...(options.noStore
        ? { cache: 'no-store' as const }
        : { next: { revalidate: options.revalidate ?? 60 } }),
    });
  } catch (err) {
    // Network-level failure (DNS, offline, timeout) — never reached Shopify.
    throw new Error(
      `Shopify request failed to reach ${domain}: ${(err as Error).message}`,
    );
  }

  if (!res.ok) {
    throw new Error(`Shopify API responded with HTTP ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    const message = json.errors.map((e: { message: string }) => e.message).join('; ');
    throw new Error(`Shopify GraphQL error: ${message}`);
  }
  return json.data as T;
}

// ---------------------------------------------------------------------------
// Inventory-scope fallback. `quantityAvailable` / `currentlyNotInStock` require
// the `unauthenticated_read_product_inventory` Storefront scope. If the token
// lacks it, the *whole* query is rejected — so we request those fields only when
// the scope is available, detect a denial once, and transparently retry without
// them. Stock counts/caps light up automatically once the merchant grants the
// scope; until then the site degrades gracefully (availableForSale still works).
// ---------------------------------------------------------------------------

let hasInventoryScope: boolean | null = null;

function isInventoryAccessError(err: unknown): boolean {
  return (
    err instanceof Error &&
    /quantityAvailable|currentlyNotInStock|read_product_inventory/i.test(err.message)
  );
}

/** Run a query that optionally includes inventory fields, falling back without. */
export async function shopifyFetchInventory<T>(
  build: (includeInventory: boolean) => string,
  variables: Record<string, unknown> = {},
  options: ShopifyFetchOptions = {},
): Promise<T> {
  if (hasInventoryScope === false) {
    return shopifyFetch<T>(build(false), variables, options);
  }
  try {
    const result = await shopifyFetch<T>(build(true), variables, options);
    hasInventoryScope = true;
    return result;
  } catch (err) {
    if (isInventoryAccessError(err)) {
      hasInventoryScope = false;
      return shopifyFetch<T>(build(false), variables, options);
    }
    throw err;
  }
}

// Cart reads/writes live in `src/lib/shopify/cart.ts` (the cart is the Shopify
// source of truth); mutations run through Server Actions in
// `src/components/cart/actions.ts`.

// ---------------------------------------------------------------------------
// Storefront media/content helpers used by the homepage. These pull imagery
// (and titles/prices/copy) straight from Shopify so editing in the admin flows
// through to the site with no code changes.
// ---------------------------------------------------------------------------

/** Normalised image shape — `src` is named for direct use with next/image. */
export type ShopifyImageData = {
  src: string;
  alt: string;
  width: number | null;
  height: number | null;
};
export type ShopifyImage = ShopifyImageData | null;

export type ShopifyProductCard = {
  id: string;
  title: string;
  handle: string;
  /** Raw amount string, e.g. "17.0". */
  amount: string;
  currencyCode: string;
  image: ShopifyImage;
  variantId: string | null;
  /** Product-level purchasability — true if any variant is for sale. */
  availableForSale: boolean;
};

export type ShopifyProductDetail = ShopifyProductCard & {
  description: string;
  availableForSale: boolean;
};

export type ShopifyArticle = {
  title: string;
  handle: string;
  publishedAt: string;
  excerpt: string;
  image: ShopifyImage;
};

function mapImage(image: any): ShopifyImage {
  if (!image?.url) return null;
  return {
    src: image.url,
    alt: image.altText ?? '',
    width: image.width ?? null,
    height: image.height ?? null,
  };
}

function mapProductNode(node: any): ShopifyProductCard {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    amount: node.priceRange?.minVariantPrice?.amount ?? '0',
    currencyCode: node.priceRange?.minVariantPrice?.currencyCode ?? 'USD',
    image: mapImage(node.featuredImage),
    variantId: node.variants?.edges?.[0]?.node?.id ?? null,
    availableForSale: node.availableForSale ?? true,
  };
}

const PRODUCT_CARD_FRAGMENT = `
  id
  title
  handle
  availableForSale
  priceRange { minVariantPrice { amount currencyCode } }
  featuredImage { url altText width height }
  variants(first: 1) { edges { node { id } } }
`;

/** Products in a Shopify collection — used for the Featured Collection grid. */
export async function getCollectionProducts(handle: string, first = 3): Promise<ShopifyProductCard[]> {
  const data = await shopifyFetch<any>(
    `query CollectionProducts($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) {
          edges { node { ${PRODUCT_CARD_FRAGMENT} } }
        }
      }
    }`,
    { handle, first }
  );
  const edges = data.collection?.products?.edges ?? [];
  return edges.map((e: any) => mapProductNode(e.node));
}

/** A single product with description + variant — used for hero / DIY / trust. */
export async function getProductByHandle(handle: string): Promise<ShopifyProductDetail | null> {
  const data = await shopifyFetch<any>(
    `query ProductByHandle($handle: String!) {
      product(handle: $handle) {
        ${PRODUCT_CARD_FRAGMENT}
        description
        variants(first: 1) { edges { node { id availableForSale } } }
      }
    }`,
    { handle }
  );
  const node = data.product;
  if (!node) return null;
  return {
    ...mapProductNode(node),
    description: node.description ?? '',
    availableForSale: node.variants?.edges?.[0]?.node?.availableForSale ?? false,
  };
}

/** Blog articles for the Insights section (returns [] if the blog is empty). */
export async function getBlogArticles(handle: string, first = 3): Promise<ShopifyArticle[]> {
  const data = await shopifyFetch<any>(
    `query BlogArticles($handle: String!, $first: Int!) {
      blog(handle: $handle) {
        articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
          edges { node {
            title
            handle
            publishedAt
            excerpt
            image { url altText width height }
          } }
        }
      }
    }`,
    { handle, first }
  );
  const edges = data.blog?.articles?.edges ?? [];
  return edges.map((e: any) => ({
    title: e.node.title,
    handle: e.node.handle,
    publishedAt: e.node.publishedAt,
    excerpt: e.node.excerpt ?? '',
    image: mapImage(e.node.image),
  }));
}

export type ShopifyTestimonial = {
  quote: string;
  author: string;
  role: string;
};

/**
 * Homepage reviews, sourced from a Shop-level `list.metaobject_reference`
 * metafield (`homepage.testimonials`) that points to `testimonial` metaobjects.
 * Edit the copy, order, or set of reviews in the Shopify admin (Content →
 * Metaobjects → Testimonial, and the Shop "Homepage Testimonials" metafield) —
 * no code change needed. List order in admin = display order on the site.
 */
export async function getTestimonials(first = 10): Promise<ShopifyTestimonial[]> {
  const data = await shopifyFetch<any>(
    `query ShopTestimonials($namespace: String!, $key: String!, $first: Int!) {
      shop {
        metafield(namespace: $namespace, key: $key) {
          references(first: $first) {
            nodes {
              ... on Metaobject {
                quote: field(key: "quote") { value }
                author: field(key: "author") { value }
                role: field(key: "role") { value }
              }
            }
          }
        }
      }
    }`,
    { namespace: 'homepage', key: 'testimonials', first }
  );
  const nodes = data.shop?.metafield?.references?.nodes ?? [];
  return nodes
    .map((n: any) => ({
      quote: n.quote?.value ?? '',
      author: n.author?.value ?? '',
      role: n.role?.value ?? '',
    }))
    .filter((t: ShopifyTestimonial) => t.quote && t.author);
}

/**
 * Image for a Shop-level `file_reference` metafield (storefront-visible). Used
 * by homepage sections that need a dedicated image not tied to any product — so
 * the same image never leaks onto product/collection pages. Swap it in the
 * Shopify admin (Content → Files + the Shop metafield) with no code change.
 */
export async function getShopMetafieldImage(namespace: string, key: string): Promise<ShopifyImage> {
  const data = await shopifyFetch<any>(
    `query ShopMetafieldImage($namespace: String!, $key: String!) {
      shop {
        metafield(namespace: $namespace, key: $key) {
          reference {
            ... on MediaImage { image { url altText width height } }
          }
        }
      }
    }`,
    { namespace, key }
  );
  return mapImage(data.shop?.metafield?.reference?.image);
}

/**
 * End time of the homepage promo-bar sale, from the Shop-level `promo.sale_ends_at`
 * date_time metafield. Returns the ISO 8601 string (e.g. `2026-07-15T23:59:59-04:00`)
 * or null when unset. The PromoBar counts down to this instant and hides itself when
 * it's null or already past. Change the date in the Shopify admin — no code change.
 */
export async function getSaleEndsAt(): Promise<string | null> {
  const data = await shopifyFetch<any>(
    `query SaleEndsAt($namespace: String!, $key: String!) {
      shop { metafield(namespace: $namespace, key: $key) { value } }
    }`,
    { namespace: 'promo', key: 'sale_ends_at' }
  );
  return data.shop?.metafield?.value ?? null;
}

/** Format a Shopify money amount as a plain "$0.00" string (design style). */
export function formatPrice(amount: string): string {
  const value = Number(amount);
  return Number.isFinite(value) ? `$${value.toFixed(2)}` : '';
}

// ---------------------------------------------------------------------------
// Catalogue + product-detail helpers (for the /products routes).
// ---------------------------------------------------------------------------

export type ShopifyVariant = {
  id: string;
  title: string;
  available: boolean;
  amount: string;
  currencyCode: string;
  /** Units in stock for tracked inventory; null when untracked/unlimited. */
  quantityAvailable: number | null;
  /** True when out of stock but the merchant still allows ordering. */
  currentlyNotInStock: boolean;
};

export type ShopifyProductPage = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  amount: string;
  currencyCode: string;
  images: ShopifyImageData[];
  variants: ShopifyVariant[];
};

/** Catalogue sort options exposed in the UI (mapped to Shopify sort keys). */
export type ProductSort = 'featured' | 'newest' | 'price-asc' | 'price-desc';

/** Map a UI sort option to Storefront `sortKey` + `reverse`. */
function sortToArgs(
  sort: ProductSort | undefined,
  searching: boolean,
): { sortKey: string; reverse: boolean } {
  switch (sort) {
    case 'newest':
      return { sortKey: 'CREATED_AT', reverse: true };
    case 'price-asc':
      return { sortKey: 'PRICE', reverse: false };
    case 'price-desc':
      return { sortKey: 'PRICE', reverse: true };
    default:
      // Relevance is only meaningful alongside a search query.
      return { sortKey: searching ? 'RELEVANCE' : 'BEST_SELLING', reverse: false };
  }
}

/** All products as cards — used for the catalogue grid and static params. */
export async function getAllProductCards(
  first = 50,
  sort?: ProductSort,
): Promise<ShopifyProductCard[]> {
  const { sortKey, reverse } = sortToArgs(sort, false);
  const data = await shopifyFetch<any>(
    `query AllProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges { node { ${PRODUCT_CARD_FRAGMENT} } }
      }
    }`,
    { first, sortKey, reverse }
  );
  return (data.products?.edges ?? []).map((e: any) => mapProductNode(e.node));
}

/** Full-text product search via Shopify's `query:` argument. */
export async function searchProductCards(
  query: string,
  first = 50,
  sort?: ProductSort,
): Promise<ShopifyProductCard[]> {
  const { sortKey, reverse } = sortToArgs(sort, true);
  const data = await shopifyFetch<any>(
    `query SearchProducts($q: String!, $first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(first: $first, query: $q, sortKey: $sortKey, reverse: $reverse) {
        edges { node { ${PRODUCT_CARD_FRAGMENT} } }
      }
    }`,
    { q: query, first, sortKey, reverse }
  );
  return (data.products?.edges ?? []).map((e: any) => mapProductNode(e.node));
}

export type ShopifyCollectionSummary = {
  title: string;
  handle: string;
  image: ShopifyImage;
};

export type ShopifyCollection = ShopifyCollectionSummary & {
  description: string;
  products: ShopifyProductCard[];
};

/** All storefront collections — used for the collections index + static params. */
export async function getCollections(first = 50): Promise<ShopifyCollectionSummary[]> {
  const data = await shopifyFetch<any>(
    `query Collections($first: Int!) {
      collections(first: $first) {
        edges { node { title handle image { url altText width height } } }
      }
    }`,
    { first }
  );
  return (data.collections?.edges ?? []).map((e: any) => ({
    title: e.node.title,
    handle: e.node.handle,
    image: mapImage(e.node.image),
  }));
}

/** A single collection with its products. Returns null if it doesn't exist. */
export async function getCollectionPage(handle: string, first = 24): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<any>(
    `query CollectionPage($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        title
        handle
        description
        image { url altText width height }
        products(first: $first) { edges { node { ${PRODUCT_CARD_FRAGMENT} } } }
      }
    }`,
    { handle, first }
  );
  const c = data.collection;
  if (!c) return null;
  return {
    title: c.title,
    handle: c.handle,
    description: c.description ?? '',
    image: mapImage(c.image),
    products: (c.products?.edges ?? []).map((e: any) => mapProductNode(e.node)),
  };
}

/** Full product detail (images + variants) for a product page. */
export async function getProductPage(handle: string): Promise<ShopifyProductPage | null> {
  const data = await shopifyFetchInventory<any>(
    (inv) => `query ProductPage($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 8) { edges { node { url altText width height } } }
        variants(first: 50) {
          edges {
            node {
              id
              title
              availableForSale
              ${inv ? 'quantityAvailable\n              currentlyNotInStock' : ''}
              price { amount currencyCode }
            }
          }
        }
      }
    }`,
    { handle }
  );
  const node = data.product;
  if (!node) return null;
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description ?? '',
    descriptionHtml: node.descriptionHtml ?? '',
    amount: node.priceRange?.minVariantPrice?.amount ?? '0',
    currencyCode: node.priceRange?.minVariantPrice?.currencyCode ?? 'USD',
    images: (node.images?.edges ?? [])
      .map((e: any) => mapImage(e.node))
      .filter((img: ShopifyImage): img is ShopifyImageData => img !== null),
    variants: (node.variants?.edges ?? []).map((e: any) => ({
      id: e.node.id,
      title: e.node.title,
      available: e.node.availableForSale,
      amount: e.node.price?.amount ?? '0',
      currencyCode: e.node.price?.currencyCode ?? 'USD',
      quantityAvailable: e.node.quantityAvailable ?? null,
      currentlyNotInStock: e.node.currentlyNotInStock ?? false,
    })),
  };
}