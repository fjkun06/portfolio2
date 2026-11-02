import { StatusLed } from "@/components/ui/StatusLed";
import type { FlightStatus } from "@/content/projects";
import type { Dictionary } from "@/locales/en";

/**
 * Dark strip across the top of an in-progress project's picture: "Work in progress" and the
 * status in LED dots (BOARDING blinking, ON HOLD dimmed), over a dotted LED line.
 * Put it inside a `relative` box, next to the picture (which gets `.wip-media`).
 */
export function WipBand({
  status,
  label,
  text,
}: {
  status: FlightStatus;
  /** "Work in progress", in the page's language. */
  label: string;
  text: Dictionary["status"];
}) {
  return (
    <span className="wip-band board absolute inset-x-0 top-0 z-[1] flex items-center justify-between gap-3 px-3 py-2 lg:px-4 lg:py-2.5">
      <span className="text-[13px] text-on-board-2 lg:text-sm">{label}</span>
      <StatusLed status={status} text={text} pitch={3} />
    </span>
  );
}
