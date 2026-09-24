import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { StickerProvider } from '@/context/StickerContext';
import { getCurrentCart } from '@/components/cart/actions';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { PageTransition } from '@/components/motion/PageTransition';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

const DEFAULT_TITLE = `${SITE_NAME} — Meaningful toys for curious minds`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Seed the client cart from the cart-id cookie so it persists across reloads.
  const initialCart = await getCurrentCart();

  return (
    <html lang="en">
      <body>
        <StickerProvider>
          <CartProvider initialCart={initialCart}>
            <Navbar />
            <PageTransition>{children}</PageTransition>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </StickerProvider>
      </body>
    </html>
  );
}
