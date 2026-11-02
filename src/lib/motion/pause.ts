/**
 * "Pause animations": the visitor's switch for everything that moves on its own for more than a
 * few seconds (the footer sign, the planes on the flight lines and the route map, the marquee,
 * blinking LEDs, the home headline's language rotation). WCAG 2.2.2 asks for a way to stop
 * such motion; reduced-motion visitors get it stopped anyway.
 *
 * The choice is kept in localStorage and set on <html> as data-motion="paused" before the first
 * paint (see BOOT in SiteDocument), so CSS can switch the loops off (globals.css).
 */

/** localStorage key; the value is "paused" while animations are paused. */
export const PAUSE_KEY = "motion";

export function isPaused(): boolean {
  return document.documentElement.dataset.motion === "paused";
}

export function setPaused(paused: boolean) {
  const html = document.documentElement;
  if (paused) html.dataset.motion = "paused";
  else delete html.dataset.motion;
  try {
    if (paused) localStorage.setItem(PAUSE_KEY, "paused");
    else localStorage.removeItem(PAUSE_KEY);
  } catch {
    // Private browsing can block storage; the switch still works for this visit.
  }
}

/** Calls `onChange` whenever the choice changes, e.g. from the footer switch. */
export function subscribePaused(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion"],
  });
  return () => observer.disconnect();
}
