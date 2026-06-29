import type { Metadata } from 'next';
import CartView from '@/components/cart/CartView';

export const metadata: Metadata = {
  title: 'Your cart',
  description: 'Review the meaningful toys in your cart before checkout.',
  robots: { index: false },
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <h1 className="font-fredoka text-4xl font-bold text-brand-purple">Your cart</h1>
      <div className="mt-10">
        <CartView />
      </div>
    </main>
  );
}
