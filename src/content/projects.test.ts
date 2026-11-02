import { describe, expect, it } from "vitest";

import { locales } from "@/i18n/config";
import { missingGlyphs } from "@/lib/led";

import { featured, projects } from "./projects";

describe("projects", () => {
  it("have unique addresses and flight numbers", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.code)).size).toBe(projects.length);
  });

  it("use address-safe slugs", () => {
    for (const p of projects) expect(p.slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("describe the client in every language", () => {
    for (const p of projects) for (const l of locales) expect(p.client[l], p.slug).toBeTruthy();
  });

  it("only use drawable characters in the LED fields", () => {
    for (const p of projects)
      for (const value of [p.year, p.route, p.code, p.status])
        expect(missingGlyphs(value), `${p.slug}: ${value}`).toEqual([]);
  });

  it("feature Herzog trad' with its website", () => {
    expect(featured.slug).toBe("herzog");
    expect(featured.website).toBe("herzog-translations.com");
  });
});
