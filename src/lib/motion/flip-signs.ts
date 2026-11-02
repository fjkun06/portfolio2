import { inView } from "motion";

import type { Stop } from "./presets";

/**
 * LED signs whose letters flip on a loop (`.flip-sign`, e.g. the footer's NEXT DEPARTURE) only
 * flip while they're on screen: `data-flipping` is set when the sign comes into view and removed
 * when it leaves, and the CSS runs the loop only then (three times at most, see .led-flip).
 * Coming back into view starts it again. Signs already set up are kept in `linked`.
 */
export function setupFlipSigns(linked: Set<Element>, stops: Stop[]) {
  const signs = [...document.querySelectorAll<HTMLElement>(".flip-sign")].filter(
    (el) => !linked.has(el),
  );
  if (!signs.length) return;
  for (const el of signs) linked.add(el);
  stops.push(
    inView(signs, (element) => {
      element.setAttribute("data-flipping", "");
      return () => element.removeAttribute("data-flipping");
    }),
  );
}
