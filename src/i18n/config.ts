/**
 * Language settings shared by the whole site: which languages exist and how they are named.
 * Every page lives under its language: /en/…, /de/…, /fr/….
 */

/** Languages the site is published in. English first: the audience is worldwide. */
export const locales = ["en", "de", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Each language's own name, shown in the switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
};

/** Open Graph locale codes, used in link previews (added in the SEO step). */
export const ogLocales: Record<Locale, string> = {
  en: "en_GB",
  de: "de_DE",
  fr: "fr_FR",
};

/**
 * True when a URL segment is one of the site's languages.
 * Also tells TypeScript that the value is a `Locale` from then on.
 *
 * @example
 * hasLocale("fr") // true
 * hasLocale("es") // false
 */
export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Request header in which the proxy passes the visited path on (read by the 404 page). */
export const PATH_HEADER = "x-pathname";

/**
 * The language a path starts with, or the default language when it starts with none.
 *
 * @example
 * localeFromPath("/fr/work/herzog") // "fr"
 * localeFromPath("/nowhere")        // "en"
 */
export function localeFromPath(pathname: string | null): Locale {
  const first = (pathname ?? "").split("/")[1] ?? "";
  return hasLocale(first) ? first : defaultLocale;
}
