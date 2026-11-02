import { headers } from "next/headers";

import "./globals.css";

import { NotFoundView } from "@/components/not-found/NotFoundView";
import { SiteDocument } from "@/components/site/SiteDocument";
import { localeFromPath, PATH_HEADER } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Rendered per request (it needs the visited path for the language), not prerendered:
 * a 404 page doesn't need to be instant.
 */
export const instant = false;

/** The visitor's language, read from the path the proxy passes on (/fr/… → French). */
async function currentLocale() {
  return localeFromPath((await headers()).get(PATH_HEADER));
}

/**
 * The 404 page for addresses that match no route at all (/en/nowhere, /fr/work/x/y…).
 * Next.js sends it directly with a 404 status, without any layout, so it brings the whole
 * document itself (SiteDocument: header, footer, fonts) in the visitor's language.
 */
export default async function GlobalNotFound() {
  const lang = await currentLocale();
  const dict = await getDictionary(lang);
  return (
    <SiteDocument lang={lang} dict={dict}>
      <NotFoundView lang={lang} />
    </SiteDocument>
  );
}
