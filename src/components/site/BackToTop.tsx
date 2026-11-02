import { Led } from "@/components/Led";

/**
 * Positions of the dots around the button's edge, going clockwise and starting at the top centre,
 * like the hand of a clock. The button's frame fills up in this order as you scroll.
 *
 * @param size  Button size in pixels (square).
 * @param inset Distance of the dots from the edge.
 * @param step  Approximate distance between two dots.
 * @returns [x, y] pairs, one per dot.
 */
export function framePoints(size: number, inset = 5, step = 6.2): [number, number][] {
  const n = Math.floor((size - 2 * inset) / step) + 1; // dots per side, corners included
  const span = size - 2 * inset;
  const at = (k: number) => (span * k) / (n - 1);
  const pts: [number, number][] = [];
  for (let k = 0; k < n - 1; k++) pts.push([inset + at(k), inset]); // top, left → right
  for (let k = 0; k < n - 1; k++) pts.push([size - inset, inset + at(k)]); // right, top → bottom
  for (let k = 0; k < n - 1; k++) pts.push([size - inset - at(k), size - inset]); // bottom, right → left
  for (let k = 0; k < n - 1; k++) pts.push([inset, size - inset - at(k)]); // left, bottom → top
  const start = Math.floor((n - 1) / 2); // rotate so the first dot is the top centre
  return [...pts.slice(start), ...pts.slice(0, start)];
}

/**
 * Floating "back to top" button, fixed bottom right, drawn as a small LED panel with an ↑.
 *
 * - It fades in once you've scrolled about 10 % of the page.
 * - Its frame of dots lights up one dot at a time as you get closer to the end of the page.
 *   Each dot gets its own share of the scroll: dot i lights up at i / total of the way down.
 *   Chrome, Edge and Safari do this in CSS (`animation-range` per dot); Firefox uses the
 *   `--t` value of each dot together with `--scroll` from ScrollEffects.
 * - It links to `#top` (the <body>), and smooth scrolling is set globally in globals.css.
 */
export function BackToTop({ label }: { label: string }) {
  const size = 64;
  const pts = framePoints(size);
  return (
    <a
      href="#top"
      aria-label={label}
      className="totop board card-edge fixed right-4 bottom-4 z-40 block rounded-[10px] border border-rule-board shadow-[0_14px_30px_-12px_rgba(0,0,0,0.55)] lg:right-7 lg:bottom-7"
      style={{ width: size, height: size }}
    >
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="absolute -inset-px"
      >
        {pts.map(([x, y], i) => {
          const t = i / pts.length;
          return (
            <circle
              key={i}
              className="totop-dot"
              cx={x.toFixed(1)}
              cy={y.toFixed(1)}
              r={1.5}
              style={
                {
                  "--t": t.toFixed(4),
                  animationRange: `${(t * 100).toFixed(2)}% ${(t * 100 + 0.5).toFixed(2)}%`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </svg>
      <span className="totop-arrow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Led text="↑" pitch={4.4} />
      </span>
    </a>
  );
}
