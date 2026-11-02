import type { Metadata } from "next";

import type { Project } from "@/content/projects";
import { locales, ogLocales, type Locale } from "@/i18n/config";
import { siteConfig } from "@/utils/site";

type PageMetadataInput = {
  lang: Locale;
  /** The page's path without the language, e.g. "" for home, "/work", "/work/herzog". */
  path: string;
  title: string;
  description: string;
  /** Describes the link-preview image (meta.ogAlt in the dictionaries). */
  imageAlt: string;
  /**
   * A page's own link-preview image, e.g. a project's screenshot ("/og/work/herzog.jpg",
   * 1200 × 630). Without it, the language's departures-board image is used.
   */
  image?: string;
};

/**
 * The page's addresses in every language (for hreflang links and the sitemap), plus
 * "x-default": the address without a language, which the proxy sends to the visitor's own.
 *
 * @example
 * languageAlternates("/work") // { en: "/en/work", de: "/de/work", fr: "/fr/work", "x-default": "/work" }
 */
export function languageAlternates(path: string): Record<Locale | "x-default", string> {
  return {
    ...(Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])) as Record<Locale, string>),
    "x-default": path || "/",
  };
}

/**
 * A project's link-preview image: its screenshot on the board background, 1200 × 630, made by
 * `node scripts/og-work.mjs` into public/og/work. Undefined for a project without a screenshot
 * (its page then shares the departures-board image).
 *
 * @example
 * projectOgImage(herzog) // "/og/work/herzog.jpg"
 */
export function projectOgImage(project: Pick<Project, "slug" | "image">): string | undefined {
  return project.image ? `/og/work/${project.slug}.jpg` : undefined;
}

/**
 * Everything search engines and link previews need for one page:
 * - title and description;
 * - canonical address and the same page in the other languages (hreflang);
 * - Open Graph and X/Twitter card with the language's departures-board image (1200 × 630).
 * Addresses are relative; the layout's metadataBase (siteConfig.url) makes them absolute.
 */
export function pageMetadata({
  lang,
  path,
  title,
  description,
  imageAlt,
  image: ownImage,
}: PageMetadataInput): Metadata {
  const url = `/${lang}${path}`;
  const image = { url: ownImage ?? `/og/${lang}.png`, width: 1200, height: 630, alt: imageAlt };
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title,
      description,
      locale: ogLocales[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocales[l]),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
