"use client";

import { inView, scroll } from "motion";
import { animate } from "motion/mini";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  EASE,
  hiddenStyle,
  isBelowFold,
  REVEAL_SELECTOR,
  revealOf,
  staggerDelay,
  withinRange,
} from "@/lib/motion/presets";

/** Section passing through the screen: from its top at the bottom edge to its bottom at the top. */
const COVER = ["start end", "end start"] as const;
/** Section filling the screen: from its top at the top edge to its bottom at the bottom edge. */
const CONTAIN = ["start start", "end end"] as const;

type Stop = () => void;

/** Runs `fn` when the browser is idle (or after a short delay where that isn't supported). */
function whenIdle(fn: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(fn, { timeout: 600 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 150);
  return () => clearTimeout(id);
}

/** Elements revealed once stay revealed, across navigations (the header and footer persist). */
const revealed = new WeakSet<Element>();

/** Inline styles a reveal sets, removed again when it ends so the page's own CSS takes over. */
function clearStyles(el: HTMLElement) {
  el.style.removeProperty("opacity");
  el.style.removeProperty("transform");
  el.style.removeProperty("clip-path");
  el.style.removeProperty("transform-origin");
}

/**
 * Hides every reveal element that is still below the fold and animates it in once it scrolls
 * into view. Elements already on screen (or above it) are left alone, so nothing visible ever
 * blinks and the first paint is never delayed by JavaScript.
 */
function setupReveals(pending: Set<HTMLElement>, stops: Stop[]) {
  const candidates = [...document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)].filter(
    (el) => !revealed.has(el) && !pending.has(el),
  );
  if (!candidates.length) return;

  // Read every position first, then write styles, so the browser lays out only once.
  // Elements not displayed yet (height 0: streamed content still in a hidden template, or a
  // layout for another screen size) are left for a later run.
  const viewport = window.innerHeight;
  const below: HTMLElement[] = [];
  for (const el of candidates) {
    const rect = el.getBoundingClientRect();
    if (rect.height === 0) continue;
    if (isBelowFold(rect, viewport)) below.push(el);
    else revealed.add(el); // already on screen or scrolled past: leave it as it is
  }
  if (!below.length) return;

  for (const el of below) {
    const reveal = revealOf(el)!;
    Object.assign(el.style, hiddenStyle(reveal));
    if (reveal.origin) el.style.transformOrigin = reveal.origin;
    pending.add(el);
  }

  // Elements entering in the same frame form a batch and come in one after another.
  let batch = 0;
  let resetQueued = false;
  stops.push(
    inView(
      below,
      (element) => {
        const el = element as HTMLElement;
        if (revealed.has(el)) return;
        revealed.add(el);
        pending.delete(el);
        const reveal = revealOf(el)!;
        const keyframes = Object.fromEntries(
          Object.keys(reveal.from).map((key) => [
            key,
            [
              reveal.from[key as keyof typeof reveal.from],
              reveal.to[key as keyof typeof reveal.to],
            ],
          ]),
        );
        animate(el, keyframes, {
          duration: reveal.duration,
          ease: EASE,
          delay: staggerDelay(batch++),
        }).then(() => {
          // Motion writes the final values when it finishes; drop them a frame later so the
          // element is back to its own CSS (and doesn't keep a GPU layer for nothing).
          requestAnimationFrame(() => clearStyles(el));
        });
        if (!resetQueued) {
          resetQueued = true;
          requestAnimationFrame(() => {
            batch = 0;
            resetQueued = false;
          });
        }
      },
      { margin: "0px 0px -8% 0px" },
    ),
  );
}

/**
 * Animations tied to the scroll position (Motion's `scroll`). Where the browser supports
 * scroll timelines, Motion hands transform and opacity animations to the compositor, so they
 * stay smooth even while the page is busy.
 */
