import { describe, expect, it } from "vitest";

import {
  hiddenStyle,
  isBelowFold,
  REVEAL_SELECTOR,
  REVEALS,
  revealOf,
  staggerDelay,
  withinRange,
} from "./presets";

describe("REVEALS", () => {
  it("animates the same properties it starts from", () => {
    for (const [name, r] of Object.entries(REVEALS))
      expect(Object.keys(r.to).sort(), name).toEqual(Object.keys(r.from).sort());
  });

  it("is matched by one selector", () => {
    expect(REVEAL_SELECTOR).toBe(
      ".rv, .rv-left, .rv-wipe, .rv-scale, .rv-line, .rv-flap, .rv-tilt",
    );
  });
});

describe("hiddenStyle", () => {
  it("never hides an element by clipping or scaling it to nothing", () => {
    // The browser can't tell when a zero-size element scrolls into view.
    for (const [name, r] of Object.entries(REVEALS)) {
      const hidden = hiddenStyle(r);
      expect(hidden.clipPath, name).toBeUndefined();
      expect(hidden.transform ?? "", name).not.toMatch(/scale[XY]?\(0\)/);
    }
  });
});

describe("revealOf", () => {
  it("finds the reveal from the element's marker class", () => {
    const el = document.createElement("p");
    el.className = "mt-4 rv-left text-lg";
    expect(revealOf(el)).toBe(REVEALS["rv-left"]);
    expect(revealOf(document.createElement("p"))).toBeUndefined();
  });
});

describe("staggerDelay", () => {
  it("delays each element of a batch a little more, up to a cap", () => {
    expect([0, 1, 2, 3].map((i) => staggerDelay(i))).toEqual([0, 0.07, 0.14, 0.21]);
    expect(staggerDelay(20)).toBe(0.35);
  });
});

describe("withinRange", () => {
  it("holds the first and last frames outside the range", () => {
    expect(withinRange(["0%", "75%"], [0, 1], 0.18, 0.72)).toEqual({
      values: ["0%", "0%", "75%", "75%"],
      times: [0, 0.18, 0.72, 1],
    });
  });

  it("spreads inner keyframes across the range", () => {
    expect(withinRange([0, 1, 2], [0, 0.5, 1], 0.2, 0.6).times).toEqual([0, 0.2, 0.4, 0.6, 1]);
  });
});

describe("isBelowFold", () => {
  it("is true only for visible elements that start below the screen", () => {
    expect(isBelowFold({ top: 1200, height: 100 }, 900)).toBe(true);
    expect(isBelowFold({ top: 300, height: 100 }, 900)).toBe(false); // on screen
    expect(isBelowFold({ top: -500, height: 100 }, 900)).toBe(false); // already scrolled past
    expect(isBelowFold({ top: 1200, height: 0 }, 900)).toBe(false); // not displayed
  });
});
