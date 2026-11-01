"use client";

import { useSyncExternalStore } from "react";

const MOON = "0011100 0111000 1110000 1110000 1110000 0111000 0011100".split(" ");
const SUN = "1001001 0000000 0011100 1011101 0011100 0000000 1001001".split(" ");

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

function readMode(): boolean {
  return document.documentElement.dataset.mode === "light";
}
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode"] });
  return () => observer.disconnect();
}

/** Dark / light switch: a knob slides behind two LED glyphs, a moon and a sun. */
export function ModeSwitch({
  label,
  hint,
  size = 42,
}: {
  label: string;
  hint: string;
  size?: number;
}) {
  const light = useSyncExternalStore(subscribe, readMode, () => false);

  function toggle() {
    const next = readMode() ? "dark" : "light";
    document.documentElement.dataset.mode = next;
    try {
      localStorage.setItem("mode", next);
    } catch {
      // Private browsing can block storage; the switch still works for this visit.
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label={label}
      title={hint}
      onClick={toggle}
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
