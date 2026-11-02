import { describe, expect, it } from "vitest";

import { hasLocale, localeFromPath } from "./config";

describe("hasLocale", () => {
  it("knows the site's languages only", () => {
    expect(hasLocale("fr")).toBe(true);
    expect(hasLocale("es")).toBe(false);
  });
});

describe("localeFromPath", () => {
  it("reads the language from the start of a path", () => {
    expect(localeFromPath("/fr/work/herzog")).toBe("fr");
    expect(localeFromPath("/de")).toBe("de");
  });

  it("falls back to English for other or missing paths", () => {
    expect(localeFromPath("/es/nowhere")).toBe("en");
    expect(localeFromPath("/")).toBe("en");
    expect(localeFromPath(null)).toBe("en");
  });
});
