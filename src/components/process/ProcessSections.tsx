import type { CSSProperties } from "react";

import { Led } from "@/components/Led";
import { Cockpit, CockpitStrip } from "@/components/process/Cockpit";
import { CheckLed } from "@/components/ui/icons";
import { container, sectionTitle } from "@/components/ui/layout";
import { SplitTitle } from "@/components/ui/SplitTitle";
import type { ProcessContent, Stop } from "@/content/process";

/** "YOU" or "ME" box: what each side does at a stop. Mine is dark, the client's is outlined. */
function Role({ label, text, dark }: { label: string; text: string; dark: boolean }) {
  return (
    <div
      className={`rv min-w-0 flex-[1_1_260px] rounded-[10px] px-4.5 pt-4.5 pb-5 lg:px-5.5 lg:pt-5.5 lg:pb-6 ${dark ? "board card-edge" : "border-[1.5px] border-ink"}`}
    >
      <span className="inline-flex">
        {dark ? (
          <Led text={label} pitch={3} label={label} />
        ) : (
          <Led text={label} pitch={3} tone="ink" board={false} glow={false} label={label} />
        )}
      </span>
      <p className={`m-0 mt-3 text-base leading-normal ${dark ? "text-on-board-2" : "text-muted"}`}>
        {text}
      </p>
    </div>
  );
}

/**
 * Font size that lets a stop name fill at most the width of its column, so long words like
 * "ENREGISTREMENT" shrink instead of breaking. The stencil letters are about half an em wide.
 */
export function fitName(name: string): string {
  return `${(190 / Math.max(name.length, 1)).toFixed(1)}cqi`;
}

/** One stop: tag and timing, the big name, the sentence that colours in, who does what, and the result. */
function StopArticle({ stop, index, text }: { stop: Stop; index: number; text: ProcessContent }) {
  return (
    <li
      id={`stop-${index + 1}`}
      className="@container border-t-[1.5px] border-ink py-11.5 lg:min-h-[620px] lg:pt-17.5 lg:pb-20"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rv board chip-line inline-flex rounded px-2.5 py-2">
          <Led
            text={`${text.stopTag} 0${index + 1}`}
            pitch={3}
            label={`${text.stopTag} ${index + 1}`}
          />
        </span>
        <span className="rv font-stencil text-[17px] font-extrabold tracking-[0.1em] text-label lg:text-[19px]">
          {stop.when}
        </span>
      </div>
      <h3
        style={{ "--fit": fitName(stop.name) } as CSSProperties}
        className="rv-wipe m-0 mt-5.5 font-stencil text-[min(64px,var(--fit))] leading-[0.86] font-black whitespace-nowrap lg:mt-7.5 lg:text-[min(120px,var(--fit))]"
      >
        {stop.name}
      </h3>
      <p className="read-on mt-4.5 mb-0 max-w-[26em] text-[22px] leading-[1.3] font-medium tracking-[-0.015em] lg:mt-6.5 lg:text-3xl">
        {stop.lead}
      </p>
      <div className="mt-6 flex flex-wrap gap-3 lg:mt-9">
        <Role label={text.you} text={stop.you} dark={false} />
        <Role label={text.me} text={stop.me} dark />
      </div>
      <p className="rv mt-5.5 mb-0 flex flex-wrap items-center gap-x-3.5 gap-y-2.5">
        <span className="text-[13px] text-label">{text.youGet}</span>
        <span className="font-stencil text-[22px] font-black tracking-[0.03em] uppercase lg:text-[26px]">
          {stop.get}
        </span>
      </p>
    </li>
  );
}

/**
 * The four stops with the cockpit. Desktop: cockpit on the left (sticky), stops on the right.
 * Phones: the slim cockpit strip sticks under the header above the stops.
 * MotionEffects follows the scroll through `.proc` and drives the cockpit from it.
 */
export function Stops({ text }: { text: ProcessContent }) {
  return (
    <section aria-label={text.stopsLabel} className={`${container} lg:pt-5`}>
      <div className="proc relative mt-2.5 lg:mt-17.5 lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-18">
        <div className="hidden lg:block">
          <Cockpit text={text} />
        </div>
        {/* No wrapper: a sticky element only sticks within its parent, and this one must be
            the whole list of stops for the strip to stay under the header. */}
        <CockpitStrip text={text} />
        <ol className="m-0 list-none p-0 lg:border-b-[1.5px] lg:border-ink">
          {text.stops.map((s, i) => (
            <StopArticle key={s.name} stop={s} index={i} text={text} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Two-line section heading, its words written once (see SplitTitle). */
function TwoLineTitle({ id, lines, text }: { id: string; lines: [string, string]; text: string }) {
  return (
    <h2 id={id} className={`rv-wipe ${sectionTitle}`}>
      <SplitTitle text={text} lines={lines} />
    </h2>
  );
}

/**
 * "Carry-on checklist": what to prepare, with real checkboxes the visitor can tick for
 * themselves (nothing is sent or saved; it's a reading aid).
 */
export function CarryOn({ text }: { text: ProcessContent["carry"] }) {
  return (
    <section aria-labelledby="carry-title" className={`${container} pt-18 lg:pt-36`}>
      <div className="flex flex-wrap items-start gap-6.5 lg:gap-16">
        <div className="min-w-0 flex-[1_1_380px]">
          <TwoLineTitle id="carry-title" lines={text.title} text={text.titleText} />
          <p className="rv mt-4.5 mb-0 max-w-[380px] text-muted">{text.intro}</p>
        </div>
        <ul className="m-0 min-w-0 flex-[1_1_520px] list-none border-b border-rule p-0">
          {text.items.map(([item, note]) => (
            <li key={item} className="rv-left border-t border-rule">
              <label className="cb relative flex min-h-[62px] cursor-pointer items-center gap-4 lg:min-h-[72px]">
                <input type="checkbox" className="cb-input" />
                <span className="cb-box">
                  <CheckLed size={14} />
                </span>
                <span className="flex flex-wrap items-baseline gap-x-4.5 gap-y-1">
                  <span className="font-stencil text-2xl font-black tracking-[0.02em] uppercase lg:text-3xl">
                    {item}
                  </span>
                  <span className="text-[15px] text-muted">{note}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "After landing": what happens once the site is live, as three LED-coded tiles. */
export function AfterLanding({ text }: { text: ProcessContent["after"] }) {
  return (
    <section aria-labelledby="after-title" className="board mt-18 lg:mt-36">
      <div className={`${container} pt-15 pb-15 lg:pt-28 lg:pb-28`}>
        <TwoLineTitle id="after-title" lines={text.title} text={text.titleText} />
        <ul className="m-0 mt-7 grid list-none grid-cols-1 border-b border-rule-board p-0 lg:mt-12.5 lg:grid-cols-3">
          {text.items.map((item, i) => (
            <li
              key={item.code}
              className={`rv-flap min-w-0 border-t border-rule-board py-5 lg:border-t-0 lg:px-6 lg:py-6.5 ${i ? "lg:border-l" : "lg:border-t"}`}
            >
              <Led text={item.code} pitch={4} label={item.code} />
              <span className="mt-3.5 block font-stencil text-[28px] leading-none font-black uppercase lg:text-[34px]">
                {item.title}
              </span>
              <span className="mt-2 block text-[15px] text-muted-board">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
