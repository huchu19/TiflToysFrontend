import { COUNTRIES, DEFAULT_COUNTRY, type Country } from './country';

// Canonical site identity — used for metadataBase, sitemap, robots, OG tags.
// Override the URL per-environment with NEXT_PUBLIC_SITE_URL (see .env.example).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tifltoys.com').replace(
  /\/$/,
  '',
);

export const SITE_NAME = 'TiflToys';
export const SITE_DESCRIPTION =
  'Islamic educational toys for Muslim families in Canada — meaningful toys, games, and crafts for curious minds.';

// Shipping, per market. These MUST stay in sync with the Shopify shipping zones
// (Settings → Shipping and delivery → General profile), which is what actually
// charges at checkout: the "Ontario & Quebec" and "Rest of Canada" zones each
// carry a $4.50 Standard rate and a $0.00 rate at subtotal ≥ $40 CAD; the
// "US - Cross Border" zone carries a $10 USD rate and a $0.00 rate at ≥ $30 USD.
// Amounts are in the market's own currency (see COUNTRIES in lib/country).
export const SHIPPING: Record<
  Country,
  {
    freeThreshold: number;
    flatRate: number;
    /** Where the flat rate applies, for copy: "anywhere in Canada". */
    area: string;
    /** Delivery estimates by destination — one per Shopify zone, when known. */
    zones: readonly { region: string; estimate: string }[];
  }
> = {
  CA: {
    freeThreshold: 40,
    flatRate: 4.5,
    area: 'anywhere in Canada',
    zones: [
      { region: 'Ontario & Quebec', estimate: '2–3 business days' },
      { region: 'Rest of Canada', estimate: '7–10 business days' },
    ],
  },
  US: { freeThreshold: 30, flatRate: 10, area: 'anywhere in the US', zones: [] },
};

/**
 * Shipping money for copy: whole dollars stay short ("$40"), cents show
 * ("$4.50"). Non-Canadian amounts carry their currency ("$30 USD") so a US
 * dollar is never mistaken for a Canadian one.
 */
export function shippingMoney(amount: number, country: Country = DEFAULT_COUNTRY): string {
  const value = Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
  return country === DEFAULT_COUNTRY ? value : `${value} ${COUNTRIES[country].currency}`;
}

/**
 * Free-shipping nudge for a cart subtotal (in the cart's own currency): how
 * much more to spend, or a congratulation once the threshold is met. `null`
 * for an empty cart.
 */
export function freeShippingProgress(
  subtotal: number,
  country: Country,
): {
  qualified: boolean;
  remaining: number;
  /** Fraction of the way to free shipping, 0–1. */
  progress: number;
  message: string;
} | null {
  if (!Number.isFinite(subtotal) || subtotal <= 0) return null;
  const { freeThreshold } = SHIPPING[country];
  const remaining = freeThreshold - subtotal;
  const progress = Math.min(1, subtotal / freeThreshold);
  if (remaining <= 0) {
    return { qualified: true, remaining: 0, progress, message: 'Your order ships free 🎉' };
  }
  return {
    qualified: false,
    remaining,
    progress,
    message: `You're ${shippingMoney(Number(remaining.toFixed(2)), country)} away from free shipping`,
  };
}
