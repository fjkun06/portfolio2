import { siteConfig } from "@/utils/site";
import type { Locale } from "@/i18n/config";

/**
 * Structured data for the home page (schema.org, as JSON-LD): who Frank is and what the site
 * is. Search engines use it for the knowledge panel and to connect the LinkedIn and GitHub
 * profiles to the site.
 */
export function homeJsonLd({
  lang,
  description,
  jobTitle,
  image,
}: {
  lang: Locale;
  description: string;
  jobTitle: string;
  /** Path of the portrait in /public, e.g. "/about/frank.webp" (a stable address). */
  image: string;
}) {
  const person = `${siteConfig.url}/#frank`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": person,
        name: siteConfig.name,
        url: siteConfig.url,
        image: new URL(image, siteConfig.url).href,
        jobTitle,
        knowsLanguage: ["en", "fr", "de"],
        address: { "@type": "PostalAddress", addressLocality: "Essen", addressCountry: "DE" },
        email: `mailto:${siteConfig.email}`,
        sameAs: [siteConfig.linkedin, siteConfig.github].filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        url: `${siteConfig.url}/${lang}`,
        inLanguage: lang,
        description,
        publisher: { "@id": person },
      },
      {
        // The freelance business behind the site, as a local service: Google uses it for
        // searches near Essen and to match the site with a Google Business Profile.
        // Only the city is given, never the street: Frank works from home, not a shop.
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#business`,
        name: siteConfig.name,
        url: siteConfig.url,
        image: new URL(image, siteConfig.url).href,
        description,
        email: `mailto:${siteConfig.email}`,
        ...(siteConfig.whatsapp ? { telephone: `+${siteConfig.whatsapp}` } : {}),
        address: { "@type": "PostalAddress", addressLocality: "Essen", addressCountry: "DE" },
        areaServed: [
          { "@type": "City", name: "Essen" },
          { "@type": "State", name: "Nordrhein-Westfalen" },
          { "@type": "Country", name: "Deutschland" },
        ],
        knowsLanguage: ["en", "fr", "de"],
        founder: { "@id": person },
        sameAs: [siteConfig.linkedin, siteConfig.github].filter(Boolean),
      },
    ],
  };
}

/** One step in a breadcrumb trail: its visible name and its path (with the language). */
export type Crumb = { name: string; path: string };

/**
 * Breadcrumb trail as structured data (schema.org BreadcrumbList). Google then shows the
 * page's place in the site under its search result ("frankjordan.dev › Work › Herzog trad'")
 * instead of the bare address.
 *
 * @example
 * breadcrumbJsonLd([{ name: "Home", path: "/en" }, { name: "Work", path: "/en/work" }])
 */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.path}`,
    })),
  };
}

/**
 * The JSON text for a <script type="application/ld+json">, with "<" escaped so no text in it
 * can ever close the script tag early.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
