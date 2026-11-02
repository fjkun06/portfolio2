import { Led } from "@/components/Led";
import { PlaneIcon } from "@/components/ui/icons";

/** Curved route from Cameroon (bottom left) to Germany (top right), in two sizes. */
const SIZES = {
  desktop: {
    w: 520,
    h: 260,
    path: "M 70 196 C 170 40, 360 30, 452 120",
    from: [70, 196],
    to: [452, 120],
    pitch: 4,
  },
  mobile: {
    w: 340,
    h: 180,
    path: "M 38 142 C 104 28, 236 22, 298 88",
    from: [38, 142],
    to: [298, 88],
    pitch: 3,
  },
} as const;

/**
 * A small dotted map of the route, CM → DE. The plane flies along the curve as you read the
 * page: at the top it's leaving Cameroon, at the bottom it has landed in Germany
 * (`.route-plane` in globals.css, driven by the page's scroll position).
 */
export function RouteMap({ size, label }: { size: keyof typeof SIZES; label: string }) {
  const { w, h, path, from, to, pitch } = SIZES[size];
  return (
    <div
      role="img"
      aria-label={label}
      className="relative max-w-full"
      style={{ width: w, height: h }}
    >
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        className="absolute inset-0 overflow-visible"
      >
        <defs>
          <pattern id={`route-dots-${size}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" style={{ fill: "var(--dot-dim)" }} />
          </pattern>
        </defs>
        <rect width={w} height={h} fill={`url(#route-dots-${size})`} />
        <path
          d={path}
          style={{ stroke: "var(--line-mid)" }}
          strokeWidth="2"
          strokeDasharray="2 7"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={from[0]} cy={from[1]} r="6" style={{ fill: "var(--led)" }} />
        <circle
          cx={from[0]}
          cy={from[1]}
          r="15"
          fill="none"
          strokeOpacity="0.35"
          style={{ stroke: "var(--led)" }}
        />
        <circle cx={to[0]} cy={to[1]} r="6" style={{ fill: "var(--led-white)" }} />
        <circle
          cx={to[0]}
          cy={to[1]}
          r="15"
          fill="none"
          strokeOpacity="0.3"
          style={{ stroke: "var(--led-white)" }}
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute"
        style={{ left: from[0] - 24, top: from[1] + 22 }}
      >
        <Led text="CM" pitch={pitch} />
      </span>
      <span aria-hidden="true" className="absolute" style={{ left: to[0] - 12, top: to[1] - 48 }}>
        <Led text="DE" pitch={pitch} tone="white" />
      </span>
      <span aria-hidden="true" className="route-plane" style={{ offsetPath: `path("${path}")` }}>
        <PlaneIcon size={size === "desktop" ? 28 : 24} />
      </span>
    </div>
  );
}
