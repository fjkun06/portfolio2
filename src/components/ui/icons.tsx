/**
 * Small decorative icons. All are hidden from screen readers and draw in `currentColor`
 * unless noted.
 */

const PLANE_PATH =
  "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z";

/**
 * A plane seen from above.
 * @param rotate Degrees: 90 points right (default), 180 points down.
 */
export function PlaneIcon({ size = 30, rotate = 90 }: { size?: number; rotate?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={PLANE_PATH} fill="currentColor" transform={`rotate(${rotate} 12 12)`} />
    </svg>
  );
}

const CHECK_DOTS = ["00001", "00010", "10100", "01000"];

/** A tick drawn in LED dots, lit in the accent colour. Used in checkboxes and language chips. */
export function CheckLed({ size = 15 }: { size?: number }) {
  const p = size / 5;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{ fill: "var(--accent)", filter: "drop-shadow(0 0 2px var(--accent-glow))" }}
    >
      {CHECK_DOTS.flatMap((row, r) =>
        [...row].map((v, c) =>
          v === "1" ? (
            <circle key={`${r}-${c}`} cx={c * p + p / 2} cy={r * p + p} r={p * 0.4} />
          ) : null,
        ),
      )}
    </svg>
  );
}
