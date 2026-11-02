import { Led } from "@/components/Led";

type LedTitleProps = {
  id: string;
  /** Two lines in LED dots; the first is white, the second lit in the accent colour. */
  lines: [string, string];
  /** The same title as real text, for screen readers and search engines. */
  text: string;
  /** Dot size on desktop (phones use half). */
  pitch?: number;
};

/**
 * The page title of an inner page (YOUR CAPTAIN, CHECK-IN DESK…) as a big two-line LED sign
 * that lights up column by column. Long words shrink to the available width instead of
 * overflowing (`max-w-full h-auto`).
 */
export function LedTitle({ id, lines, text, pitch = 12 }: LedTitleProps) {
  const sign = (p: number, className: string, gap: string) => (
    <span aria-hidden="true" className={`${className} flex-col ${gap}`}>
      {lines.map((line, i) => (
        <Led
          key={line}
          text={line}
          pitch={p}
          step={10}
          delay={i * 160}
          animate
          tone={i === 0 ? "white" : "accent"}
          className="h-auto max-w-full"
        />
      ))}
    </span>
  );

  return (
    <h1 id={id} className="m-0">
      <span className="sr-only">{text}</span>
      {sign(pitch, "hidden lg:flex", "gap-6")}
      {sign(pitch / 2, "flex lg:hidden", "gap-3")}
    </h1>
  );
}
