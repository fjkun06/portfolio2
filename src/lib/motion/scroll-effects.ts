import { scroll } from "motion";
import { animate } from "motion/mini";

import { along, type Stop, within } from "./presets";

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

function applyEffect(el: HTMLElement, effect: ScrollEffect): Stop {
  const range = effect.offset && through(el, effect.offset);
  if ("keyframes" in effect)
    return scroll(animate(el, effect.keyframes, { ease: "linear" }), range);
  return scroll((progress: number) => effect.onProgress(el, progress), range);
}

/** Sets up `setup` once for every displayed element matching `selector`. */
type Each = (selector: string, setup: (el: HTMLElement) => Stop[]) => void;

/** Where the four stops fall along a flight plan, as a share of the flight (0 to 1). */
const STOPS_AT = [0, 0.283, 0.567, 0.85, 1];

/**
 * Home flight plan: the plane circles the orbit (desktop) or drops down the track (phones).
 * One scroll callback writes the progress to --p (the stops light up from it in CSS) and moves
 * the plane from the same number, so stop and plane never drift apart.
 */
function flightPlan(each: Each) {
  // Desktop: the orbit is pinned while its track scrolls by; the plane flies the lap between
  // 10 % and 90 % of the track (the rest is a short wait at take-off and after landing).
  // It shrinks a little at the far side and grows near you, for a 3D feel.
  each(".orbit-track", (track) => {
    const orbit = track.querySelector<HTMLElement>(".orbit");
    const plane = track.querySelector<HTMLElement>(".orbit-plane");
    if (!orbit || !plane) return [];
    return [
      scroll(
        (p: number) => {
          orbit.style.setProperty("--p", p.toFixed(4));
          const k = within(p, 0.1, 0.9);
          plane.style.offsetDistance = `${along(k, STOPS_AT, [0, 25, 50, 75, 75]).toFixed(3)}%`;
          plane.style.transform = `scale(${along(k, STOPS_AT, [1, 0.82, 1, 1.2, 1.2]).toFixed(4)})`;
        },
        through(track, CONTAIN),
      ),
    ];
  });

  // Phones: down the track between 25 % and 75 % of its way through the screen.
  each(".vtrack", (track) => {
    const plane = track.querySelector<HTMLElement>(".vplane");
    return [
      scroll(
        (p: number) => {
          track.style.setProperty("--p", p.toFixed(4));
          if (plane) {
            const y = along(within(p, 0.25, 0.75), STOPS_AT, [0, 180, 360, 540, 540]);
            plane.style.transform = `translateY(${y.toFixed(1)}px)`;
          }
        },
        through(track, COVER),
      ),
    ];
  });
}

/**
 * Process cockpit: progress through the four stops while they fill the screen. As for the
 * flight plan, one callback writes --p (the stop names and numbers switch from it in CSS) and
 * moves the planes and fill lines from the same number.
 */
function processCockpit(each: Each) {
  const steps = [0, 0.22, 0.48, 0.74, 1];
  each(".proc", (proc) => {
    const all = (selector: string) => [...proc.querySelectorAll<HTMLElement>(selector)];
    const planes = all(".pplane");
    const fills = all(".pfill");
    const bars = all(".pfillx");
    return [
      scroll(
        (p: number) => {
          proc.style.setProperty("--p", p.toFixed(4));
          const top = along(p, steps, [0, 33.3, 66.7, 100, 100]);
          const fill = along(p, steps, [0, 0.333, 0.667, 1, 1]);
          for (const el of planes) el.style.top = `${top.toFixed(2)}%`;
          for (const el of fills) el.style.transform = `scaleY(${fill.toFixed(4)})`;
          for (const el of bars) el.style.transform = `scaleX(${p.toFixed(4)})`;
        },
        through(proc, CONTAIN),
      ),
    ];
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
