import { describe, expect, it } from "vitest";

import { hasLocale, locales } from "./config";
import { routes } from "./routes";

describe("routes", () => {
  it("prefixes every address with the language", () => {
    for (const lang of locales) {
      for (const href of Object.values(routes(lang)))
        expect(href.startsWith(`/${lang}`)).toBe(true);
    }
  });

  it("uses the same page names in every language", () => {
    expect(routes("fr").contact).toBe("/fr/contact");
    expect(routes("de").work).toBe("/de/work");
    expect(routes("en").privacy).toBe("/en/legal#privacy");
  });
});

describe("hasLocale", () => {
  it("accepts the three site languages only", () => {
    expect(locales.every(hasLocale)).toBe(true);
    expect(hasLocale("es")).toBe(false);
    expect(hasLocale("EN")).toBe(false);
  });
});
