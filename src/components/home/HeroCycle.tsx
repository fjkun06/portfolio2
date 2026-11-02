"use client";

import { inView } from "motion";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";

/** How long each language's headline stays on screen. */
export const CYCLE_MS = 7000;

type Variant = {
  lang: Locale;
  /** The departures-board word for this language: DEPARTURES, DÉPARTS, ABFLUG. */
  word: string;
  /** The headline in LED dots, rendered on the server. */
  headline: React.ReactNode;
};

type HeroCycleProps = {
  /** One entry per language, in display order. */
  variants: Variant[];
  /** The page's language: shown first. */
  start: Locale;
  /** Shown at the right end of the board row, e.g. the route. */
  aside?: React.ReactNode;
};

/**
 * The hero's language rotation. Every 7 seconds the headline switches to the next language,
 * and the matching word on the board (DEPARTURES / DÉPARTS / ABFLUG) lights up.
 *
 * - The three headlines are rendered once on the server, stacked in one grid cell; this
 *   component only marks one as active. Becoming active restarts its LED animation, so each
 *   headline "switches on" column by column every time it appears.
 * - The rotation pauses while the hero is scrolled out of view (Motion's `inView`).
 * - Visitors who prefer reduced motion get no rotation: the page's own language stays.
 * - The rotating headlines are hidden from screen readers; the page has the headline as real
 *   text in its own language (in Hero).
 */
export function HeroCycle({ variants, start, aside }: HeroCycleProps) {
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      variants.findIndex((v) => v.lang === start),
    ),
  );

  const board = useRef<HTMLDivElement>(null);

  // Cycle only while the hero is on screen: switching headlines relights hundreds of LED
  // columns, which is wasted work (and scroll jank) when nobody can see it.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const start = () => {
      const timer = window.setInterval(
        () => setIndex((current) => (current + 1) % variants.length),
        CYCLE_MS,
      );
      return () => window.clearInterval(timer);
    };
    if (typeof IntersectionObserver === "undefined" || !board.current) return start();
    return inView(board.current, () => start());
  }, [variants.length]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-rule-board pb-6">
        <p className="m-0 flex flex-wrap gap-x-5 gap-y-2 font-stencil text-2xl leading-none font-black tracking-[0.05em] lg:gap-7 lg:text-[34px]">
          {variants.map((v, i) => (
            <span
              key={v.lang}
              lang={v.lang}
              className="transition-colors duration-300"
              style={{ color: i === index ? "var(--led)" : "var(--text-off)" }}
            >
              {v.word}
            </span>
          ))}
        </p>
        {aside}
      </div>
      {/* All headlines sit in the same grid cell, so the hero keeps the height of the tallest
          and nothing below it moves when the language changes. Only the active one is visible;
          showing it restarts its LED columns (see .hero-variant in globals.css). */}
      <div ref={board} aria-hidden="true" className="mt-10 grid lg:mt-16">
        {variants.map((v, i) => (
          <div
            key={v.lang}
            lang={v.lang}
            data-active={i === index}
            className={`hero-variant [grid-area:1/1] ${i === index ? "" : "invisible"}`}
          >
            {v.headline}
          </div>
        ))}
      </div>
    </>
  );
}
