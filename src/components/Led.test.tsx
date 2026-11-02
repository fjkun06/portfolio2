import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { layoutLed } from "@/lib/led";

import { Led } from "./Led";

describe("<Led>", () => {
  it("sizes the SVG from the text width and the pitch", () => {
    const { container } = render(<Led text="FJ" pitch={6} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", "66"); // 11 columns × 6
    expect(svg).toHaveAttribute("height", "42"); // 7 rows × 6
    expect(svg).toHaveAttribute("viewBox", "0 0 66 42");
  });

  it("draws one circle per lit dot", () => {
    const { container } = render(<Led text="I" board={false} />);
    const lit = layoutLed("I").columns.reduce((sum, c) => sum + c.rows.length, 0);
    expect(container.querySelectorAll("circle")).toHaveLength(lit);
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

  it("passes className and style through to the SVG", () => {
    const { container } = render(<Led text="A" className="blink" style={{ width: 20 }} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveClass("led-text", "blink");
    expect(svg.style.width).toBe("20px");
  });
});
