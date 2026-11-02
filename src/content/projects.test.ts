import { describe, expect, it } from "vitest";

import { locales } from "@/i18n/config";
import { missingGlyphs } from "@/lib/led";

import { featured, findProject, isLive, nextDeparture, projectHref, projects } from "./projects";
import { journeyShots, reports } from "./reports/herzog";

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
      for (const value of [p.year, p.route, p.code, p.status, p.languages, ...p.stack])
        expect(missingGlyphs(value), `${p.slug}: ${value}`).toEqual([]);
  });

  it("tell the story in every language when they have one", () => {
    for (const p of projects)
      if (p.story) for (const l of locales) expect(p.story[l], `${p.slug} ${l}`).not.toBe("");
  });

  it("list the stack of every finished project, and link only to GitHub for code", () => {
    for (const p of projects) {
      if (p.status === "LIVE") expect(p.stack.length, p.slug).toBeGreaterThan(0);
      if (p.repo) expect(p.repo).toMatch(/^https:\/\/github\.com\/fjkun06\//);
      expect(p.website).not.toMatch(/^https?:/);
    }
  });

  it("feature Herzog trad' with its website", () => {
    expect(featured.slug).toBe("herzog");
    expect(featured.website).toBe("herzog-translations.com");
  });
});

describe("pictures", () => {
  it("give every project a picture, so no card shows a placeholder", () => {
    for (const p of projects) expect(p.image, p.slug).not.toBeNull();
  });

  it("give every journey step of a report its phone screen", () => {
    for (const [slug, report] of Object.entries(reports))
      expect(journeyShots[slug]).toHaveLength(report.en.journey.length);
  });
});

describe("projectHref", () => {
  it("gives every project its own page", () => {
    for (const p of projects) expect(projectHref(p, "/fr/work")).toBe(`/fr/work/${p.slug}`);
  });
});

describe("isLive", () => {
  it("tells finished projects from ones still boarding or on hold", () => {
    expect(isLive(findProject("herzog")!)).toBe(true);
    expect(isLive(findProject("translatpro")!)).toBe(false);
    expect(isLive(findProject("brytzone")!)).toBe(false);
  });
});

describe("findProject", () => {
  it("finds a project by its address", () => {
    expect(findProject("digtal")?.name).toBe("DIGTAL");
    expect(findProject("nope")).toBeUndefined();
  });
});

describe("nextDeparture", () => {
  it("suggests the next live project, skipping ones in progress or on hold", () => {
    expect(nextDeparture(findProject("herzog")!).slug).toBe("first-trucks");
    expect(nextDeparture(findProject("digtal")!).slug).toBe("flippbidd");
  });

  it("wraps around at the end of the list", () => {
    expect(nextDeparture(findProject("flippbidd")!).slug).toBe("herzog");
  });
});

describe("summaries and reports", () => {
  it("summarise every project in every language", () => {
    for (const p of projects) for (const l of locales) expect(p.summary[l], p.slug).toBeTruthy();
  });

  it("have a report for every project that says it has one", () => {
    for (const p of projects.filter((p) => p.report)) expect(reports[p.slug], p.slug).toBeDefined();
  });
});
