import type { Locale } from "./config";
import type { Dictionary } from "@/locales/en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/locales/en").then((m) => m.default),
  de: () => import("@/locales/de").then((m) => m.default),
  fr: () => import("@/locales/fr").then((m) => m.default),
};

/** Loads one language's texts on the server; nothing extra ships to the browser. */
export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
