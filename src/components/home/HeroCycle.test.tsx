import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CYCLE_MS, HeroCycle } from "./HeroCycle";

const variants = [
  { lang: "en" as const, word: "DEPARTURES", headline: <p>English headline</p> },
  { lang: "fr" as const, word: "DÉPARTS", headline: <p>French headline</p> },
  { lang: "de" as const, word: "ABFLUG", headline: <p>German headline</p> },
];

function prefersReducedMotion(value: boolean) {
  vi.stubGlobal("matchMedia", () => ({ matches: value }));
}

const visible = () =>
  variants.filter(
    (v) =>
      !screen
        .getByText(
          `${v.lang === "en" ? "English" : v.lang === "fr" ? "French" : "German"} headline`,
        )
        .closest('[data-active="false"]'),
  );

describe("<HeroCycle>", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("starts with the page's language and lights its board word", () => {
    prefersReducedMotion(false);
    render(<HeroCycle variants={variants} start="fr" />);
    expect(visible().map((v) => v.lang)).toEqual(["fr"]);
    expect(screen.getByText("DÉPARTS").style.color).toBe("var(--led)");
    expect(screen.getByText("DEPARTURES").style.color).toBe("var(--text-off)");
  });

  it("moves to the next language every cycle, and loops", () => {
    prefersReducedMotion(false);
    render(<HeroCycle variants={variants} start="fr" />);
    act(() => vi.advanceTimersByTime(CYCLE_MS));
    expect(visible().map((v) => v.lang)).toEqual(["de"]);
    act(() => vi.advanceTimersByTime(CYCLE_MS));
    expect(visible().map((v) => v.lang)).toEqual(["en"]);
  });

  it("stays put for visitors who prefer reduced motion", () => {
    prefersReducedMotion(true);
    render(<HeroCycle variants={variants} start="en" />);
    act(() => vi.advanceTimersByTime(CYCLE_MS * 3));
    expect(visible().map((v) => v.lang)).toEqual(["en"]);
  });

  it("shows the aside next to the board words", () => {
    prefersReducedMotion(false);
    render(<HeroCycle variants={variants} start="en" aside={<span>Route CM DE</span>} />);
    expect(screen.getByText("Route CM DE")).toBeInTheDocument();
  });
});
