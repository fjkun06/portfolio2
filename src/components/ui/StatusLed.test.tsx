import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import en from "@/locales/en";

import { StatusLed } from "./StatusLed";

describe("<StatusLed>", () => {
  it("tells screen readers the status in words", () => {
    render(<StatusLed status="LIVE" text={en.status} />);
    expect(screen.getByText("Status: live")).toBeInTheDocument();
  });

  it("blinks while boarding and dims when on hold", () => {
    const boarding = render(<StatusLed status="BOARDING" text={en.status} />);
    expect(boarding.container.querySelector("svg")).toHaveClass("blink");
    boarding.unmount();
    const hold = render(<StatusLed status="ON HOLD" text={en.status} />);
    expect((hold.container.querySelector("svg > g") as SVGGElement).style.fill).toBe(
      "var(--led-dim)",
    );
  });
});
