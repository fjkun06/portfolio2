import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { processContent } from "@/content/process";

import { Cockpit, CockpitStrip } from "./Cockpit";
import { AfterLanding, CarryOn, Stops, fitName } from "./ProcessSections";

const t = processContent.en;

describe("<Cockpit> and <CockpitStrip>", () => {
  it("are hidden from screen readers, since the stops are headings in the page", () => {
    const { container } = render(
      <>
        <Cockpit text={t} />
        <CockpitStrip text={t} />
      </>,
    );
    for (const el of container.children) expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("have one number and one name layer per stop, for CSS to switch between", () => {
    const { container } = render(<CockpitStrip text={t} />);
    expect(container.querySelectorAll(".pq")).toHaveLength(t.stops.length * 2);
    for (let i = 0; i < t.stops.length; i++)
      expect(container.querySelectorAll(`.q${i}`)).toHaveLength(2);
  });
});

describe("fitName", () => {
  it("gives longer names a smaller size", () => {
    expect(parseFloat(fitName("ENREGISTREMENT"))).toBeLessThan(parseFloat(fitName("EN VOL")));
    expect(fitName("EN VOL")).toMatch(/cqi$/);
    expect(fitName("")).toMatch(/^\d/);
  });
});

describe("<Stops>", () => {
  it("lists the four stops in order, each with who does what and the result", () => {
    const { container } = render(<Stops text={t} />);
    const names = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(names).toEqual(t.stops.map((s) => s.name));
    for (const s of t.stops) {
      expect(screen.getByText(s.you)).toBeInTheDocument();
      expect(screen.getByText(s.me)).toBeInTheDocument();
      expect(screen.getByText(s.get)).toBeInTheDocument();
    }
    expect(container.querySelector("[data-scroll-progress].proc")).not.toBeNull();
    expect(container.querySelector("#stop-4")).not.toBeNull();
  });
});

describe("<CarryOn>", () => {
  it("has a checkbox per item that the visitor can tick", async () => {
    const user = userEvent.setup();
    render(<CarryOn text={t.carry} />);
    const boxes = screen.getAllByRole("checkbox");
    expect(boxes).toHaveLength(t.carry.items.length);
    const first = screen.getByRole("checkbox", { name: new RegExp(t.carry.items[0][0]) });
    await user.click(first);
    expect(first).toBeChecked();
  });
});

describe("<AfterLanding>", () => {
  it("shows what happens after launch", () => {
    render(<AfterLanding text={t.after} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(t.after.titleText);
    for (const item of t.after.items) expect(screen.getByText(item.title)).toBeInTheDocument();
  });
});
