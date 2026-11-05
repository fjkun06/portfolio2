import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { layoutLed } from "@/lib/led";

import { dotsPath, FLIP_ONCE_AFTER, FLIP_STEP, flipDelays, Led } from "./Led";

describe("<Led>", () => {
  it("sizes the SVG from the text width and the pitch", () => {
    const { container } = render(<Led text="FJ" pitch={6} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", "66"); // 11 columns × 6
    expect(svg).toHaveAttribute("height", "42"); // 7 rows × 6
    expect(svg).toHaveAttribute("viewBox", "0 0 66 42");
  });

  it("draws every lit dot in a single path, one round dot per segment", () => {
    const { container } = render(<Led text="I" board={false} />);
    const lit = layoutLed("I").columns.reduce((sum, c) => sum + c.rows.length, 0);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(1);
    expect(paths[0].getAttribute("d")!.match(/M/g)).toHaveLength(lit);
    expect(container.querySelector("circle")).toBeNull();
  });

  it("is hidden from screen readers by default", () => {
    const { container } = render(<Led text="LIVE" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("is announced as an image when given a label", () => {
    render(<Led text="LIVE" label="Status: live" />);
    expect(screen.getByRole("img", { name: "Status: live" })).toBeInTheDocument();
  });

  it("draws the unlit dots with a pattern, unless board is off", () => {
    const withBoard = render(<Led text="A" />);
    expect(withBoard.container.querySelector("pattern")).not.toBeNull();
    withBoard.unmount();
    const without = render(<Led text="A" board={false} />);
    expect(without.container.querySelector("pattern")).toBeNull();
  });

  it("colours the lit dots with the tone's CSS variable", () => {
    const { container } = render(<Led text="A" tone="white" />);
    const group = container.querySelector("svg > g") as SVGGElement;
    expect(group.style.fill).toBe("var(--led-white)");
  });

  it("adds a glow by default and none when glow is off", () => {
    const on = render(<Led text="A" />);
    expect((on.container.querySelector("svg > g") as SVGGElement).style.filter).toContain(
      "drop-shadow",
    );
    on.unmount();
    const off = render(<Led text="A" glow={false} />);
    expect((off.container.querySelector("svg > g") as SVGGElement).style.filter).toBe("");
  });

  it("groups columns with growing delays when animated", () => {
    const { container } = render(<Led text="I" animate delay={100} step={10} />);
    const cols = [...container.querySelectorAll<SVGGElement>(".led-col")];
    expect(cols).toHaveLength(3);
    expect(cols.map((c) => c.style.animationDelay)).toEqual(["110ms", "120ms", "130ms"]);
  });

  it("groups each letter, each turning a step later, when flipping", () => {
    const { container } = render(<Led text="A B" flip="loop" flipDelay={500} />);
    const letters = [...container.querySelectorAll<SVGGElement>(".led-flip")];
    expect(letters).toHaveLength(2); // the space has no dots
    expect(letters.map((l) => l.style.animationDelay)).toEqual(["500ms", `${500 + FLIP_STEP}ms`]);
  });

  it("flips headlines once, a few seconds after loading", () => {
    const { container } = render(<Led text="AB" flip="once" />);
    const letters = [...container.querySelectorAll<SVGGElement>(".led-flip")];
    expect(letters.every((l) => l.classList.contains("once"))).toBe(true);
    expect(letters.map((l) => l.style.animationDelay)).toEqual([
      `${FLIP_ONCE_AFTER}ms`,
      `${FLIP_ONCE_AFTER + FLIP_STEP}ms`,
    ]);
  });

  it("still lights the columns up one by one inside flipping letters", () => {
    const { container } = render(<Led text="II" animate step={10} flip="loop" />);
    const letters = container.querySelectorAll(".led-flip");
    expect(letters).toHaveLength(2);
    expect(letters[1].querySelectorAll(".led-col")).toHaveLength(3);
    expect(container.querySelectorAll(".led-col")).toHaveLength(6);
  });

  it("passes className and style through to the SVG", () => {
    const { container } = render(<Led text="A" className="blink" style={{ width: 20 }} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveClass("led-text", "blink");
    expect(svg.style.width).toBe("20px");
  });
});

describe("dotsPath", () => {
  it("writes one circle (two arcs) per dot, centred in its cell", () => {
    const arcs = "a3.8 3.8 0 1 0 7.6 0a3.8 3.8 0 1 0 -7.6 0";
    expect(dotsPath([{ x: 0, rows: [0, 1] }], 10)).toBe(`M1.2 5${arcs}M1.2 15${arcs}`);
    expect(dotsPath([{ x: 2, rows: [6] }], 3.4)).toBe(
      "M7.21 22.1a1.29 1.29 0 1 0 2.58 0a1.29 1.29 0 1 0 -2.58 0",
    );
  });
});

describe("flipDelays", () => {
  it("starts each line right after the previous line's last letter", () => {
    expect(flipDelays(["AB", "C D", "E"])).toEqual([0, 2 * FLIP_STEP, 4 * FLIP_STEP]);
  });
});