function setupScrollLinks(linked: Set<Element>, stops: Stop[], still: boolean) {
  const each = <T extends Element>(selector: string, setup: (el: T) => Stop | Stop[]) => {
    document.querySelectorAll<T>(selector).forEach((el) => {
      // Skip what isn't displayed: other screen sizes' layouts, and pages Next.js keeps
      // hidden in the background after you leave them. They're set up when they show again.
      if (linked.has(el) || el.getClientRects().length === 0) return;
      linked.add(el);
      stops.push(...([] as Stop[]).concat(setup(el)));
    });
  };
  const linear = { ease: "linear" as const };

  // Header runway: fills with the page's scroll.
  each<HTMLElement>(".runway-fill", (el) =>
    scroll(animate(el, { transform: ["scaleX(0)", "scaleX(1)"] }, linear)),
  );

  // Back-to-top: fades in after ~10 % and its frame of dots lights up (CSS reads --scroll).
  each<HTMLElement>(".totop", (el) =>
    scroll((progress: number) => {
      el.style.setProperty("--scroll", progress.toFixed(4));
      el.toggleAttribute("data-shown", progress > 0.07);
    }),
  );

  if (still) return;

  // Report: the plane on the route map flies from CM to DE over the whole page.
  each<HTMLElement>(".route-plane", (el) =>
    scroll(animate(el, { offsetDistance: ["0%", "100%"] }, linear)),
  );

  // Parallax: the photo drifts inside its frame; phones in a row drift apart (wide screens).
  each<HTMLElement>(".px-media", (el) =>
    scroll(
      animate(
        el,
        { transform: ["translateY(-7%) scale(1.14)", "translateY(7%) scale(1.14)"] },
        linear,
      ),
      { target: el, offset: [...COVER] },
    ),
  );
  if (window.matchMedia("(min-width: 1024px)").matches) {
    each<HTMLElement>(".px-up", (el) =>
      scroll(animate(el, { transform: ["translateY(60px)", "translateY(-60px)"] }, linear), {
        target: el,
        offset: [...COVER],
      }),
    );
    each<HTMLElement>(".px-down", (el) =>
      scroll(animate(el, { transform: ["translateY(-30px)", "translateY(30px)"] }, linear), {
        target: el,
        offset: [...COVER],
      }),
    );
  }

  // A big sentence inks in from grey to black as you read it.
  each<HTMLElement>(".read-on", (el) =>
    scroll(animate(el, { backgroundPosition: ["100% 0%", "0% 0%"] }, linear), {
      target: el,
      offset: ["start 0.85", "end 0.5"],
    }),
  );

  /** Writes a section's scroll progress to --p; its CSS lights the stops from it. */
  const progressVar = (el: HTMLElement, offset: readonly string[]) =>
    scroll((p: number) => el.style.setProperty("--p", p.toFixed(4)), {
      target: el,
      offset: [...offset] as never,
    });

  // Home flight plan, desktop: the plane circles the orbit between 18 % and 72 % of the way.
  each<HTMLElement>(".orbit", (orbit) => {
    const stops: Stop[] = [progressVar(orbit, COVER)];
    const plane = orbit.querySelector<HTMLElement>(".orbit-plane");
    if (plane) {
      const at = [0, 0.283, 0.567, 0.85, 1];
      const distance = withinRange(["0%", "25%", "50%", "75%", "75%"], at, 0.18, 0.72);
      const size = withinRange(
        ["scale(1)", "scale(0.62)", "scale(1)", "scale(1.45)", "scale(1.45)"],
        at,
        0.18,
        0.72,
      );
      stops.push(
        scroll(
          animate(
            plane,
            { offsetDistance: distance.values, transform: size.values },
            { ease: "linear", times: distance.times },
          ),
          { target: orbit, offset: [...COVER] },
        ),
      );
    }
    return stops;
  });

  // Home flight plan, phones: the plane drops down the track between 25 % and 75 %.
  each<HTMLElement>(".vtrack", (track) => {
    const stops: Stop[] = [progressVar(track, COVER)];
    const plane = track.querySelector<HTMLElement>(".vplane");
    if (plane) {
      const drop = withinRange(
        [
          "translateY(0px)",
          "translateY(180px)",
          "translateY(360px)",
          "translateY(540px)",
          "translateY(540px)",
        ],
        [0, 0.283, 0.567, 0.85, 1],
        0.25,
        0.75,
      );
      stops.push(
        scroll(animate(plane, { transform: drop.values }, { ease: "linear", times: drop.times }), {
          target: track,
          offset: [...COVER],
        }),
      );
    }
    return stops;
  });

  // Process cockpit: progress through the four stops while they fill the screen.
  each<HTMLElement>(".proc", (proc) => {
    const stops: Stop[] = [progressVar(proc, CONTAIN)];
    const stepTimes = [0, 0.22, 0.48, 0.74, 1];
    proc
      .querySelectorAll<HTMLElement>(".pplane")
      .forEach((plane) =>
        stops.push(
          scroll(
            animate(
              plane,
              { top: ["0%", "33.3%", "66.7%", "100%", "100%"] },
              { ease: "linear", times: stepTimes },
            ),
            { target: proc, offset: [...CONTAIN] },
          ),
        ),
      );
    proc.querySelectorAll<HTMLElement>(".pfill").forEach((fill) =>
      stops.push(
        scroll(
          animate(
            fill,
            {
              transform: ["scaleY(0)", "scaleY(0.333)", "scaleY(0.667)", "scaleY(1)", "scaleY(1)"],
            },
            { ease: "linear", times: stepTimes },
          ),
          { target: proc, offset: [...CONTAIN] },
        ),
      ),
    );
    proc.querySelectorAll<HTMLElement>(".pfillx").forEach((fill) =>
      stops.push(
        scroll(animate(fill, { transform: ["scaleX(0)", "scaleX(1)"] }, linear), {
          target: proc,
          offset: [...CONTAIN],
        }),
      ),
    );
    return stops;
  });
}

