import { PlaneIcon } from "@/components/ui/icons";

/** Seconds between two flight lines' planes, so the planes on a page don't fly in step. */
const STAGGER = 1.4;

/**
 * A dotted flight line between where a trip starts and where it ends. The line is always
 * fully drawn; the plane does the flying: it takes off at the start, crosses to the end, fades
 * out and takes off again, on a slow loop, only while the line is on screen (`.on-screen`, see
 * .flight-plane in globals.css). Off screen, or for visitors who prefer reduced motion, it waits
 * in the middle of the line.
 *
 * @param index Position among the flight lines on the page; each plane is a step further along.
 */
export function FlightLine({ index = 0, className = "" }: { index?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`on-screen relative block h-[3px] ${className}`}
      style={{
        backgroundImage: "repeating-linear-gradient(90deg, var(--ink) 0 3px, transparent 3px 10px)",
      }}
    >
      <span
        className="flight-plane absolute top-[-13px] text-ink"
        style={{ animationDelay: `-${index * STAGGER}s` }}
      >
        <PlaneIcon size={28} />
      </span>
    </span>
  );
}
