import { scroll } from "motion";
import { animate } from "motion/mini";

import { type Stop, withinRange } from "./presets";

/** Section passing through the screen: from its top at the bottom edge to its bottom at the top. */
const COVER = ["start end", "end start"] as const;
/** Section filling the screen: from its top at the top edge to its bottom at the bottom edge. */
const CONTAIN = ["start start", "end end"] as const;

type Offset = readonly string[];

type ScrollEffect = {
  selector: string;
  /** Scroll range of the element itself through the screen. Left out: the whole page's scroll. */
  offset?: Offset;
  /** Only where this media query matches. */
  media?: string;
  /** Kept for visitors who prefer reduced motion: it shows progress, it doesn't move things. */
  essential?: boolean;
} & (
  | { keyframes: Record<string, string[]> }
  | { onProgress: (el: HTMLElement, progress: number) => void }
);

/** One entry per simple scroll-linked effect. Keyframes run linearly over the scroll range. */
const SCROLL_EFFECTS: ScrollEffect[] = [
  // Header runway: fills with the page's scroll.
  {
    selector: ".runway-fill",
    keyframes: { transform: ["scaleX(0)", "scaleX(1)"] },
    essential: true,
  },
  // Back-to-top: fades in after ~10 % and its frame of dots lights up (CSS reads --scroll).
  {
    selector: ".totop",
    onProgress: (el, progress) => {
      el.style.setProperty("--scroll", progress.toFixed(4));
      el.toggleAttribute("data-shown", progress > 0.07);
    },
    essential: true,
  },
  // Report: the plane on the route map flies from CM to DE over the whole page.
  { selector: ".route-plane", keyframes: { offsetDistance: ["0%", "100%"] } },
  // Parallax: the screenshot drifts inside its frame. Enlarged just enough (8 %) to cover the
  // ±3.5 % drift, so it stays sharp and loses as little of its edges as possible.
  {
    selector: ".px-media",
    keyframes: { transform: ["translateY(-3.5%) scale(1.08)", "translateY(3.5%) scale(1.08)"] },
    offset: COVER,
  },
  // Phones in a row drift apart (wide screens only).
  {
    selector: ".px-up",
    keyframes: { transform: ["translateY(60px)", "translateY(-60px)"] },
    offset: COVER,
    media: "(min-width: 1024px)",
  },
  {
    selector: ".px-down",
    keyframes: { transform: ["translateY(-30px)", "translateY(30px)"] },
    offset: COVER,
    media: "(min-width: 1024px)",
  },
  // A big sentence inks in from grey to black as you read it.
  {
    selector: ".read-on",
    keyframes: { backgroundPosition: ["100% 0%", "0% 0%"] },
    offset: ["start 0.85", "end 0.5"],
  },
];

/** Motion's scroll options: follow `target` through the screen over `offset`. */
const through = (target: HTMLElement, offset: Offset) => ({
  target,
  offset: [...offset] as never,
});

/** Links a keyframe animation to the scroll over `offset` of `target`. */
const scrollAnimate = (
  el: HTMLElement,
  keyframes: Record<string, string[]>,
  target: HTMLElement,
  offset: Offset,
  times?: number[],
) => scroll(animate(el, keyframes, { ease: "linear", times }), through(target, offset));

/** Writes a section's scroll progress to --p; its CSS lights the stops from it. */
const progressVar = (el: HTMLElement, offset: Offset) =>
  scroll((p: number) => el.style.setProperty("--p", p.toFixed(4)), through(el, offset));

function applyEffect(el: HTMLElement, effect: ScrollEffect): Stop {
  const range = effect.offset && through(el, effect.offset);
  if ("keyframes" in effect)
    return scroll(animate(el, effect.keyframes, { ease: "linear" }), range);
  return scroll((progress: number) => effect.onProgress(el, progress), range);
}

/** Sets up `setup` once for every displayed element matching `selector`. */
type Each = (selector: string, setup: (el: HTMLElement) => Stop[]) => void;

/** Home flight plan: the plane circles the orbit (desktop) or drops down the track (phones). */
function flightPlan(each: Each) {
  // Desktop: around the orbit between 18 % and 72 % of the way.
  each(".orbit", (orbit) => {
    const stops = [progressVar(orbit, COVER)];
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
        scrollAnimate(
          plane,
          { offsetDistance: distance.values, transform: size.values },
          orbit,
          COVER,
          distance.times,
        ),
      );
    }
    return stops;
  });

  // Phones: down the track between 25 % and 75 %.
  each(".vtrack", (track) => {
    const stops = [progressVar(track, COVER)];
    const plane = track.querySelector<HTMLElement>(".vplane");
    if (plane) {
      const drop = withinRange(
        [0, 180, 360, 540, 540].map((y) => `translateY(${y}px)`),
        [0, 0.283, 0.567, 0.85, 1],
        0.25,
        0.75,
      );
      stops.push(scrollAnimate(plane, { transform: drop.values }, track, COVER, drop.times));
    }
    return stops;
  });
}

/** Process cockpit: progress through the four stops while they fill the screen. */
function processCockpit(each: Each) {
  each(".proc", (proc) => {
    const stops = [progressVar(proc, CONTAIN)];
    const stepTimes = [0, 0.22, 0.48, 0.74, 1];
    const all = (selector: string) => proc.querySelectorAll<HTMLElement>(selector);
    all(".pplane").forEach((plane) =>
      stops.push(
        scrollAnimate(
          plane,
          { top: ["0%", "33.3%", "66.7%", "100%", "100%"] },
          proc,
          CONTAIN,
          stepTimes,
        ),
      ),
    );
    all(".pfill").forEach((fill) =>
      stops.push(
        scrollAnimate(
          fill,
          { transform: ["scaleY(0)", "scaleY(0.333)", "scaleY(0.667)", "scaleY(1)", "scaleY(1)"] },
          proc,
          CONTAIN,
          stepTimes,
        ),
      ),
    );
    all(".pfillx").forEach((fill) =>
      stops.push(scrollAnimate(fill, { transform: ["scaleX(0)", "scaleX(1)"] }, proc, CONTAIN)),
    );
    return stops;
  });
}

/**
 * Animations tied to the scroll position (Motion's `scroll`). Where the browser supports
 * scroll timelines, Motion hands transform and opacity animations to the compositor, so they
 * stay smooth even while the page is busy. Elements already set up are kept in `linked`.
 * With `still` (reduced motion) only the essential progress indicators run.
 */
export function setupScrollEffects(linked: Set<Element>, stops: Stop[], still: boolean) {
  const each: Each = (selector, setup) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      // Skip what isn't displayed: other screen sizes' layouts, and pages Next.js keeps
      // hidden in the background after you leave them. They're set up when they show again.
      if (linked.has(el) || el.getClientRects().length === 0) return;
      linked.add(el);
      stops.push(...setup(el));
    });
  };

  for (const effect of SCROLL_EFFECTS) {
    if (still && !effect.essential) continue;
    if (effect.media && !window.matchMedia(effect.media).matches) continue;
    each(effect.selector, (el) => [applyEffect(el, effect)]);
  }
  if (still) return;
  flightPlan(each);
  processCockpit(each);
}
