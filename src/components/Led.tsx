import { Fragment } from "react";

import { layoutLed } from "@/lib/led";

/** Which colour the lit dots take. All follow dark and light mode. */
export type LedTone = "accent" | "white" | "grey" | "dim" | "ink";

const FILL: Record<LedTone, string> = {
  accent: "var(--led)",
  white: "var(--led-white)",
  grey: "var(--led-grey)",
  dim: "var(--led-dim)",
  ink: "var(--ink)",
};

type LedProps = {
  text: string;
  /** Distance between dot centres, in pixels. */
  pitch?: number;
  tone?: LedTone;
  /** Draw the unlit dots behind the letters. */
  board?: boolean;
  glow?: boolean;
  /** Columns switch on one after another when the page loads. */
  animate?: boolean;
  /** Milliseconds before the first column, and between columns. */
  delay?: number;
  step?: number;
  /** When set, the lettering is announced as an image with this text. Otherwise it is hidden from screen readers, so put the words in the page another way. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
};

function hash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** Text drawn in LED dots, as an SVG. */
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
