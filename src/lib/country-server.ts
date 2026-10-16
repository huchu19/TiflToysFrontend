import { cookies, headers } from 'next/headers';
import { COUNTRY_COOKIE, DEFAULT_COUNTRY, isCountry, type Country } from './country';

// Search crawlers mostly crawl from the US; always show them the home (Canadian)
// store so search results carry CAD prices.
const CRAWLER = /bot|crawler|spider|slurp|facebookexternalhit|bingpreview/i;

/**
 * The visitor's market for this request: their switcher pick (cookie) wins,
 * then the country Vercel geolocates from their IP, then Canada. Server-only
 * (reads request cookies/headers).
 */
export async function getCountry(): Promise<Country> {
  const saved = (await cookies()).get(COUNTRY_COOKIE)?.value;
  if (isCountry(saved)) return saved;

  const h = await headers();
  if (CRAWLER.test(h.get('user-agent') ?? '')) return DEFAULT_COUNTRY;
  const geo = h.get('x-vercel-ip-country');
  return isCountry(geo) ? geo : DEFAULT_COUNTRY;
}
