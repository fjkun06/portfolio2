/**
 * <Led>: draws any text in the site's LED dot lettering, as an inline SVG.
 *
 * How it's drawn:
 * - The unlit dots are one repeating SVG <pattern> filling a rectangle (cheap, one element).
 * - The lit dots are drawn as a single <path>: each dot is a zero-length line with a round cap,
 *   which renders as a circle. A long headline is then one element instead of hundreds of
 *   <circle>s, which keeps pages light (the home page went from ~13,000 SVG nodes to ~1,000).
 *   With `animate`, there is one path per column, and each column switches on a few
 *   milliseconds after the previous one, so the text lights up from left to right.
 *   With `flip`, each letter is its own group, so it can turn on its own (and with `animate`
 *   too, its columns still light up one by one inside the group).
 * - Colours are CSS variables, so the same SVG follows dark and light mode with no re-render.
 *
 * It has no state and no hooks, so it works in both server and client components.
 *
 * @example
 * <Led text="NEXT DEPARTURE:" pitch={12} tone="white" />
 * <Led text="LIVE" pitch={4} label="Status: live" />
 */
import { layoutLed, type LedColumn } from "@/lib/led";

/**
 * Which colour the lit dots take. All follow dark and light mode:
 * - accent: the ice blue (a darker blue in light mode), for highlights
 * - white: main lettering (black in light mode)
 * - grey / dim: secondary and switched-off states
 * - ink: always black, for lettering on light cards
 */
export type LedTone = "accent" | "white" | "grey" | "dim" | "ink";

/** CSS variable behind each tone; the values live in globals.css. */
const FILL: Record<LedTone, string> = {
  accent: "var(--led)",
  white: "var(--led-white)",
  grey: "var(--led-grey)",
  dim: "var(--led-dim)",
  ink: "var(--ink)",
};

type LedProps = {
  /** The text to draw. Capitals, digits and the punctuation in src/lib/led.ts. */
  text: string;
  /** Distance between dot centres, in pixels. */
  pitch?: number;
  /** Colour of the lit dots. Default: accent. */
  tone?: LedTone;
  /** Draw the unlit dots behind the letters. */
  board?: boolean;
  /** Soft halo around lit dots (dark mode only; the variable is transparent in light mode). */
  glow?: boolean;
  /** Columns switch on one after another when the page loads. */
  animate?: boolean;
  /** With `animate`: milliseconds before the first column lights up. */
  delay?: number;
  /** With `animate`: milliseconds between two columns. */
  step?: number;
  /**
   * Letters keep turning over like a split-flap board, on a loop: one after another they turn to
   * face backwards, hold, and turn back. Works with or without `animate`.
   */
  flip?: boolean;
  /**
   * With `flip`: milliseconds before this text's first letter turns, so several lines can
   * continue one wave (see `flipDelays`).
   */
  flipDelay?: number;
  /** When set, the lettering is announced as an image with this text. Otherwise it is hidden from screen readers, so put the words in the page another way. */
  label?: string;
  /** Extra classes on the <svg>, e.g. "blink" or "lg:hidden". */
  className?: string;
  /** Extra inline styles on the <svg>, e.g. a fixed width. */
  style?: React.CSSProperties;
};

/**
 * Short stable id from a string. The unlit-dot pattern needs an id; the same text at the same
 * pitch always gets the same id, and two identical patterns sharing an id draw the same thing.
 */
function hash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** Rounds a coordinate to 2 decimals and drops trailing zeros, to keep paths short. */
const num = (n: number) => String(Math.round(n * 100) / 100);

/**
 * Path data for a set of dots: "M x y h0" per dot. Drawn with a round line cap as wide as the dot,
 * each zero-length segment shows as one filled circle.
 *
 * @example
 * dotsPath([{ x: 0, rows: [0, 1] }], 10) // "M5 5h0M5 15h0"
 */
export function dotsPath(columns: { x: number; rows: number[] }[], pitch: number): string {
  let d = "";
  for (const { x, rows } of columns)
    for (const row of rows) d += `M${num(x * pitch + pitch / 2)} ${num(row * pitch + pitch / 2)}h0`;
  return d;
}

/** With `flip`: milliseconds between two letters turning. */
export const FLIP_STEP = 70;

/**
 * `flipDelay` for each line of a multi-line sign, so one flip wave runs through all the lines
 * in order: a line starts turning right after the previous line's last letter.
 *
 * @example
 * flipDelays(["AB", "C D"]) // [0, 140]
 */
export function flipDelays(lines: readonly string[]): number[] {
  let letters = 0;
  return lines.map((line) => {
    const start = letters * FLIP_STEP;
    letters += line.replace(/ /g, "").length;
    return start;
  });
}

/** Text drawn in LED dots, as an SVG. See the file header for how it works. */
export function Led({
  text,
  pitch = 8,
  tone = "accent",
  board = true,
  glow = true,
  animate = false,
  delay = 0,
  step = 10,
  flip = false,
  flipDelay = 0,
  label,
  className,
  style,
}: LedProps) {
  const { columns, width, chars } = layoutLed(text);
  const r = pitch * 0.38;
  const w = width * pitch;
  const h = 7 * pitch;
  const patternId = `led-${pitch}-${hash(text)}`;
  const glowColour = tone === "accent" ? "var(--led-glow)" : "var(--soft-glow)";
  const filter = glow
    ? `drop-shadow(0 0 ${Math.max(1.5, pitch / 4).toFixed(1)}px ${glowColour})`
    : undefined;

  /** Lit dots: one path per column when they light up one by one, else a single path. */
  const dots = (cols: LedColumn[]) =>
    animate ? (
      cols.map((column) => (
        <path
          key={column.x}
          className="led-col"
          d={dotsPath([column], pitch)}
          style={{ animationDelay: `${delay + column.x * step}ms` }}
        />
      ))
    ) : (
      <path d={dotsPath(cols, pitch)} />
    );

  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  return (
    <svg
      {...a11y}
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className={["led-text", className].filter(Boolean).join(" ")}
      style={style}
    >
      {board && (
        <>
          <defs>
            <pattern id={patternId} width={pitch} height={pitch} patternUnits="userSpaceOnUse">
              <circle cx={pitch / 2} cy={pitch / 2} r={r} style={{ fill: "var(--led-off)" }} />
            </pattern>
          </defs>
          <rect width={w} height={h} fill={`url(#${patternId})`} />
        </>
      )}
      <g
        fill="none"
        strokeLinecap="round"
        strokeWidth={num(r * 2)}
        style={{ stroke: FILL[tone], filter }}
      >
        {flip
          ? chars.map((char, i) => (
              <g
                key={i}
                className="led-flip"
                style={{ animationDelay: `${flipDelay + i * FLIP_STEP}ms` }}
              >
                {dots(char)}
              </g>
            ))
          : dots(columns)}
      </g>
    </svg>
  );
}
