// The two Shopify markets the store sells into. The visitor's country decides
// which market prices, cart currency and shipping terms they see. Safe to
// import from client and server code; the request-time lookup lives in
// `country-server.ts`.

export const COUNTRIES = {
  CA: { name: 'Canada', flag: '🇨🇦', currency: 'CAD' },
  US: { name: 'United States', flag: '🇺🇸', currency: 'USD' },
} as const;

export type Country = keyof typeof COUNTRIES;

/** Canada is the home market, and the fallback for everyone else (Shopify only
 *  ships to CA and US). */
export const DEFAULT_COUNTRY: Country = 'CA';

/** Remembers the visitor's pick from the header switcher (or `?country=`). */
export const COUNTRY_COOKIE = 'tifl_country';
export const COUNTRY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function isCountry(value: unknown): value is Country {
  return typeof value === 'string' && value in COUNTRIES;
}
