import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { findProject } from "@/content/projects";
import { herzogReport } from "@/content/reports/herzog";
import en from "@/locales/en";

import { ReportHero } from "./ReportHero";
import { Brief, HomepageShot, Journey, Manifest, NextDeparture, Quote } from "./ReportSections";
import { RouteMap } from "./RouteMap";

vi.mock("next/image", () => import("@/test/next-image-mock"));

const project = findProject("herzog")!;
const report = herzogReport.en;
const text = en.report;

describe("<RouteMap>", () => {
  it("is one described image with a plane following the route", () => {
    const { container } = render(<RouteMap size="desktop" label={text.routeLabel} />);
    expect(screen.getByRole("img", { name: text.routeLabel })).toBeInTheDocument();
    const plane = container.querySelector<HTMLElement>(".route-plane")!;
    expect(plane.style.offsetPath).toContain("path(");
  });
});

describe("<ReportHero>", () => {
  it("names the project, links back and lists the facts", () => {
    render(
      <ReportHero
        project={project}
        report={report}
        text={text}
        status={en.status}
        homeLabel="Home"
        homeHref="/en"
        workHref="/en/work"
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("HERZOG TRAD'");
    expect(screen.getByRole("link", { name: text.allDepartures })).toHaveAttribute(
      "href",
      "/en/work",
    );
    for (const label of Object.values(text.facts))
      expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(report.client)).toBeInTheDocument();
  });
});

describe("report sections", () => {
  it("link the screenshot frame to the live site", () => {
    render(<HomepageShot project={project} text={text} />);
    expect(screen.getByRole("link", { name: text.openSite })).toHaveAttribute(
      "href",
      "https://herzog-translations.com",
    );
    expect(screen.getByRole("img", { name: /herzog-translations\.com homepage/ })).toHaveAttribute(
      "src",
      project.image!.src,
    );
  });

  it("tell the brief with the client and the goal", () => {
    render(<Brief report={report} text={text} />);
    expect(screen.getByText(report.lead)).toHaveClass("read-on");
    expect(screen.getByRole("heading", { name: text.client })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: text.goal })).toBeInTheDocument();
  });

  it("show the four journey steps in order", () => {
    render(<Journey report={report} text={text} />);
    const steps = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(steps).toEqual(report.journey.map((s) => s.step));
  });

  it("list the manifest and the tools", () => {
    render(<Manifest report={report} text={text} />);
    for (const m of report.manifest)
      expect(screen.getByRole("heading", { name: m.title })).toBeInTheDocument();
    for (const tool of report.stack)
      expect(screen.getByRole("img", { name: tool })).toBeInTheDocument();
  });

  it("hide the quote until there is one", () => {
    const { container } = render(<Quote report={report} text={text} />);
    expect(container).toBeEmptyDOMElement();
    render(
      <Quote report={{ ...report, quote: "Great work.", quoteBy: "A. Client" }} text={text} />,
    );
    expect(screen.getByText("Great work.")).toBeInTheDocument();
  });

  it("lead to the next departure", () => {
    const next = findProject("first-trucks")!;
    render(<NextDeparture project={next} href="/en/work#first-trucks" text={text} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/en/work#first-trucks");
    expect(screen.getByText("Next departure, FJ 003")).toBeInTheDocument();
  });
});
