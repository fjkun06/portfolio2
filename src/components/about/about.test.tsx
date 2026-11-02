import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { aboutContent, LANGUAGES, TOOLS } from "@/content/about";

import { FlightLog, Instruments, Languages, Principles, Why } from "./AboutSections";

const t = aboutContent.en;

describe("<Why>", () => {
  it("is a named section with the statement and the background", () => {
    render(<Why text={t.why} />);
    const section = screen.getByRole("region", { name: t.why.label });
    expect(within(section).getByText(t.why.statement)).toBeInTheDocument();
    expect(within(section).getByText(t.why.body)).toBeInTheDocument();
  });
});

describe("<Languages>", () => {
  it("writes each language in itself, marked with its lang attribute", () => {
    render(<Languages text={t.languages} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(t.languages.titleText);
    for (const l of LANGUAGES) {
      expect(screen.getByText(l.name)).toHaveAttribute("lang", l.lang);
      expect(screen.getByText(l.line)).toHaveAttribute("lang", l.lang);
    }
  });
});

describe("<FlightLog>", () => {
  it("lists every entry with a readable year and its note", () => {
    render(<FlightLog text={t.log} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(t.log.entries.length);
    for (const e of t.log.entries) {
      expect(screen.getAllByRole("img", { name: e.year }).length).toBeGreaterThan(0);
      expect(screen.getByText(e.note)).toBeInTheDocument();
    }
  });
});

describe("<Instruments>", () => {
  it("names every tool for screen readers", () => {
    render(<Instruments text={t.tools} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(TOOLS.length);
    for (const tool of TOOLS) expect(screen.getAllByRole("img", { name: tool }).length).toBe(2);
  });
});

describe("<Principles>", () => {
  it("shows the principles as numbered headings", () => {
    render(<Principles text={t.principles} />);
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(t.principles.items.map(([title]) => title));
  });
});
