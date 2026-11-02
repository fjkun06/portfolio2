"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import type { Stop } from "@/lib/motion/presets";
import { clearStyles, setupReveals } from "@/lib/motion/reveals";
import { setupScrollEffects } from "@/lib/motion/scroll-effects";

/** Runs `fn` when the browser is idle (or after a short delay where that isn't supported). */
function whenIdle(fn: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(fn, { timeout: 600 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 150);
  return () => clearTimeout(id);
}

/**
 * Every scroll animation on the site, run with Motion from one place (~10 kB gzipped).
 * Renders nothing. After every navigation it:
 *
 * 1. starts the new page at the top after a link click (not Back/Forward, not a #link);
 * 2. sets up the reveals (.rv, .rv-left…, see lib/motion/reveals.ts);
 * 3. sets up the scroll-linked effects (lib/motion/scroll-effects.ts).
 *
 * It also watches the page for content that streams in later. Visitors who prefer reduced
 * motion get only the progress indicators (runway, back-to-top).
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
    // The browser restores the position itself on Back/Forward.
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
      setupScrollEffects(linked, stops, still);
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
