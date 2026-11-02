import { Led } from "@/components/Led";
import { PlaneIcon } from "@/components/ui/icons";

/**
 * Four routes leaving the FJ hub at (300, 230), each ending at a service. The code sits just under
 * its end point, and every label stays inside the 600 px drawing.
 */
export const ROUTES = [
  { d: "M 300 230 C 340 130, 420 70, 510 70", end: [510, 70], label: [506, 94] },
  { d: "M 300 230 C 380 205, 450 196, 530 200", end: [530, 200], label: [526, 224] },
  { d: "M 300 230 C 380 290, 430 330, 510 330", end: [510, 330], label: [506, 354] },
  { d: "M 300 230 C 230 330, 160 350, 80 330", end: [80, 330], label: [76, 354] },
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
          <g key={r.d} fill="none" strokeLinecap="round">
            {/* faint track under the dotted line, so the route reads as one path */}
            <path d={r.d} strokeWidth="6" strokeOpacity="0.08" style={{ stroke: "var(--led)" }} />
            <path
              d={r.d}
              strokeWidth="2.5"
              strokeDasharray="0.5 8"
              strokeOpacity="0.75"
              style={{ stroke: "var(--led)" }}
            />
          </g>
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
      <span aria-hidden="true" className="absolute" style={{ left: 280, top: 218 }}>
        <Led text="FJ" pitch={3.6} />
      </span>
      {ROUTES.map(({ label: [x, y] }, i) => (
        <span
          key={codes[i]}
          aria-hidden="true"
          className="absolute w-max"
          style={{ left: x, top: y }}
        >
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
