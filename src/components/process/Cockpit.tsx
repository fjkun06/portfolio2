import { Led } from "@/components/Led";
import { PlaneIcon } from "@/components/ui/icons";
import type { ProcessContent } from "@/content/process";

const TRACK = 300;

/**
 * Desktop cockpit: a dark panel that stays in view (sticky) while you scroll past the four stops.
 * It shows the current stop's number (01–04) and name, and a vertical track where the plane
 * flies down and each stop lights up as you reach it. All driven by CSS on the `.proc` timeline.
 * Purely visual (aria-hidden): the stops themselves are in the page as headings.
 */
export function Cockpit({ text }: { text: ProcessContent }) {
  return (
    <aside
      aria-hidden="true"
      className="board card-edge sticky top-[110px] self-start rounded-[14px] px-6.5 pt-6 pb-7.5 shadow-[0_40px_60px_-45px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center justify-between border-b border-rule-board pb-4">
        <Led text="FJ 2026" pitch={2.6} tone="grey" glow={false} />
        <span className="text-xs text-muted-board">{text.cockpit.plan}</span>
      </div>
      <div className="mt-5.5 flex items-end gap-3.5">
        <span className="grid">
          {text.stops.map((_, i) => (
            <span key={i} className={`pq q${i}`}>
              <Led text={`0${i + 1}`} pitch={11} />
            </span>
          ))}
        </span>
        <span className="pb-1.5">
          <Led text="/04" pitch={3.4} tone="dim" glow={false} />
        </span>
      </div>
      <div className="mt-3.5 grid min-h-7">
        {text.stops.map((s, i) => (
          <span key={s.name} className={`pq q${i}`}>
            <Led text={s.name} pitch={3.4} tone="white" />
          </span>
        ))}
      </div>
      <div className="relative mt-7.5" style={{ height: TRACK }}>
        <span
          className="absolute top-0 left-[9px] -ml-px w-[3px]"
          style={{
            height: TRACK,
            backgroundImage:
              "repeating-linear-gradient(180deg, var(--line-strong) 0 3px, transparent 3px 8px)",
          }}
        />
        <span
          className="pfill absolute top-0 left-[9px] -ml-px w-[3px]"
          style={{
            height: TRACK,
            backgroundImage:
              "repeating-linear-gradient(180deg, var(--led) 0 3px, transparent 3px 8px)",
            filter: "drop-shadow(0 0 3px var(--led-glow))",
          }}
        />
        <ol className="m-0 list-none p-0">
          {text.stops.map((s, i) => (
            <li
              key={s.name}
              className="absolute inset-x-0 flex -translate-y-1/2 items-center gap-4"
              style={{ top: (TRACK * i) / 3 }}
            >
              <span
                className={`pdot d${i} ml-0.5 box-border size-4 flex-none rounded-full border-2`}
              />
              <span
                className={`plab d${i} min-w-0 truncate font-stencil text-xl font-extrabold tracking-[0.06em]`}
              >
                {s.name}
              </span>
              <span className="ml-auto text-xs whitespace-nowrap text-muted-board">{s.when}</span>
            </li>
          ))}
        </ol>
        <span
          className="pplane -mt-3.5 -ml-1 text-[var(--led)]"
          style={{ filter: "drop-shadow(0 0 6px var(--led-glow))" }}
        >
          <PlaneIcon size={28} rotate={180} />
        </span>
      </div>
    </aside>
  );
}

/**
 * Phone and tablet version of the cockpit (hidden from 1024 px): a thin strip that sticks under
 * the header while you read the stops, with the current stop's number and name, and a dotted
 * line filling up from left to right.
 */
export function CockpitStrip({ text }: { text: ProcessContent }) {
  return (
    <div
      aria-hidden="true"
      className="board sticky top-16 z-20 -mx-4 border-b border-rule-board lg:hidden"
    >
      <div className="flex h-[54px] items-center gap-3 px-4">
        <span className="grid">
          {text.stops.map((_, i) => (
            <span key={i} className={`pq q${i}`}>
              <Led text={`0${i + 1}`} pitch={3.4} />
            </span>
          ))}
        </span>
        <Led text="/04" pitch={2.2} tone="dim" glow={false} />
        <span className="ml-auto grid justify-items-end">
          {text.stops.map((s, i) => (
            <span key={s.name} className={`pq q${i}`}>
              <Led text={s.name} pitch={2.4} tone="white" />
            </span>
          ))}
        </span>
      </div>
      <div
        className="relative h-[3px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--dot-dim) 0 3px, transparent 3px 6px)",
        }}
      >
        <div
          className="pfillx h-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--led) 0 3px, transparent 3px 6px)",
          }}
        />
      </div>
    </div>
  );
}
