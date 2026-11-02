import { afterEach, describe, expect, it, vi } from "vitest";

const motion = vi.hoisted(() => ({ inView: vi.fn(() => () => {}) }));
vi.mock("motion", () => motion);

import { setupFlipSigns } from "./flip-signs";

describe("setupFlipSigns", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("flips a sign only while it's on screen", () => {
    document.body.innerHTML = `<span class="flip-sign"></span>`;
    const sign = document.querySelector(".flip-sign")!;
    setupFlipSigns(new Set(), []);
    const onEnter = (motion.inView.mock.calls[0] as unknown[])[1] as (el: Element) => () => void;
    const onLeave = onEnter(sign);
    expect(sign).toHaveAttribute("data-flipping");
    onLeave();
    expect(sign).not.toHaveAttribute("data-flipping");
  });

  it("sets each sign up once, however often it runs", () => {
    document.body.innerHTML = `<span class="flip-sign"></span>`;
    const linked = new Set<Element>();
    const stops: (() => void)[] = [];
    setupFlipSigns(linked, stops);
    setupFlipSigns(linked, stops);
    expect(motion.inView).toHaveBeenCalledTimes(1);
    expect(stops).toHaveLength(1);
  });
});
