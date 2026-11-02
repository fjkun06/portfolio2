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
