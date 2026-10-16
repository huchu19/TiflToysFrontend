import { NextResponse, type NextRequest } from 'next/server';
import { COUNTRY_COOKIE, COUNTRY_COOKIE_MAX_AGE, isCountry } from '@/lib/country';

/**
 * `?country=US` / `?country=CA` on any page pins the visitor's market — handy
 * for testing (local dev has no Vercel geolocation) and for ads aimed at one
 * country. Saves the pick like the header switcher does, then redirects to the
 * same URL without the parameter. Only runs when the parameter is present.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const requested = url.searchParams.get('country')?.toUpperCase();
  url.searchParams.delete('country');

  const response = NextResponse.redirect(url);
  if (isCountry(requested)) {
    response.cookies.set(COUNTRY_COOKIE, requested, {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: COUNTRY_COOKIE_MAX_AGE,
    });
  }
  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/|api/|.*\\..*).*)',
      has: [{ type: 'query', key: 'country' }],
    },
  ],
};
