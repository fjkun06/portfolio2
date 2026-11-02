import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { locales } from "@/i18n/config";
import { languageAlternates } from "@/lib/seo/metadata";
import { siteConfig } from "@/utils/site";

/** Every page's path without the language. Add new pages here. */
export function sitemapPaths(): string[] {
  const projectPaths = projects.map((p) => `/work/${p.slug}`);
  return ["", "/work", ...projectPaths, "/services", "/process", "/about", "/contact", "/legal"];
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
