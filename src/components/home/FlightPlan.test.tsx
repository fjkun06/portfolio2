import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import en from "@/locales/en";

import { FlightPlan } from "./FlightPlan";

describe("<FlightPlan>", () => {
  it("lists the four stops in both layouts", () => {
    render(<FlightPlan text={en.home.plan} processHref="/en/process" />);
    for (const stop of en.home.plan.stops)
      expect(screen.getAllByRole("heading", { name: stop.name, level: 3 })).toHaveLength(2);
  });

  it("marks both layouts for the scroll progress fallback", () => {
    const { container } = render(<FlightPlan text={en.home.plan} processHref="/en/process" />);
    expect(container.querySelectorAll("[data-scroll-progress]")).toHaveLength(2);
    expect(container.querySelector(".orbit")).not.toBeNull();
    expect(container.querySelector(".vtrack")).not.toBeNull();
  });

  it("puts a marker on the route for every stop", () => {
    const { container } = render(<FlightPlan text={en.home.plan} processHref="/en/process" />);
    for (let i = 0; i < 4; i++)
      expect(container.querySelectorAll(`.stop-mark.s${i}`)).toHaveLength(2);
  });

  it("links to the Process page", () => {
    render(<FlightPlan text={en.home.plan} processHref="/en/process" />);
    expect(screen.getByRole("link", { name: en.home.plan.more })).toHaveAttribute(
      "href",
      "/en/process",
    );
  });
});
