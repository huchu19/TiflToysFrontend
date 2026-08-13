// Shopify cart — the single source of truth for the basket. All reads/writes go
// through the Storefront cart API; checkout is the Shopify-hosted `checkoutUrl`.
// These run server-side only (Server Components / Server Actions) and bypass the
// fetch cache so the cart is always live.
/* eslint-disable @typescript-eslint/no-explicit-any -- GraphQL cart nodes are
   dynamic; typed as `any` at this boundary and normalized into Cart below. */
import { shopifyFetchInventory, formatPrice, type ShopifyImageData } from '@/lib/shopify';

export type CartLine = {
  id: string;
  quantity: number;
  /** Line total (quantity × unit price), formatted. */
  lineTotal: string;
  merchandise: {
    variantId: string;
    variantTitle: string;
    productTitle: string;
    productHandle: string;
    /** Unit price, formatted. */
    price: string;
    image: ShopifyImageData | null;
    availableForSale: boolean;
    /** Stock cap for tracked inventory; null when untracked/unlimited. */
    quantityAvailable: number | null;
    /** Variant option pairs, e.g. [{ name: 'Color', value: 'Blue' }]. */
    options: { name: string; value: string }[];
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: string;
  /** Raw subtotal, for threshold maths (free-shipping progress). */
  subtotalAmount: number;
  total: string;
  currencyCode: string;
  lines: CartLine[];
};

// `quantityAvailable` needs the inventory scope — included only when available
// (see shopifyFetchInventory). Without it, qty caps simply don't apply.
const cartFragment = (inv: boolean) => `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            ${inv ? 'quantityAvailable' : ''}
            price { amount currencyCode }
            image { url altText width height }
            product { title handle }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

function mapCart(node: any): Cart | null {
  if (!node) return null;
  const currencyCode = node.cost?.subtotalAmount?.currencyCode ?? 'CAD';
  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity ?? 0,
    subtotal: formatPrice(node.cost?.subtotalAmount?.amount ?? '0'),
    subtotalAmount: Number(node.cost?.subtotalAmount?.amount ?? 0),
    total: formatPrice(node.cost?.totalAmount?.amount ?? '0'),
    currencyCode,
    lines: (node.lines?.edges ?? []).map((e: any): CartLine => {
      const m = e.node.merchandise ?? {};
      const img = m.image;
      return {
        id: e.node.id,
        quantity: e.node.quantity,
        lineTotal: formatPrice(e.node.cost?.totalAmount?.amount ?? '0'),
        merchandise: {
          variantId: m.id,
          variantTitle: m.title ?? '',
          productTitle: m.product?.title ?? '',
          productHandle: m.product?.handle ?? '',
          price: formatPrice(m.price?.amount ?? '0'),
          image: img?.url
            ? {
                src: img.url,
                alt: img.altText ?? '',
                width: img.width ?? null,
                height: img.height ?? null,
              }
            : null,
          availableForSale: m.availableForSale ?? false,
          quantityAvailable: m.quantityAvailable ?? null,
          options: (m.selectedOptions ?? []).map((o: any) => ({
            name: o.name,
            value: o.value,
          })),
        },
      };
    }),
  };
}

type UserError = { field?: string[] | null; message: string };

function throwUserErrors(errors: UserError[] | undefined) {
  if (errors && errors.length > 0) {
    throw new Error(`Cart error: ${errors.map((e) => e.message).join('; ')}`);
  }
}

/** Fetch an existing cart by id. Returns null if it no longer exists. */
export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetchInventory<any>(
    (inv) => `query Cart($cartId: ID!) { cart(id: $cartId) { ${cartFragment(inv)} } }`,
    { cartId },
    { noStore: true },
  );
  return mapCart(data.cart);
}

/** Create a cart, optionally seeded with a first line. */
export async function createCart(
  variantId?: string,
  quantity = 1,
): Promise<Cart> {
  const lines = variantId ? [{ merchandiseId: variantId, quantity }] : [];
  const data = await shopifyFetchInventory<any>(
    (inv) => `mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart { ${cartFragment(inv)} }
        userErrors { field message }
      }
    }`,
    { lines },
    { noStore: true },
  );
  throwUserErrors(data.cartCreate?.userErrors);
  const cart = mapCart(data.cartCreate?.cart);
  if (!cart) throw new Error('Cart could not be created.');
  return cart;
}

export async function cartLinesAdd(
  cartId: string,
  variantId: string,
  quantity = 1,
): Promise<Cart> {
  const data = await shopifyFetchInventory<any>(
    (inv) => `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${cartFragment(inv)} }
        userErrors { field message }
      }
    }`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    { noStore: true },
  );
  throwUserErrors(data.cartLinesAdd?.userErrors);
  const cart = mapCart(data.cartLinesAdd?.cart);
  if (!cart) throw new Error('Could not add item to cart.');
  return cart;
}

export async function cartLinesUpdate(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const data = await shopifyFetchInventory<any>(
    (inv) => `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${cartFragment(inv)} }
        userErrors { field message }
      }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] },
    { noStore: true },
  );
  throwUserErrors(data.cartLinesUpdate?.userErrors);
  const cart = mapCart(data.cartLinesUpdate?.cart);
  if (!cart) throw new Error('Could not update cart.');
  return cart;
}

export async function cartLinesRemove(cartId: string, lineId: string): Promise<Cart> {
  const data = await shopifyFetchInventory<any>(
    (inv) => `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${cartFragment(inv)} }
        userErrors { field message }
      }
    }`,
    { cartId, lineIds: [lineId] },
    { noStore: true },
  );
  throwUserErrors(data.cartLinesRemove?.userErrors);
  const cart = mapCart(data.cartLinesRemove?.cart);
  if (!cart) throw new Error('Could not remove item from cart.');
  return cart;
}
