/**
 * Loads the texts of one language. Each language file is only imported when it's needed,
 * and only on the server, so the browser never downloads texts it doesn't show.
 */
import type { Locale } from "./config";
import type { Dictionary } from "@/locales/en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/locales/en").then((m) => m.default),
  de: () => import("@/locales/de").then((m) => m.default),
  fr: () => import("@/locales/fr").then((m) => m.default),
};

/**
 * All texts for one language. Use it in pages and server components:
 *
 * @example
 * const dict = await getDictionary(lang);
 * dict.nav.work // "Work", "Projekte" or "Projets"
 */
export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
