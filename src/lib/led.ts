/**
 * FJ Matrix: the site's own 5 × 7 LED lettering, as data.
 *
 * Every character is a grid of 7 rows × 5 columns of dots. Each glyph below is written as seven
 * groups of five digits, top row first: "1" is a lit dot, "0" an unlit one. For example "F":
 *
 *   11111   ●●●●●
 *   10000   ●
 *   10000   ●
 *   11110   ●●●●
 *   10000   ●
 *   10000   ●
 *   10000   ●
 *
 * This file only does the maths (which dots are lit, how wide a text is).
 * Drawing happens in `src/components/Led.tsx`.
 *
 * To support a new character, add a line here. Lowercase letters fall back to their capital,
 * and anything without a glyph is drawn as "?" (the locale tests catch that).
 */
export const GLYPHS: Record<string, string> = {
  A: "01110 10001 10001 11111 10001 10001 10001",
  B: "11110 10001 10001 11110 10001 10001 11110",
  C: "01110 10001 10000 10000 10000 10001 01110",
  D: "11100 10010 10001 10001 10001 10010 11100",
  E: "11111 10000 10000 11110 10000 10000 11111",
  F: "11111 10000 10000 11110 10000 10000 10000",
  G: "01110 10001 10000 10111 10001 10001 01111",
  H: "10001 10001 10001 11111 10001 10001 10001",
  I: "01110 00100 00100 00100 00100 00100 01110",
  J: "00111 00010 00010 00010 00010 10010 01100",
  K: "10001 10010 10100 11000 10100 10010 10001",
  L: "10000 10000 10000 10000 10000 10000 11111",
  M: "10001 11011 10101 10101 10001 10001 10001",
  N: "10001 10001 11001 10101 10011 10001 10001",
  O: "01110 10001 10001 10001 10001 10001 01110",
  P: "11110 10001 10001 11110 10000 10000 10000",
  Q: "01110 10001 10001 10001 10101 10010 01101",
  R: "11110 10001 10001 11110 10100 10010 10001",
  S: "01111 10000 10000 01110 00001 00001 11110",
  T: "11111 00100 00100 00100 00100 00100 00100",
  U: "10001 10001 10001 10001 10001 10001 01110",
  V: "10001 10001 10001 10001 10001 01010 00100",
  W: "10001 10001 10001 10101 10101 10101 01010",
  X: "10001 10001 01010 00100 01010 10001 10001",
  Y: "10001 10001 10001 01010 00100 00100 00100",
  Z: "11111 00001 00010 00100 01000 10000 11111",
  "0": "01110 10001 10011 10101 11001 10001 01110",
  "1": "00100 01100 00100 00100 00100 00100 01110",
  "2": "01110 10001 00001 00010 00100 01000 11111",
  "3": "11111 00010 00100 00010 00001 10001 01110",
  "4": "00010 00110 01010 10010 11111 00010 00010",
  "5": "11111 10000 11110 00001 00001 10001 01110",
  "6": "00110 01000 10000 11110 10001 10001 01110",
  "7": "11111 00001 00010 00100 01000 01000 01000",
  "8": "01110 10001 10001 01110 10001 10001 01110",
  "9": "01110 10001 10001 01111 00001 00010 01100",
  ".": "00000 00000 00000 00000 00000 01100 01100",
  ",": "00000 00000 00000 00000 01100 00100 01000",
  "’": "01100 00100 01000 00000 00000 00000 00000",
  "'": "01100 00100 01000 00000 00000 00000 00000",
  ":": "00000 01100 01100 00000 01100 01100 00000",
  "-": "00000 00000 00000 11111 00000 00000 00000",
  "⇄": "00010 11111 00010 00000 01000 11111 01000",
  "→": "00000 00100 00010 11111 00010 00100 00000",
  "/": "00001 00010 00010 00100 01000 01000 10000",
  "?": "01110 10001 00001 00010 00100 00000 00100",
  "!": "00100 00100 00100 00100 00100 00000 00100",
  É: "00010 11111 10000 11110 10000 10000 11111",
  Ü: "01010 00000 10001 10001 10001 10001 01110",
  Ä: "01010 00000 01110 10001 11111 10001 10001",
  Ö: "01010 00000 01110 10001 10001 10001 01110",
  Ç: "01110 10001 10000 10000 10001 01110 00100",
  È: "01000 11111 10000 11110 10000 10000 11111",
  À: "01000 00100 01110 10001 11111 10001 10001",
  "&": "01100 10010 10100 01000 10101 10010 01101",
  "+": "00000 00100 00100 11111 00100 00100 00000",
  "·": "00000 00000 00000 01100 01100 00000 00000",
  "↑": "00100 01110 10101 00100 00100 00100 00100",
};

/** A space is three dot columns wide. */
const SPACE_COLS = 3;
/** Each character takes its five columns plus one empty column before the next character. */
const ADVANCE = 6;

/** One column of lit dots: its horizontal position (in dot columns) and which rows (0–6) are lit. */
export type LedColumn = { x: number; rows: number[] };

/**
 * Works out which dots a text lights up.
 *
 * @param text The text to draw. Use capitals; lowercase is drawn as capitals.
 * @returns `columns`: only the columns that have at least one lit dot (empty columns are skipped,
 *   which keeps the SVG small), `width`: the total width in dot columns, without the trailing gap,
 *   and `chars`: the same columns grouped per character (spaces left out), for per-letter effects.
 *
 * @example
 * layoutLed("FJ").width // 11: five columns for F, one gap, five for J
 */
export function layoutLed(text: string): {
  columns: LedColumn[];
  width: number;
  chars: LedColumn[][];
} {
  const columns: LedColumn[] = [];
  const chars: LedColumn[][] = [];
  let x = 0;
  for (const raw of text) {
    if (raw === " ") {
      x += SPACE_COLS;
      continue;
    }
    const glyph = GLYPHS[raw] ?? GLYPHS[raw.toUpperCase()] ?? GLYPHS["?"];
    const rows = glyph.split(" ");
    const char: LedColumn[] = [];
    for (let c = 0; c < 5; c++) {
      const lit: number[] = [];
      for (let r = 0; r < 7; r++) if (rows[r][c] === "1") lit.push(r);
      if (lit.length) char.push({ x: x + c, rows: lit });
    }
    columns.push(...char);
    chars.push(char);
    x += ADVANCE;
  }
  return { columns, width: Math.max(x - 1, 1), chars };
}

/**
 * Width in pixels of a text at a given dot pitch (distance between dot centres).
 *
 * @example
 * ledWidth("FJ", 6) // 66
 */
export function ledWidth(text: string, pitch: number): number {
  return layoutLed(text).width * pitch;
}

/**
 * Characters in a text that have no glyph and would be drawn as "?".
 * Spaces and lowercase letters with a capital glyph are fine.
 *
 * @example
 * missingGlyphs("HELLO <3") // ["<"]
 */
export function missingGlyphs(text: string): string[] {
  const missing = new Set<string>();
  for (const char of text) {
    if (char === " ") continue;
    if (!(char in GLYPHS) && !(char.toUpperCase() in GLYPHS)) missing.add(char);
  }
  return [...missing];
}
