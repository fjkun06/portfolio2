import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const motion = vi.hoisted(() => ({
  inView: vi.fn(() => () => {}),
  scroll: vi.fn(() => () => {}),
  animate: vi.fn(() => Promise.resolve()),
}));
vi.mock("motion", () => motion);
vi.mock("motion/mini", () => ({ animate: motion.animate }));

const nav = vi.hoisted(() => ({ pathname: "/en" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

import { MotionEffects } from "./MotionEffects";

/** Waits for the setup, which runs once the browser is idle (a short timer in jsdom). */
const nextFrame = () => act(() => new Promise((r) => setTimeout(r, 200)));

function placed(className: string, top: number) {
  const el = document.createElement("div");
  el.className = className;
  el.getBoundingClientRect = () => ({ top, height: 50 }) as DOMRect;
  el.getClientRects = () => [{}] as unknown as DOMRectList;
  document.body.append(el);
  return el;
}

describe("<MotionEffects>", () => {
  beforeEach(() => {
    nav.pathname = "/en";
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    window.scrollTo = vi.fn() as never;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    document.body.innerHTML = "";
    window.location.hash = "";
  });

  it("starts a new page at the top, but not on first load", () => {
    const { rerender } = render(<MotionEffects />);
    expect(window.scrollTo).not.toHaveBeenCalled();
    nav.pathname = "/en/work";
    rerender(<MotionEffects />);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
  });

  it("leaves the position alone on Back/Forward and for #links", () => {
    const { rerender } = render(<MotionEffects />);
    window.dispatchEvent(new PopStateEvent("popstate"));
    nav.pathname = "/en/work";
    rerender(<MotionEffects />);
    window.location.hash = "#privacy";
    nav.pathname = "/en/legal";
    rerender(<MotionEffects />);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("hides only reveals below the fold and hands them to inView", async () => {
    const onScreen = placed("rv", 100);
    const below = placed("rv", 5000);
    render(<MotionEffects />);
    await nextFrame();
    expect(onScreen.style.opacity).toBe("");
    expect(below.style.opacity).toBe("0");
    expect(motion.inView).toHaveBeenCalledWith([below], expect.any(Function), expect.any(Object));
  });

  it("animates a reveal in when it enters the view", async () => {
    const below = placed("rv-left", 5000);
    render(<MotionEffects />);
    await nextFrame();
    const onEnter = (motion.inView.mock.calls[0] as unknown[])[1] as (el: Element) => void;
    onEnter(below);
    expect(motion.animate).toHaveBeenCalledWith(
      below,
      { opacity: [0, 1], transform: ["translateX(-40px)", "translateX(0px)"] },
      expect.objectContaining({ duration: 0.7 }),
    );
  });

  it("does nothing but the progress indicators for visitors who prefer reduced motion", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const below = placed("rv", 5000);
    placed("runway-fill", 0);
    placed("px-media", 5000);
    render(<MotionEffects />);
    await nextFrame();
    expect(below.style.opacity).toBe("");
    expect(motion.inView).not.toHaveBeenCalled();
    expect(motion.scroll).toHaveBeenCalledTimes(1); // the runway only
  });
});