/**
 * Every scroll animation on the site, run with Motion (Framer Motion's engine) from one place.
 * `animate` comes from "motion/mini" (browser-native animations, ~3 kB) instead of the full
 * engine; together with `inView` and `scroll` that's about 10 kB gzipped.
 *
 *
 * 1. Reveals: elements marked .rv, .rv-left, .rv-wipe, .rv-scale, .rv-line, .rv-flap or .rv-tilt
 *    animate in once, the first time they scroll into view (`inView` + `animate`). They're
 *    plain classes, so server components need no client code to use them.
 * 2. Scroll-linked effects (`scroll`): the header runway, the back-to-top frame, parallax, the
 *    report's plane, the sentence that inks in, the home flight plan and the process cockpit.
 * 3. New page, top of the page: after a link click (not Back/Forward, not a #link), the window
 *    jumps to the top instantly, so the next page always starts at its hero.
 *
 * It re-runs after every navigation, and watches the page for content that streams in later.
 * Visitors who prefer reduced motion get no reveals or moving parts; only the progress
 * indicators (runway, back-to-top) follow the scroll. Renders nothing.
 */
export function MotionEffects() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const backOrForward = useRef(false);

  useEffect(() => {
    const onPop = () => {
      backOrForward.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    // 3. Start the new page at the top (the browser restores the position on Back/Forward).
    if (!firstRender.current && !backOrForward.current && !window.location.hash)
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    firstRender.current = false;
    backOrForward.current = false;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stops: Stop[] = [];
    const pending = new Set<HTMLElement>();
    const linked = new Set<Element>();

    const run = () => {
      if (!still) setupReveals(pending, stops);
      setupScrollLinks(linked, stops, still);
    };

    // Wait until the browser is idle: the new page is laid out (and scrolled to the top), and
    // React has finished hydrating it, so the styles set here never clash with React's.
    let cancel = whenIdle(run);

    // Content that streams in after the first render (Suspense) gets the same treatment.
    const observer = new MutationObserver(() => {
      cancel();
      cancel = whenIdle(run);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancel();
      observer.disconnect();
      for (const stop of stops) {
        // Stopping an animation saves its current styles onto the element, which the browser
        // refuses once the element isn't displayed (the page Next.js hides when you leave it).
        // Nothing worth saving there, so carry on: the remaining stops must still run.
        try {
          stop();
        } catch {}
      }
      // Anything still waiting to be revealed (e.g. in the footer) shows again and will be
      // picked up by the next page's run.
      for (const el of pending) clearStyles(el);
    };
  }, [pathname]);

  return null;
}
