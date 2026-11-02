import { Led } from "@/components/Led";
import type { FlightStatus } from "@/content/projects";

type StatusLedProps = {
  status: FlightStatus;
  /** Translated words for screen readers, e.g. { label: "Status", LIVE: "live", … }. */
  text: { label: string } & Record<FlightStatus, string>;
  pitch?: number;
};

/**
 * A project's status as it appears on the departures board:
 * LIVE lit in the accent colour, BOARDING blinking, CHECK-IN steady in grey, ON HOLD dimmed.
 * Status is shown by the lettering alone (no coloured dot), and screen readers hear
 * the translated status ("Status: live").
 */
export function StatusLed({ status, text, pitch = 4 }: StatusLedProps) {
  return (
    <span className="inline-flex">
      <span className="sr-only">
        {text.label}: {text[status]}
      </span>
      {status === "LIVE" && <Led text="LIVE" pitch={pitch} />}
      {status === "BOARDING" && (
        <Led text="BOARDING" pitch={pitch} tone="white" className="blink" />
      )}
      {status === "CHECK-IN" && <Led text="CHECK-IN" pitch={pitch} tone="grey" />}
      {status === "ON HOLD" && <Led text="ON HOLD" pitch={pitch} tone="dim" glow={false} />}
    </span>
  );
}
