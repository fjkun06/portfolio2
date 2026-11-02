import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FlightLine } from "./FlightLine";

describe("<FlightLine>", () => {
  it("is a drawn, decorative line whose plane flies only while it's on screen", () => {
    const { container } = render(<FlightLine />);
    const line = container.firstElementChild!;
    expect(line).toHaveAttribute("aria-hidden", "true");
    expect(line).toHaveClass("on-screen");
    expect(line).not.toHaveClass("rv-line"); // the line no longer draws itself in
    expect(line.querySelector(".flight-plane svg")).not.toBeNull();
  });

  it("puts each line's plane a step further into its flight", () => {
    const planes = [0, 2].map((i) =>
      render(<FlightLine index={i} />).container.querySelector<HTMLElement>(".flight-plane")!,
    );
    expect(planes.map((p) => p.style.animationDelay)).toEqual(["0s", "-2.8s"]);
  });
});
