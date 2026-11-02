/**
 * Proxy (formerly called "middleware" in Next.js): runs before every page request.
 * Its job is the language: a visit to "/" or "/work" is redirected to "/en", "/fr/work"…
 * based on the browser's preferred languages. Addresses that already start with a language
 * pass through, with the path added as a request header for the 404 page.
 */
import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, hasLocale, locales, PATH_HEADER, type Locale } from "@/i18n/config";

/**
 * Picks the visitor's language from the Accept-Language header the browser sends.
 * Each entry has an optional weight (q, 0 to 1); the highest-weighted language the site
 * supports wins. Regional variants count for their base language ("fr-CM" → "fr").
 * Falls back to English when nothing matches or the header is missing.
 *
 * @example
 * pickLocale("fr-CM,fr;q=0.9,en;q=0.8") // "fr"
 * pickLocale("es-ES,es;q=0.9")          // "en"
 */
export function pickLocale(header: string | null): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { base: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .filter((entry) => !Number.isNaN(entry.q))
    .sort((a, b) => b.q - a.q);
  const match = ranked.find((entry) => hasLocale(entry.base));
  return match ? (match.base as Locale) : defaultLocale;
}

/**
 * Sends every path without a language prefix to the visitor's language.
 * Uses a temporary redirect (307), because the target depends on the visitor.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasPrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasPrefix) {
    // Pass the path on to the page, so the 404 page knows its language (it gets no params).
    const headers = new Headers(request.headers);
    headers.set(PATH_HEADER, pathname);
    return NextResponse.next({ request: { headers } });
  }

  const locale = pickLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skip API routes, Next internals and any file with an extension (images, icons…).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
