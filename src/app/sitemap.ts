import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { reports } from "@/content/reports/herzog";
import { locales } from "@/i18n/config";
import { languageAlternates } from "@/lib/seo/metadata";
import { siteConfig } from "@/utils/site";

/** Every page's path without the language. Add new pages here. */
export function sitemapPaths(): string[] {
  const reportPaths = projects
    .filter((p) => p.report && reports[p.slug])
    .map((p) => `/work/${p.slug}`);
  return ["", "/work", ...reportPaths, "/services", "/process", "/about", "/contact", "/legal"];
}

/**
 * /sitemap.xml: every page in every language, each listing its versions in the other
 * languages, so search engines show visitors the right one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (path: string) => `${siteConfig.url}${path}`;
  return sitemapPaths().flatMap((path) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([lang, url]) => [lang, absolute(url)]),
    );
    return locales.map((lang) => ({
      url: absolute(`/${lang}${path}`),
      alternates: { languages },
      priority: path === "" ? 1 : path === "/legal" ? 0.3 : 0.8,
    }));
  });
}
