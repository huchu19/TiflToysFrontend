import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Truck } from 'lucide-react';
import { getAllProductCards, getProductPage, formatPrice } from '@/lib/shopify';
import {
  SITE_URL,
  SITE_NAME,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT_RATE,
  SHIPPING_ZONES,
} from '@/lib/site';
import { Stars } from '@/components/ui/Stars';
import ProductGallery from './ProductGallery';
import AddToCart from './AddToCart';

// Pre-render a page for every product; new products still render on demand and
// revalidate via the fetch cache (ISR). Fail soft if Shopify is unreachable.
export async function generateStaticParams() {
  try {
    const products = await getAllProductCards(100);
    return products.map((p) => ({ handle: p.handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductPage(handle);
  if (!product) return { title: 'Product not found' };
  const description =
    product.description.slice(0, 160) ||
    `${product.title} — meaningful Islamic educational toys from ${SITE_NAME}.`;
  const url = `${SITE_URL}/products/${product.handle}`;
  const image = product.images[0]?.src;
  return {
    title: product.title,
    description,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      type: 'website',
      title: product.title,
      description,
      url,
      ...(image ? { images: [{ url: image, alt: product.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductPage(handle);
  if (!product) notFound();

  // Product structured data for rich results. Offers reflect per-variant price
  // and live availability.
  const anyAvailable = product.variants.some((v) => v.available);
  const availability = product.preorder
    ? 'https://schema.org/PreOrder'
    : anyAvailable
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.src),
    brand: { '@type': 'Brand', name: SITE_NAME },
    url: `${SITE_URL}/products/${product.handle}`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: product.currencyCode,
      lowPrice: product.amount,
      offerCount: product.variants.length,
      availability,
    },
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-purple"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start">
        <ProductGallery images={product.images} title={product.title} />

        <div>
          <h1 className="font-fredoka text-4xl font-bold text-brand-purple">{product.title}</h1>

          <div className="mt-3 flex items-center gap-2 text-brand-orange">
            <Stars value={4.5} size={18} />
            <span className="text-sm font-medium text-gray-500">4.5 (120)</span>
          </div>

          <p className="mt-4 font-fredoka text-3xl font-bold text-gray-800">
            {formatPrice(product.amount)}
          </p>

          {product.descriptionHtml ? (
            <div
              className="prose prose-sm mt-6 max-w-none leading-relaxed text-gray-600"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : (
            <p className="mt-6 leading-relaxed text-gray-600">{product.description}</p>
          )}

          {product.preorder && (
            <p className="mt-4 rounded-xl bg-bg-yellow/60 px-4 py-3 text-sm leading-relaxed text-gray-700">
              This is a <span className="font-semibold text-brand-purple">pre-order</span> item. Order now and
              we&apos;ll ship it to you in Fall 2026.
            </p>
          )}

          <AddToCart variants={product.variants} preorder={product.preorder} />

          <div className="mt-6 flex items-start gap-3 border-t border-gray-100 pt-5 text-sm text-gray-600">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" aria-hidden />
            <p className="leading-relaxed">
              <span className="font-semibold text-brand-purple">
                Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}
              </span>{' '}
              — otherwise a flat ${SHIPPING_FLAT_RATE} anywhere in Canada.{' '}
              {SHIPPING_ZONES.map((z) => `${z.region}: ${z.estimate}`).join(' · ')}.{' '}
              <Link href="/refunds" className="font-medium text-brand-purple hover:underline">
                Shipping policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
