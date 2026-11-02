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
    ],
  };
}

/**
 * The JSON text for a <script type="application/ld+json">, with "<" escaped so no text in it
 * can ever close the script tag early.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
