"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Every class that reveals on scroll. Keep in sync with globals.css. */
export const REVEALS = ".rv, .rv-left, .rv-wipe, .rv-scale, .rv-line, .rv-flap";

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
 *    frame read it.
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

  // Page progress for the runway and the back-to-top frame.
  useEffect(() => {
    if (CSS.supports("animation-timeline: scroll()")) return;
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = root.scrollHeight - root.clientHeight;
      root.style.setProperty("--scroll", max > 0 ? (root.scrollTop / max).toFixed(4) : "0");
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
