import { describe, expect, it } from "vitest";

import { GLYPHS, layoutLed, ledWidth, missingGlyphs } from "./led";

describe("GLYPHS", () => {
  it("defines every glyph as 7 rows of 5 dots made of 0 and 1", () => {
    for (const [char, glyph] of Object.entries(GLYPHS)) {
      const rows = glyph.split(" ");
      expect(rows, `glyph "${char}"`).toHaveLength(7);
      for (const row of rows) expect(row, `glyph "${char}"`).toMatch(/^[01]{5}$/);
    }
  });

  it("covers the full alphabet and all digits", () => {
    for (const char of "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") expect(GLYPHS).toHaveProperty(char);
  });
});

describe("layoutLed", () => {
  it("gives one character a width of 5 columns", () => {
    expect(layoutLed("F").width).toBe(5);
  });

  it("adds a one-column gap between characters", () => {
    expect(layoutLed("FJ").width).toBe(11);
  });

  it("makes a space 3 columns wide", () => {
    // F (5) + gap (1) + space (3) + J (5) = 14
    expect(layoutLed("F J").width).toBe(14);
  });

  it("lists only columns that have lit dots, with the right rows", () => {
    const { columns } = layoutLed("I"); // 01110 / 00100 ×5 / 01110
    expect(columns.map((c) => c.x)).toEqual([1, 2, 3]);
    expect(columns[1].rows).toEqual([0, 1, 2, 3, 4, 5, 6]); // the full middle stroke
    expect(columns[0].rows).toEqual([0, 6]); // the serifs
  });

  it("groups the columns per character, leaving spaces out", () => {
    const { columns, chars } = layoutLed("I I");
    expect(chars).toHaveLength(2);
    expect(chars.flat()).toEqual(columns);
    expect(chars[1].map((c) => c.x)).toEqual([10, 11, 12]); // after "I" (6) and a space (3)
  });

  it("draws lowercase letters as capitals", () => {
    expect(layoutLed("fj")).toEqual(layoutLed("FJ"));
  });

  it("draws unknown characters as a question mark", () => {
    expect(layoutLed("<")).toEqual(layoutLed("?"));
  });

  it("returns a width of at least 1 for an empty text", () => {
    expect(layoutLed("").width).toBe(1);
  });
});

describe("ledWidth", () => {
  it("multiplies the column width by the pitch", () => {
    expect(ledWidth("FJ", 6)).toBe(66);
  });
});

describe("missingGlyphs", () => {
  it("finds characters that can't be drawn", () => {
    expect(missingGlyphs("HELLO <3")).toEqual(["<"]);
  });

  it("accepts spaces, lowercase and accented capitals that exist", () => {
    expect(missingGlyphs("Départ: ÄÖÜ")).toEqual([]);
  });
});
