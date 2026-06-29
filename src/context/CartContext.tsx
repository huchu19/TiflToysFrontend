'use client';

import {
  createContext,
  useCallback,
  useContext,
  useOptimistic,
  useState,
  useTransition,
  type ReactNode,
} from 'react';
import type { Cart } from '@/lib/shopify/cart';
import {
  addToCartAction,
  updateCartLineAction,
  removeCartLineAction,
} from '@/components/cart/actions';

interface CartContextType {
  /** Optimistic cart (reflects pending mutations immediately). May be null. */
  cart: Cart | null;
  /** Derived from the cart's `totalQuantity` — never tracked locally. */
  itemCount: number;
  isPending: boolean;
  error: string | null;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

type OptimisticAction =
  | { type: 'add'; quantity: number }
  | { type: 'updateQty'; lineId: string; quantity: number }
  | { type: 'remove'; lineId: string };

function reduceCart(cart: Cart | null, action: OptimisticAction): Cart | null {
  if (!cart) return cart;
  switch (action.type) {
    case 'add':
      return { ...cart, totalQuantity: cart.totalQuantity + action.quantity };
    case 'updateQty': {
      const lines = cart.lines.map((l) =>
        l.id === action.lineId ? { ...l, quantity: action.quantity } : l,
      );
      return { ...cart, lines, totalQuantity: lines.reduce((n, l) => n + l.quantity, 0) };
    }
    case 'remove': {
      const lines = cart.lines.filter((l) => l.id !== action.lineId);
      return { ...cart, lines, totalQuantity: lines.reduce((n, l) => n + l.quantity, 0) };
    }
  }
}

export function CartProvider({
  children,
  initialCart,
}: {
  children: ReactNode;
  initialCart: Cart | null;
}) {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [optimisticCart, applyOptimistic] = useOptimistic(cart, reduceCart);
  const [isPending, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Run a mutation inside a transition: apply the optimistic patch, await the
  // Server Action, then commit the authoritative cart Shopify returns.
  const run = useCallback(
    (optimistic: OptimisticAction, action: () => Promise<Cart>) =>
      new Promise<void>((resolve, reject) => {
        setError(null);
        startTransition(async () => {
          try {
            applyOptimistic(optimistic);
            const updated = await action();
            setCart(updated);
            resolve();
          } catch (err) {
            setError((err as Error).message || 'Something went wrong with your cart.');
            reject(err);
          }
        });
      }),
    [applyOptimistic],
  );

  const addItem = useCallback(
    (variantId: string, quantity = 1) => {
      setDrawerOpen(true);
      return run({ type: 'add', quantity }, () => addToCartAction(variantId, quantity));
    },
    [run],
  );

  const updateItem = useCallback(
    (lineId: string, quantity: number) =>
      run({ type: 'updateQty', lineId, quantity }, () =>
        updateCartLineAction(lineId, quantity),
      ),
    [run],
  );

  const removeItem = useCallback(
    (lineId: string) =>
      run({ type: 'remove', lineId }, () => removeCartLineAction(lineId)),
    [run],
  );

  return (
    <CartContext.Provider
      value={{
        cart: optimisticCart,
        itemCount: optimisticCart?.totalQuantity ?? 0,
        isPending,
        error,
        drawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
