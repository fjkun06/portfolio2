/**
 * <Led>: draws any text in the site's LED dot lettering, as an inline SVG.
 *
 * How it's drawn:
 * - The unlit dots are one repeating SVG <pattern> filling a rectangle (cheap, one element).
 * - The lit dots are one <circle> each, grouped per column. With `animate`, each column fades in
 *   a few milliseconds after the previous one, so the text "switches on" from left to right.
 * - Colours are CSS variables, so the same SVG follows dark and light mode with no re-render.
 *
 * It has no state and no hooks, so it works in both server and client components.
 *
 * @example
 * <Led text="NEXT DEPARTURE:" pitch={12} tone="white" />
 * <Led text="LIVE" pitch={4} label="Status: live" />
 */
import { Fragment } from "react";

import { layoutLed } from "@/lib/led";

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
  label,
  className,
  style,
}: LedProps) {
  const { columns, width } = layoutLed(text);
  const r = pitch * 0.38;
  const w = width * pitch;
  const h = 7 * pitch;
  const patternId = `led-${pitch}-${hash(text)}`;
  const glowColour = tone === "accent" ? "var(--led-glow)" : "var(--soft-glow)";
  const filter = glow
    ? `drop-shadow(0 0 ${Math.max(1.5, pitch / 4).toFixed(1)}px ${glowColour})`
    : undefined;

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
      <g style={{ fill: FILL[tone], filter }}>
        {columns.map(({ x, rows }) => {
          const dots = rows.map((row) => (
            <circle key={row} cx={x * pitch + pitch / 2} cy={row * pitch + pitch / 2} r={r} />
          ));
          return animate ? (
            <g key={x} className="led-col" style={{ animationDelay: `${delay + x * step}ms` }}>
              {dots}
            </g>
          ) : (
            <Fragment key={x}>{dots}</Fragment>
          );
        })}
      </g>
    </svg>
  );
}
