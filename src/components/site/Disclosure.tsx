"use client";

import { animate } from "motion/mini";
import { useRef, type MouseEvent, type ReactNode } from "react";

import { EASE } from "@/lib/motion/presets";

/**
 * A native <details> row whose content slides open and closed (Motion animates its height and
 * fades it). It stays a real <details>: keyboard, screen readers and find-in-page work as usual,
 * and without JavaScript or with reduced motion it simply opens and closes at once.
 */
export function Disclosure({
  className,
  summary,
  summaryClassName,
  children,
}: {
  className?: string;
  summary: ReactNode;
  summaryClassName?: string;
  children: ReactNode;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const running = useRef<ReturnType<typeof animate> | null>(null);
  const closing = useRef(false);

  function toggle(event: MouseEvent) {
    const el = details.current;
    const body = panel.current;
    if (!el || !body || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();

    // A second click while it moves turns it around from where it is.
    const opening = !el.open || closing.current;
    running.current?.stop();
    const from = el.open ? body.getBoundingClientRect().height : 0;
    const fromOpacity = el.open ? Number(getComputedStyle(body).opacity) : 0;
    el.open = true;
    closing.current = !opening;
    // Stays [open] until the content has slid shut; CSS can show the closed state right away.
    el.toggleAttribute("data-closing", !opening);

    body.style.overflow = "hidden";
    const controls = animate(
      body,
      {
        height: [`${from}px`, `${opening ? body.scrollHeight : 0}px`],
        opacity: [fromOpacity, opening ? 1 : 0],
      },
      { duration: opening ? 0.38 : 0.3, ease: EASE },
    );
    running.current = controls;
    controls.then(() => {
      if (running.current !== controls) return;
      running.current = null;
      if (!opening) el.open = false;
      closing.current = false;
      el.removeAttribute("data-closing");
      body.style.removeProperty("height");
      body.style.removeProperty("opacity");
      body.style.removeProperty("overflow");
    });
  }

  return (
    <details ref={details} className={className}>
      <summary className={summaryClassName} onClick={toggle}>
        {summary}
      </summary>
      <div ref={panel}>{children}</div>
    </details>
  );
}
