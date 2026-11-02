import { Led } from "@/components/Led";
import { PlaneIcon } from "@/components/ui/icons";

/** Four routes leaving the FJ hub at (300, 230), each ending at a service's LED code. */
export const ROUTES = [
  { d: "M 300 230 C 360 110, 470 70, 560 70", end: [560, 70], label: [578, 34] },
  { d: "M 300 230 C 400 200, 480 190, 590 196", end: [590, 196], label: [608, 212] },
  { d: "M 300 230 C 400 290, 470 330, 560 330", end: [560, 330], label: [578, 346] },
  { d: "M 300 230 C 230 330, 140 360, 60 330", end: [60, 330], label: [26, 346] },
] as const;

/**
 * The Services hero's route map (600 × 420): a dotted panel with the FJ hub in the middle and
 * one route per service. A plane loops along each route, one after the other.
 * Phones get the same drawing zoomed down to fit.
 */
export function RouteNetwork({ codes, label }: { codes: string[]; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative h-[420px] w-[600px] flex-none max-lg:[zoom:0.597]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 600 420"
        width="600"
        height="420"
        className="absolute inset-0 overflow-visible"
      >
        <defs>
          <pattern id="network-dots" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" style={{ fill: "var(--dot-dim)" }} />
          </pattern>
        </defs>
        <rect width="600" height="420" rx="12" fill="url(#network-dots)" />
        {ROUTES.map((r) => (
          <path
            key={r.d}
            d={r.d}
            fill="none"
            style={{ stroke: "var(--line-mid)" }}
            strokeWidth="2"
            strokeDasharray="2 8"
            strokeLinecap="round"
          />
        ))}
        {ROUTES.map(({ end: [x, y] }) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="7" style={{ fill: "var(--led-white)" }} />
            <circle
              cx={x}
              cy={y}
              r="17"
              fill="none"
              strokeOpacity="0.25"
              style={{ stroke: "var(--led-white)" }}
            />
          </g>
        ))}
        <circle cx="300" cy="230" r="34" fillOpacity="0.12" style={{ fill: "var(--led)" }} />
        <circle
          cx="300"
          cy="230"
          r="22"
          strokeWidth="2"
          style={{ fill: "var(--board)", stroke: "var(--led)" }}
        />
      </svg>
      <span aria-hidden="true" className="absolute" style={{ left: 288, top: 221 }}>
        <Led text="FJ" pitch={3.6} />
      </span>
      {ROUTES.map(({ label: [x, y] }, i) => (
        <span key={codes[i]} aria-hidden="true" className="absolute" style={{ left: x, top: y }}>
          <Led text={codes[i]} pitch={3.4} tone="white" />
        </span>
      ))}
      {ROUTES.map((r, i) => (
        <span
          key={`plane-${r.d}`}
          aria-hidden="true"
          className="net-plane"
          style={{ offsetPath: `path("${r.d}")`, animationDelay: `${-i * 1.6}s` }}
        >
          <PlaneIcon size={24} />
        </span>
      ))}
    </div>
  );
}
