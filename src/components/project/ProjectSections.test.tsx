import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { findProject } from "@/content/projects";
import en from "@/locales/en";

import { FlightStatus, ProjectHero, stageOf } from "./ProjectSections";

const live = findProject("first-trucks")!;
const boarding = findProject("translatpro")!;
const onHold = findProject("brytzone")!;

function hero(project = live) {
  return render(
    <ProjectHero
      lang="en"
      project={project}
      text={en.project}
      facts={en.report.facts}
      status={en.status}
      crumbs={{ home: "Home", homeHref: "/en", all: "All departures", workHref: "/en/work" }}
    />,
  );
}

function status(project = live) {
  return render(
    <FlightStatus
      project={project}
      text={en.project}
      status={en.status}
      contactHref="/en/contact"
    />,
  );
}

describe("<ProjectHero>", () => {
  it("names the project as the page heading, with its summary", () => {
    hero();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(live.name);
    expect(screen.getByText(live.summary.en)).toBeInTheDocument();
  });

  it("dates a live project by delivery and one in progress by its start", () => {
    hero(live).unmount();
    expect(screen.queryByText(en.project.started)).toBeNull();
    hero(boarding);
    expect(screen.getByText(en.project.started)).toBeInTheDocument();
  });

  it("says so in words when a project has no route", () => {
    hero(findProject("digtal")!);
    expect(screen.getByText(en.project.noRoute)).toBeInTheDocument();
  });
});

describe("stageOf", () => {
  it("puts live projects at departure and the others at boarding", () => {
    expect(stageOf(live)).toBe(2);
    expect(stageOf(boarding)).toBe(1);
    expect(stageOf(onHold)).toBe(1);
  });
});

describe("<FlightStatus>", () => {
  it("tells a live project is finished, without a booking button", () => {
    status(live);
    expect(screen.getByText(`Finished and online since ${live.year}.`)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: en.project.book.toUpperCase() })).toBeNull();
    expect(screen.getAllByRole("listitem")[2]).toHaveAttribute("aria-current", "step");
  });

  it("shows a project in progress at boarding, and invites you to book yours", () => {
    status(boarding);
    expect(screen.getByText(en.project.boarding)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")[1]).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("link", { name: en.project.book.toUpperCase() })).toHaveAttribute(
      "href",
      "/en/contact",
    );
  });

  it("says when a project is on hold", () => {
    status(onHold);
    expect(screen.getByText(en.project.onHold)).toBeInTheDocument();
  });
});
