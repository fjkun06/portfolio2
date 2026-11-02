import { inView } from "motion";
import { animate } from "motion/mini";

import {
  EASE,
  hiddenStyle,
  isBelowFold,
  REVEAL_SELECTOR,
  revealOf,
  staggerDelay,
  type Stop,
} from "./presets";

/** Elements revealed once stay revealed, across navigations (the header and footer persist). */
const revealed = new WeakSet<Element>();

/** Inline styles a reveal sets, removed again when it ends so the page's own CSS takes over. */
export function clearStyles(el: HTMLElement) {
  el.style.removeProperty("opacity");
  el.style.removeProperty("transform");
  el.style.removeProperty("clip-path");
  el.style.removeProperty("transform-origin");
}

/**
 * Hides every reveal element that is still below the fold and animates it in once it scrolls
 * into view. Elements already on screen (or above it) are left alone, so nothing visible ever
 * blinks and the first paint is never delayed by JavaScript.
 * Elements waiting to be revealed are kept in `pending`.
 */
export function setupReveals(pending: Set<HTMLElement>, stops: Stop[]) {
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
