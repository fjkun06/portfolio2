import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ScrollEffects, sectionProgress } from "./ScrollEffects";

vi.mock("next/navigation", () => ({ usePathname: () => "/en" }));

/** Pretends the browser does or doesn't support CSS scroll-driven animations. */
function browserSupports(value: boolean) {
  vi.stubGlobal("CSS", { supports: () => value });
}

/** A fake IntersectionObserver that lets the test decide when elements become visible. */
function fakeObserver() {
  const observed: Element[] = [];
  let callback: IntersectionObserverCallback = () => {};
  class Fake {
    constructor(cb: IntersectionObserverCallback) {
      callback = cb;
    }
    observe = (el: Element) => observed.push(el);
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  vi.stubGlobal("IntersectionObserver", Fake);
  return {
    observed,
    show: (el: Element) =>
      callback([{ isIntersecting: true, target: el } as IntersectionObserverEntry], {} as never),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("<ScrollEffects>", () => {
  it("does nothing in browsers with scroll-driven animations", () => {
    browserSupports(true);
    const io = fakeObserver();
    document.body.innerHTML = `<h2 class="rv">Title</h2>`;
    render(<ScrollEffects />);
    expect(document.documentElement).not.toHaveClass("no-sda");
    expect(io.observed).toHaveLength(0);
    expect(document.documentElement.style.getPropertyValue("--scroll")).toBe("");
  });

  it("reveals elements as they come into view in other browsers", () => {
    browserSupports(false);
    const io = fakeObserver();
    document.body.innerHTML = `<h2 class="rv">A</h2><p class="rv-left">B</p><p>not animated</p>`;
    render(<ScrollEffects />);
    expect(document.documentElement).toHaveClass("no-sda");
    expect(io.observed.map((el) => el.textContent)).toEqual(["A", "B"]);
    io.show(io.observed[0]);
    expect(io.observed[0]).toHaveClass("is-in");
    expect(io.observed[1]).not.toHaveClass("is-in");
  });

  it("sets --scroll from 0 at the top to 1 at the bottom", async () => {
    browserSupports(false);
    fakeObserver();
    const root = document.documentElement;
    Object.defineProperty(root, "scrollHeight", { value: 2000, configurable: true });
    Object.defineProperty(root, "clientHeight", { value: 1000, configurable: true });
    root.scrollTop = 0;
    render(<ScrollEffects />);
    expect(root.style.getPropertyValue("--scroll")).toBe("0.0000");

    root.scrollTop = 1000; // scrolled all the way down
    window.dispatchEvent(new Event("scroll"));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    expect(root.style.getPropertyValue("--scroll")).toBe("1.0000");
  });
});

describe("sectionProgress", () => {
  function element(top: number, height: number) {
    const el = document.createElement("div");
    el.getBoundingClientRect = () => ({ top, height }) as DOMRect;
    return el;
  }

  it("goes from 0 (just entering at the bottom) to 1 (just left at the top)", () => {
    vi.stubGlobal("innerHeight", 800);
    expect(sectionProgress(element(800, 400))).toBe("0.0000");
    expect(sectionProgress(element(200, 400))).toBe("0.5000");
    expect(sectionProgress(element(-400, 400))).toBe("1.0000");
  });

  it("stays between 0 and 1 outside the screen", () => {
    vi.stubGlobal("innerHeight", 800);
    expect(sectionProgress(element(2000, 400))).toBe("0.0000");
    expect(sectionProgress(element(-2000, 400))).toBe("1.0000");
  });
});
