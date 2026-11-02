import { describe, expect, it } from "vitest";

import { locales } from "@/i18n/config";
import { missingGlyphs } from "@/lib/led";

import { aboutContent } from "./about";
import { contactContent } from "./contact";
import { processContent } from "./process";
import { findProject } from "./projects";
import { servicesContent } from "./services";

/** Every key path in a nested value, going into arrays too, e.g. "services.0.included[4]". */
function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value))
    return [`${path}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${path}.${i}`))];
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([key, v]) => shape(v, path ? `${path}.${key}` : key));
  return [path];
}

/** Fails with the path of every empty string. */
function expectNoEmptyTexts(value: unknown, path: string) {
  if (typeof value === "string") expect(value.trim(), path).not.toBe("");
  else if (value && typeof value === "object")
    for (const [k, child] of Object.entries(value)) expectNoEmptyTexts(child, `${path}.${k}`);
}

/** Every text the Services page draws in LED dots. */
function servicesLed(lang: (typeof locales)[number]): string[] {
  const t = servicesContent[lang];
  return [
    ...t.titleLed,
    t.included,
    t.fares.sign,
    ...t.services.map((s) => `${t.routeTag} ${s.code}`),
    ...t.always.items.map((i) => i.code),
    ...t.faq.items.map((_, i) => `Q${i + 1}`),
  ];
}

/** Every text the Process page draws in LED dots. */
function processLed(lang: (typeof locales)[number]): string[] {
  const t = processContent[lang];
  return [
    ...t.titleLed,
    t.you,
    t.me,
    ...t.stats.map(([, value]) => value),
    ...t.stops.map((s) => s.name),
    ...t.stops.map((_, i) => `${t.stopTag} 0${i + 1}`),
    ...t.after.items.map((i) => i.code),
  ];
}

/** Every text the About page (and the home page's flight log) draws in LED dots. */
function aboutLed(lang: (typeof locales)[number]): string[] {
  const t = aboutContent[lang];
  return [
    ...t.titleLed,
    ...t.badges,
    t.log.count.replace("{n}", "5"),
    ...t.log.entries.map((e) => e.year),
  ];
}

/** Every text the Contact page draws in LED dots. */
function contactLed(lang: (typeof locales)[number]): string[] {
  const t = contactContent[lang];
  return [...t.titleLed, ...t.status.map(([, value]) => value)];
}

describe.each([
  ["services", servicesContent, servicesLed],
  ["process", processContent, processLed],
  ["about", aboutContent, aboutLed],
  ["contact", contactContent, contactLed],
] as const)("%s content", (_, content, led) => {
  it("has the same structure in every language", () => {
    for (const lang of locales) expect(shape(content[lang]), lang).toEqual(shape(content.en));
  });

  it("has no empty texts", () => {
    for (const lang of locales) expectNoEmptyTexts(content[lang], lang);
  });

  it("only puts drawable capitals in LED texts", () => {
    for (const lang of locales) {
      for (const line of led(lang)) {
        expect(missingGlyphs(line), `${lang}: "${line}"`).toEqual([]);
        expect(line, lang).toBe(line.toUpperCase());
      }
    }
  });
});

describe("services content", () => {
  it("uses the same route codes, in the same order, in every language", () => {
    const codes = servicesContent.en.services.map((s) => s.code);
    expect(codes).toEqual(["MLT", "ORD", "LND", "RBD"]);
    for (const lang of locales)
      expect(servicesContent[lang].services.map((s) => s.code)).toEqual(codes);
  });

  it("only links examples to projects that exist", () => {
    for (const lang of locales) {
      for (const s of servicesContent[lang].services)
        if (s.example) expect(findProject(s.example), s.example).toBeDefined();
    }
  });

  it('gives every "on every flight" tile its own code', () => {
    for (const lang of locales) {
      const t = servicesContent[lang];
      expect(new Set(t.always.items.map((i) => i.code)).size).toBe(t.always.items.length);
    }
  });
});

describe("process content", () => {
  it("has four stops, like the cockpit's /04", () => {
    for (const lang of locales) expect(processContent[lang].stops).toHaveLength(4);
  });
});

describe("about content", () => {
  it("keeps the same flight log years in every language, except the first (now)", () => {
    const years = (lang: (typeof locales)[number]) =>
      aboutContent[lang].log.entries.slice(1).map((e) => e.year);
    for (const lang of locales) expect(years(lang)).toEqual(years("en"));
  });
});
