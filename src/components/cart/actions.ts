'use server';

// Server Actions for cart mutations. The cart id lives in an httpOnly cookie so
// it never touches the browser; the client gets cart state back as the action's
// return value and reflects it through CartContext.
import { cookies } from 'next/headers';
import {
  getCart,
  createCart,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  type Cart,
} from '@/lib/shopify/cart';

const CART_COOKIE = 'tifl_cart_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function readCartId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

async function writeCartId(cartId: string): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
}

/** Current cart for the request's cookie, or null. Used to seed the client.
 *
 * IMPORTANT: this is read-only and must NOT mutate cookies. It runs during
 * RootLayout render (src/app/layout.tsx), and the App Router forbids writing
 * cookies during render — doing so throws and crashes the whole page into
 * `global-error`. A stale/completed cart id simply resolves to null here and is
 * harmless: the next `addToCartAction` creates a fresh cart and overwrites the
 * cookie (that's where dead ids get swept, in a legal Server Action context). */
export async function getCurrentCart(): Promise<Cart | null> {
  const cartId = await readCartId();
  if (!cartId) return null;
  try {
    // getCart() returns null for a completed/expired cart — treat as no cart.
    return await getCart(cartId);
  } catch {
    // Transient Shopify error or bad id — fail soft so the layout still renders.
    return null;
  }
}

export async function addToCartAction(variantId: string, quantity = 1): Promise<Cart> {
  const cartId = await readCartId();
  if (cartId) {
    try {
      return await cartLinesAdd(cartId, variantId, quantity);
    } catch {
      // Cart likely expired — fall through and create a new one.
    }
  }
  const cart = await createCart(variantId, quantity);
  await writeCartId(cart.id);
  return cart;
}

export async function updateCartLineAction(lineId: string, quantity: number): Promise<Cart> {
  const cartId = await readCartId();
  if (!cartId) throw new Error('No active cart.');
  if (quantity <= 0) {
    return cartLinesRemove(cartId, lineId);
  }
  return cartLinesUpdate(cartId, lineId, quantity);
}

export async function removeCartLineAction(lineId: string): Promise<Cart> {
  const cartId = await readCartId();
  if (!cartId) throw new Error('No active cart.');
  return cartLinesRemove(cartId, lineId);
}
