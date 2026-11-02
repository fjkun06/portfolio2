import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BackToTop, framePoints } from "./BackToTop";

describe("framePoints", () => {
  const pts = framePoints(64);

  it("puts the same number of dots on each side", () => {
    expect(pts.length % 4).toBe(0);
  });

  it("starts at the top centre and goes clockwise", () => {
    const [x0, y0] = pts[0];
    expect(y0).toBe(5); // top edge
    expect(x0).toBeGreaterThan(25);
    expect(x0).toBeLessThan(40);
    expect(pts[1][0]).toBeGreaterThan(x0); // next dot is further right
  });

  it("keeps every dot inside the button, at the inset", () => {
    for (const [x, y] of pts) {
      expect(x).toBeGreaterThanOrEqual(5);
      expect(x).toBeLessThanOrEqual(59);
      expect(y).toBeGreaterThanOrEqual(5);
      expect(y).toBeLessThanOrEqual(59);
      expect(x === 5 || x === 59 || y === 5 || y === 59).toBe(true);
    }
  });
});

describe("<BackToTop>", () => {
  it("links to the top of the page with an accessible name", () => {
    render(<BackToTop label="Back to top" />);
    expect(screen.getByRole("link", { name: "Back to top" })).toHaveAttribute("href", "#top");
  });

  it("gives each frame dot its share of the scroll", () => {
    const { container } = render(<BackToTop label="Back to top" />);
    const dots = [...container.querySelectorAll<SVGCircleElement>(".totop-dot")];
    expect(dots).toHaveLength(framePoints(64).length);
    expect(dots[0].style.getPropertyValue("--t")).toBe("0.0000");
    const last = Number(dots.at(-1)!.style.getPropertyValue("--t"));
    expect(last).toBeGreaterThan(0.9);
    expect(last).toBeLessThan(1);
  });
});
