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

async function clearCartId(): Promise<void> {
  const store = await cookies();
  store.delete(CART_COOKIE);
}

/** Current cart for the request's cookie, or null. Used to seed the client. */
export async function getCurrentCart(): Promise<Cart | null> {
  const cartId = await readCartId();
  if (!cartId) return null;
  try {
    const cart = await getCart(cartId);
    if (!cart) {
      await clearCartId();
      return null;
    }
    return cart;
  } catch {
    // Stale/invalid cart id — drop it and start fresh.
    await clearCartId();
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
