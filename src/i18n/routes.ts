import type { Locale } from "./config";

/**
 * Every page's address in one language, so no component writes `/${lang}/…` by hand.
 * Pages that don't exist yet already get their final address.
 *
 * @example
 * routes("fr").contact // "/fr/contact"
 */
export function routes(lang: Locale) {
  return {
    home: `/${lang}`,
    work: `/${lang}/work`,
    services: `/${lang}/services`,
    process: `/${lang}/process`,
    about: `/${lang}/about`,
    contact: `/${lang}/contact`,
    legal: `/${lang}/legal`,
    privacy: `/${lang}/legal#privacy`,
  };
}

/** The object `routes()` returns, for typing props. */
export type Routes = ReturnType<typeof routes>;
