import { Led } from "@/components/Led";

/** Points around the button's edge, clockwise from the top centre. */
function framePoints(size: number, inset = 5, step = 6.2) {
  const n = Math.floor((size - 2 * inset) / step) + 1;
  const span = size - 2 * inset;
  const at = (k: number) => (span * k) / (n - 1);
  const pts: [number, number][] = [];
  for (let k = 0; k < n - 1; k++) pts.push([inset + at(k), inset]);
  for (let k = 0; k < n - 1; k++) pts.push([size - inset, inset + at(k)]);
  for (let k = 0; k < n - 1; k++) pts.push([size - inset - at(k), size - inset]);
  for (let k = 0; k < n - 1; k++) pts.push([inset, size - inset - at(k)]);
  const start = Math.floor((n - 1) / 2);
  return [...pts.slice(start), ...pts.slice(0, start)];
}

/**
 * Floating LED button. It appears once you scroll past the top,
 * and its frame of dots lights up as you get closer to the end of the page.
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
