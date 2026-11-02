"use client";

import { useSyncExternalStore } from "react";

/** Moon and sun as 7 × 7 LED glyphs, same format as src/lib/led.ts ("1" = lit dot). */
const MOON = "0011100 0111000 1110000 1110000 1110000 0111000 0011100".split(" ");
const SUN = "1001001 0000000 0011100 1011101 0011100 0000000 1001001".split(" ");

/**
 * One glyph: unlit dots in the "off" colour, lit dots in a class whose colour globals.css
 * switches with the mode (`.mode-moon` is lit in dark mode, `.mode-sun` in light mode).
 */
function Glyph({ rows, litClass }: { rows: string[]; litClass: string }) {
  const p = 3.2;
  const dot = (r: number, c: number) => (
    <circle key={`${r}-${c}`} cx={c * p + p / 2} cy={r * p + p / 2} r={p * 0.38} />
  );
  const lit: React.ReactNode[] = [];
  const off: React.ReactNode[] = [];
  rows.forEach((row, r) => [...row].forEach((v, c) => (v === "1" ? lit : off).push(dot(r, c))));
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${7 * p} ${7 * p}`}
      width={7 * p}
      height={7 * p}
      className="block"
    >
      <g style={{ fill: "var(--led-off)" }}>{off}</g>
      <g className={litClass} style={{ filter: "drop-shadow(0 0 2px var(--led-glow))" }}>
        {lit}
      </g>
    </svg>
  );
}

/**
 * The current mode lives in one place: the `data-mode` attribute on <html>.
 * These two functions let React read it and re-render when it changes.
 */
export function readIsLight(): boolean {
  return document.documentElement.dataset.mode === "light";
}
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
  return () => observer.disconnect();
}

/**
 * Flips between dark and light mode and remembers the choice for the next visit.
 * The early script in layout.tsx reads that saved choice before the page is painted.
 */
export function toggleMode(): "dark" | "light" {
  const next = readIsLight() ? "dark" : "light";
  document.documentElement.dataset.mode = next;
  try {
    localStorage.setItem("mode", next);
  } catch {
    // Private browsing can block storage; the switch still works for this visit.
  }
  return next;
}

type ModeSwitchProps = {
  /** Accessible name of the switch, e.g. "Light mode": the switch is "on" in light mode. */
  label: string;
  /** Tooltip on hover, e.g. "Dark or light mode". */
  hint: string;
  /** Height in pixels: 42 in the desktop header, 48 on phones to match the menu button. */
  size?: number;
};

/**
 * Dark / light switch: a knob slides behind two LED glyphs, a moon and a sun.
 *
 * - The look (knob position, which glyph is lit) is pure CSS keyed on `html[data-mode]`,
 *   so it's right from the first paint, before React even loads.
 * - `aria-checked` comes from `useSyncExternalStore`: on the server and during hydration it
 *   assumes dark (no mismatch error), then updates to the real mode immediately after.
 * - Several switches can exist at once (desktop and mobile header); they all watch the same
 *   attribute, so they always agree.
 */
export function ModeSwitch({ label, hint, size = 42 }: ModeSwitchProps) {
  const light = useSyncExternalStore(subscribe, readIsLight, () => false);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label={label}
      title={hint}
      onClick={toggleMode}
      className="mode-switch relative inline-flex flex-none cursor-pointer items-center rounded-lg border border-rule-board bg-board px-1"
      style={{ width: 82, height: size }}
    >
      <span
        aria-hidden="true"
        className="mode-knob absolute top-1 left-1 rounded-[5px] bg-knob"
        style={{ width: 36, height: size - 10 }}
      />
      <span className="relative flex w-9 justify-center">
        <Glyph rows={MOON} litClass="mode-moon" />
      </span>
      <span className="relative flex w-9 justify-center">
        <Glyph rows={SUN} litClass="mode-sun" />
      </span>
    </button>
  );
}
