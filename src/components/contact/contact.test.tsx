import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { contactContent } from "@/content/contact";

import { AfterCheckIn, StatusBoard } from "./ContactSections";

const t = contactContent.en;

describe("<StatusBoard>", () => {
  it("pairs each label with its LED value, readable by screen readers", () => {
    render(<StatusBoard items={t.status} />);
    const terms = screen.getAllByRole("term").map((el) => el.textContent);
    expect(terms).toEqual(t.status.map(([label]) => label));
    for (const [, value] of t.status)
      expect(screen.getAllByRole("img", { name: value }).length).toBeGreaterThan(0);
  });

  it("makes the first value (desk open) blink", () => {
    const { container } = render(<StatusBoard items={t.status} />);
    const blinking = container.querySelectorAll("svg.blink");
    expect(blinking).toHaveLength(2); // phone and desktop sizes
    for (const svg of blinking) expect(svg).toHaveAttribute("aria-label", t.status[0][1]);
  });
});

describe("<AfterCheckIn>", () => {
  it("lists the three steps in order", () => {
    render(<AfterCheckIn text={t.after} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(t.after.title);
    const steps = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(steps).toEqual(t.after.steps.map(([title]) => title));
  });
});
