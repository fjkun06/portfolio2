import { describe, expect, it } from "vitest";

import { missingGlyphs } from "@/lib/led";

import { herzogReport } from "./herzog";

const languages = Object.entries(herzogReport);

describe("Herzog trad' flight report", () => {
  it("tells the same story in every language: 4 journey steps, 6 manifest entries", () => {
    for (const [lang, r] of languages) {
      expect(r.journey, lang).toHaveLength(4);
      expect(r.manifest, lang).toHaveLength(6);
    }
  });

  it("uses the same manifest codes in every language", () => {
    const codes = herzogReport.en.manifest.map((m) => m.code);
    for (const [, r] of languages) expect(r.manifest.map((m) => m.code)).toEqual(codes);
  });

  it("only puts drawable characters in its LED texts", () => {
    for (const [lang, r] of languages)
      for (const text of [...r.manifest.map((m) => m.code), r.delivered])
        expect(missingGlyphs(text), `${lang}: ${text}`).toEqual([]);
  });

  it("gives every text a value, except an optional quote", () => {
    for (const [lang, r] of languages) {
      for (const key of [
        "intro",
        "client",
        "lead",
        "clientText",
        "goalText",
        "journeyIntro",
      ] as const)
        expect(r[key], `${lang}.${key}`).toBeTruthy();
      expect(Boolean(r.quote)).toBe(Boolean(r.quoteBy));
    }
  });
});
