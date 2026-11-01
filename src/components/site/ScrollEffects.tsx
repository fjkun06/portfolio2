"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const REVEALS = ".rv, .rv-left, .rv-wipe, .rv-scale, .rv-line, .rv-flap";

/**
 * Fallback for browsers without scroll-driven animations (Firefox today).
 * Chrome, Edge and Safari do everything in CSS and this does nothing there.
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
