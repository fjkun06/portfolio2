import { inView } from "motion";

import type { Stop } from "./presets";

/**
 * Looping animations that should only run while you can see them (`.on-screen`): the footer's
 * flipping NEXT DEPARTURE sign, the planes on the flight lines. `data-on-screen` is set when the
 * element comes into view and removed when it leaves; its CSS animates only while it's there,
 * so coming back into view starts it again. Elements already set up are kept in `linked`.
 */
export function setupOnScreen(linked: Set<Element>, stops: Stop[]) {
  const elements = [...document.querySelectorAll<HTMLElement>(".on-screen")].filter(
    (el) => !linked.has(el),
  );
  if (!elements.length) return;
  for (const el of elements) linked.add(el);
  stops.push(
    inView(elements, (element) => {
      element.setAttribute("data-on-screen", "");
      return () => element.removeAttribute("data-on-screen");
    }),
  );
}
