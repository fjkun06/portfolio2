"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Elements whose own scroll progress drives an animation (the flight plan). */
export const PROGRESS = "[data-scroll-progress]";

/**
 * How far an element has travelled through the viewport: 0 when its top edge appears at the
 * bottom of the screen, 1 when its bottom edge leaves at the top. Same as CSS `view()` "cover".
 */
export function sectionProgress(element: Element): string {
  const { top, height } = element.getBoundingClientRect();
  const viewport = window.innerHeight;
  const progress = (viewport - top) / (viewport + height);
  return Math.min(1, Math.max(0, progress)).toFixed(4);
}

/** Every class that reveals on scroll. Keep in sync with globals.css. */
export const REVEALS = ".rv, .rv-left, .rv-wipe, .rv-scale, .rv-line, .rv-flap, .rv-tilt";

/**
 * Fallback for browsers without CSS scroll-driven animations (Firefox today).
 * Chrome, Edge and Safari animate everything in CSS, and this component does nothing there.
 *
 * Two jobs, each switched on only when the browser lacks the matching CSS feature:
 *
 * 1. Reveals (`animation-timeline: view()` missing): the early script in layout.tsx has already
 *    put `.no-sda` on <html>, which hides `.rv`, `.rv-left`… elements. An IntersectionObserver
 *    adds `.is-in` to each one as it scrolls into view, and CSS transitions it in. Each element
 *    is revealed once and then left alone.
 *
 * 2. Page progress (`animation-timeline: scroll()` missing): sets `--scroll` on <html>, from 0 at
 *    the top to 1 at the bottom, at most once per frame. The header runway and the back-to-top
 *    frame read it. Elements marked `data-scroll-progress` (the flight plan) also get their own
 *    `--p`, which moves the plane. That part stays off when the visitor asks for reduced motion.
 *
 * Both re-run after a client-side navigation (`pathname` changes) to pick up the new page.
 * Renders nothing.
 */
export function ScrollEffects() {
  const pathname = usePathname();

  // Reveals: show each element once it enters the viewport.
  useEffect(() => {
    if (CSS.supports("animation-timeline: view()")) return;
    document.documentElement.classList.add("no-sda");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll(REVEALS).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // Page progress for the runway and the back-to-top frame, and section progress for the
  // flight plan.
  useEffect(() => {
    if (CSS.supports("animation-timeline: scroll()")) return;
    const root = document.documentElement;
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const sections = still ? [] : [...document.querySelectorAll<HTMLElement>(PROGRESS)];
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = root.scrollHeight - root.clientHeight;
      root.style.setProperty("--scroll", max > 0 ? (root.scrollTop / max).toFixed(4) : "0");
      for (const section of sections) section.style.setProperty("--p", sectionProgress(section));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
