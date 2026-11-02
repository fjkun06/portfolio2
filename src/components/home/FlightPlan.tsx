import Link from "next/link";

import { Led } from "@/components/Led";
import { Arrow } from "@/components/site/Arrow";
import { PlaneIcon } from "@/components/ui/icons";
import { container, sectionTitle } from "@/components/ui/layout";
import type { Dictionary } from "@/locales/en";

type FlightPlanProps = {
  text: Dictionary["home"]["plan"];
  /** Address of the Process page. */
  processHref: string;
};

/**
 * Where each stop sits around the desktop orbit (1200 × 600 box): the text block's position,
 * and the point on the ellipse where its marker goes. Left, top, right, bottom.
 */
const ORBIT_STOPS = [
  { box: "left-0 top-[230px] w-[205px] items-end text-right", mark: [220, 300] },
  { box: "left-[440px] top-0 w-[320px] items-center text-center", mark: [600, 160] },
  { box: "left-[995px] top-[230px] w-[205px] items-start", mark: [980, 300] },
  { box: "left-[430px] top-[470px] w-[340px] items-center text-center", mark: [600, 440] },
] as const;

/** A stop's number: dim, with a lit copy on top that switches on when the plane passes. */
function StopNumber({ i, pitch = 4 }: { i: number; pitch?: number }) {
  return (
    <span className="board chip-line relative inline-flex rounded px-[7px] py-[5px]">
      <Led text={`0${i + 1}`} pitch={pitch} tone="dim" glow={false} />
      <span className={`stop-lit s${i} absolute top-[5px] left-[7px]`}>
        <Led text={`0${i + 1}`} pitch={pitch} />
      </span>
    </span>
  );
}

const markStyle: React.CSSProperties = {
  background: "var(--led)",
  boxShadow: "0 0 0 6px var(--led-glow)",
  transform: "scale(1.25)",
};

/**
 * "Your flight plan": the four steps of a project as stops on a flight, driven by scrolling.
 * The further you scroll, the further the plane flies; scrolling back flies it back.
 *
 * - From 1280 px: the plane circles an ellipse (it shrinks at the far side and grows near you,
 *   for a 3D feel), with the stops around it and a big stop number in the middle.
 * - Below 1280 px: the plane flies straight down a dotted line past the stops.
 *
 * All motion is CSS (see "Flight plan" in globals.css); `data-scroll-progress` lets the Firefox
 * fallback drive the same animation.
 */
export function FlightPlan({ text, processHref }: FlightPlanProps) {
  return (
    <section id="plan" aria-labelledby="plan-title" className={`${container} pt-20 lg:pt-40`}>
      <h2 id="plan-title" className={`rv-wipe ${sectionTitle}`}>
        {text.title}
      </h2>
      <p className="rv mt-4.5 mb-0 max-w-[460px] text-muted">{text.intro}</p>
      <Link
        href={processHref}
        className="rv mt-3.5 inline-flex items-center gap-2.5 font-semibold underline-offset-[6px]"
      >
        {text.more} <Arrow />
      </Link>

      {/* Desktop orbit */}
      <div
        data-scroll-progress
        className="orbit rv-scale relative mt-10 hidden h-[600px] w-[1200px] xl:block"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 600"
          width="1200"
          height="600"
          className="absolute inset-0 overflow-visible"
        >
          <ellipse
            cx="600"
            cy="312"
            rx="380"
            ry="140"
            fill="none"
            stroke="var(--ink)"
            strokeOpacity="0.12"
            strokeWidth="10"
          />
          <ellipse
            cx="600"
            cy="300"
            rx="380"
            ry="140"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeDasharray="2 9"
            strokeLinecap="round"
          />
        </svg>
        <div
          aria-hidden="true"
          className="absolute top-[300px] left-[600px] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3"
        >
          <span className="text-[13px] text-label">{text.stop}</span>
          <span className="board chip-line inline-flex rounded-lg px-3.5 py-3">
            <span className="grid">
              {text.stops.map((_, i) => (
                <span key={i} className={`stop-num n${i}`}>
                  <Led text={`0${i + 1}`} pitch={9} />
                </span>
              ))}
            </span>
          </span>
        </div>
        {ORBIT_STOPS.map(({ mark: [x, y] }, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`stop-mark s${i} absolute -mt-2.5 -ml-2.5 size-5 rounded-full border-[3px] border-ink`}
            style={{ left: x, top: y, ...markStyle }}
          />
        ))}
        <span aria-hidden="true" className="orbit-plane text-ink">
          <PlaneIcon />
        </span>
        <ol className="m-0 list-none p-0">
          {text.stops.map((stop, i) => (
            <li key={stop.name} className={`rv absolute flex flex-col gap-2 ${ORBIT_STOPS[i].box}`}>
              <StopNumber i={i} />
              {/* 32 px keeps long names like ENREGISTREMENT next to their marker */}
              <h3 className="m-0 font-stencil text-[32px] leading-[0.95] font-black tracking-[0.02em]">
                {stop.name}
              </h3>
              <p className="m-0 text-[15px] leading-normal text-muted">{stop.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Phones, tablets and small laptops: straight down */}
      <div data-scroll-progress className="vtrack relative mt-9 h-[720px] xl:hidden">
        <span
          aria-hidden="true"
          className="absolute top-3.5 left-[11px] h-[560px] w-[3px]"
          style={{
            background: "repeating-linear-gradient(180deg, var(--ink) 0 3px, transparent 3px 10px)",
          }}
        />
        <span aria-hidden="true" className="vplane text-ink">
          <PlaneIcon rotate={180} />
        </span>
        <ol className="m-0 list-none p-0">
          {text.stops.map((stop, i) => (
            <li key={stop.name} className="relative box-border h-[180px] pl-12">
              <span
                aria-hidden="true"
                className={`stop-mark s${i} absolute top-1 left-[3px] size-5 rounded-full border-[3px] border-ink`}
                style={markStyle}
              />
              <StopNumber i={i} />
              <h3 className="mt-2.5 mb-0 font-stencil text-4xl leading-[0.95] font-black tracking-[0.02em]">
                {stop.name}
              </h3>
              <p className="mt-1.5 mb-0 max-w-[40ch] text-[15px] text-muted">{stop.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
