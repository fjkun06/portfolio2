import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap, { sitemapPaths } from "@/app/sitemap";
import { projects } from "@/content/projects";
import { locales } from "@/i18n/config";
import { siteConfig } from "@/utils/site";

import { breadcrumbJsonLd, homeJsonLd, jsonLdScript } from "./json-ld";
import { languageAlternates, pageMetadata, projectOgImage } from "./metadata";

describe("languageAlternates", () => {
  it("lists the page in every language, plus the address without a language", () => {
    expect(languageAlternates("/work")).toEqual({
      en: "/en/work",
      de: "/de/work",
      fr: "/fr/work",
      "x-default": "/work",
    });
    expect(languageAlternates("")["x-default"]).toBe("/");
  });
});

describe("pageMetadata", () => {
  const meta = pageMetadata({
    lang: "fr",
    path: "/services",
    title: "Services · Frank Jordan",
    description: "Sites multilingues.",
    imageAlt: "Tableau des départs",
  });

  it("points the canonical address at this language's page", () => {
    expect(meta.alternates?.canonical).toBe("/fr/services");
    expect(meta.alternates?.languages).toMatchObject({ en: "/en/services", de: "/de/services" });
  });

  it("uses the language's own link-preview image and locale", () => {
    expect(meta.openGraph).toMatchObject({
      url: "/fr/services",
      locale: "fr_FR",
      alternateLocale: ["en_GB", "de_DE"],
      images: [{ url: "/og/fr.png", width: 1200, height: 630, alt: "Tableau des départs" }],
    });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });
});

describe("sitemap", () => {
  it("has every page in every language, with absolute addresses", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(sitemapPaths().length * locales.length);
    expect(entries.map((e) => e.url)).toContain(`${siteConfig.url}/de/work/herzog`);
    expect(entries.map((e) => e.url)).toContain(`${siteConfig.url}/fr/work/translatpro`);
    for (const e of entries) expect(e.url.startsWith(`${siteConfig.url}/`)).toBe(true);
  });

  it("links each entry to its versions in the other languages", () => {
    const about = sitemap().find((e) => e.url === `${siteConfig.url}/en/about`);
    expect(about?.alternates?.languages).toMatchObject({
      fr: `${siteConfig.url}/fr/about`,
      "x-default": `${siteConfig.url}/about`,
    });
  });
});

describe("robots", () => {
  it("allows everything and points to the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${siteConfig.url}/sitemap.xml`,
    });
  });
});

describe("homeJsonLd", () => {
  const data = homeJsonLd({
    lang: "de",
    description: "Websites",
    jobTitle: "Frontend-Entwickler",
    image: "/about/frank.webp",
  });

  it("describes Frank with his profiles and the site in the page's language", () => {
    const [person, website] = data["@graph"];
    expect(person).toMatchObject({
      "@type": "Person",
      jobTitle: "Frontend-Entwickler",
      image: `${siteConfig.url}/about/frank.webp`,
      sameAs: [siteConfig.linkedin, siteConfig.github],
    });
    expect(website).toMatchObject({
      "@type": "WebSite",
      inLanguage: "de",
      url: `${siteConfig.url}/de`,
    });
  });

  it("describes the business as a local service in Essen, without a street address", () => {
    const business = data["@graph"].find((node) => node["@type"] === "ProfessionalService");
    expect(business).toMatchObject({
      url: siteConfig.url,
      address: { addressLocality: "Essen", addressCountry: "DE" },
      knowsLanguage: ["en", "fr", "de"],
      founder: { "@id": `${siteConfig.url}/#frank` },
    });
    expect(JSON.stringify(business)).not.toContain(siteConfig.owner.street);
  });
});

describe("breadcrumbJsonLd", () => {
  it("numbers the steps and makes their addresses absolute", () => {
    const data = breadcrumbJsonLd([
      { name: "Home", path: "/en" },
      { name: "All departures", path: "/en/work" },
      { name: "Herzog trad’", path: "/en/work/herzog" },
    ]);
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement.map((item) => [item.position, item.item])).toEqual([
      [1, `${siteConfig.url}/en`],
      [2, `${siteConfig.url}/en/work`],
      [3, `${siteConfig.url}/en/work/herzog`],
    ]);
  });
});

describe("project link-preview images", () => {
  it("point to the project's own image, which exists for every project with a screenshot", () => {
    for (const project of projects.filter((p) => p.image)) {
      const image = projectOgImage(project);
      expect(image).toBe(`/og/work/${project.slug}.jpg`);
      expect(existsSync(join(process.cwd(), "public", image!)), image).toBe(true);
    }
  });

  it("are used by pageMetadata instead of the language's image", () => {
    const meta = pageMetadata({
      lang: "en",
      path: "/work/herzog",
      title: "Herzog",
      description: "Case study",
      imageAlt: "Homepage of Herzog",
      image: "/og/work/herzog.jpg",
    });
    expect(meta.openGraph?.images).toEqual([
      { url: "/og/work/herzog.jpg", width: 1200, height: 630, alt: "Homepage of Herzog" },
    ]);
  });
});

describe("jsonLdScript", () => {
  it("escapes < so the data can never close its script tag", () => {
    const text = jsonLdScript({ name: "</script><script>alert(1)</script>" });
    expect(text).not.toContain("<");
    expect(JSON.parse(text).name).toBe("</script><script>alert(1)</script>");
  });
});

describe("brand images", () => {
  it("exist for every language and icon size the metadata points to", () => {
    const files = [
      ...locales.map((l) => `public/og/${l}.png`),
      "public/icons/icon-192.png",
      "public/icons/icon-512.png",
      "public/about/frank.webp",
      "src/app/icon.svg",
      "src/app/apple-icon.png",
      "src/app/favicon.ico",
    ];
    for (const file of files) expect(existsSync(join(process.cwd(), file)), file).toBe(true);
  });
});
