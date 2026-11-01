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

/** Open Graph locale codes. */
export const ogLocales: Record<Locale, string> = {
  en: "en_GB",
  de: "de_DE",
  fr: "fr_FR",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
