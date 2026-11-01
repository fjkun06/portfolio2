import type { Locale } from "./config";

/** Every page's address in one language. Pages that don't exist yet still get their final address. */
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

export type Routes = ReturnType<typeof routes>;
