import { afterEach, describe, expect, it, vi } from "vitest";

const motion = vi.hoisted(() => ({ inView: vi.fn(() => () => {}) }));
vi.mock("motion", () => motion);

import { setupOnScreen } from "./on-screen";

describe("setupOnScreen", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("marks an element only while it's on screen", () => {
    document.body.innerHTML = `<span class="on-screen"></span>`;
    const sign = document.querySelector(".on-screen")!;
    setupOnScreen(new Set(), []);
    const onEnter = (motion.inView.mock.calls[0] as unknown[])[1] as (el: Element) => () => void;
    const onLeave = onEnter(sign);
    expect(sign).toHaveAttribute("data-on-screen");
    onLeave();
    expect(sign).not.toHaveAttribute("data-on-screen");
  });

  it("sets each element up once, however often it runs", () => {
    document.body.innerHTML = `<span class="on-screen"></span>`;
    const linked = new Set<Element>();
    const stops: (() => void)[] = [];
    setupOnScreen(linked, stops);
    setupOnScreen(linked, stops);
    expect(motion.inView).toHaveBeenCalledTimes(1);
    expect(stops).toHaveLength(1);
  });
});
