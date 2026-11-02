import { describe, expect, it } from "vitest";

import { missingGlyphs } from "@/lib/led";

import de from "./de";
import en from "./en";
import fr from "./fr";

/** Every key path in a nested object, e.g. "nav.work", with array lengths. */
function shape(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) return [`${path}[${value.length}]`];
  if (value && typeof value === "object")
    return Object.entries(value).flatMap(([key, v]) => shape(v, path ? `${path}.${key}` : key));
  return [path];
}

/** Every text the site draws in LED dots. Add new LED texts here so they get checked. */
function ledLines(dict: typeof en): string[] {
  return [
    ...dict.footer.nextLed,
    ...dict.footer.nextLedShort,
    ...dict.home.hero.headline,
    ...dict.home.hero.headlineShort,
    dict.home.featured.tag,
    dict.home.captain.onDuty,
    ...dict.work.titleLed,
    dict.work.filters.all,
    `${dict.report.tag} FJ 001`,
  ];
}

const languages = { en, fr, de };

describe("locales", () => {
  it("have exactly the same keys in every language", () => {
    expect(shape(fr)).toEqual(shape(en));
    expect(shape(de)).toEqual(shape(en));
  });

  it("have no empty texts", () => {
    for (const [name, dict] of Object.entries(languages)) {
      const walk = (v: unknown, path: string) => {
        if (typeof v === "string") expect(v.trim(), `${name}: ${path}`).not.toBe("");
        else if (v && typeof v === "object")
          for (const [k, child] of Object.entries(v)) walk(child, `${path}.${k}`);
      };
      walk(dict, name);
    }
  });

  it("only use characters the LED lettering can draw in LED lines", () => {
    for (const [name, dict] of Object.entries(languages)) {
      for (const line of ledLines(dict))
        expect(missingGlyphs(line), `${name}: "${line}"`).toEqual([]);
    }
  });

  it("write LED lines in capitals", () => {
    for (const dict of Object.values(languages)) {
      for (const line of ledLines(dict)) expect(line).toBe(line.toUpperCase());
    }
  });
});
