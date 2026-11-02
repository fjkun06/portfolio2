import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { projects } from "@/content/projects";
import { routes } from "@/i18n/routes";
import fr from "@/locales/fr";

import { DepartureBoard, projectHref } from "./DepartureBoard";

const to = routes("fr");

describe("projectHref", () => {
  it("opens Herzog's flight report and points other projects to the Work page", () => {
    expect(projectHref(projects[0], to)).toBe("/fr/work/herzog");
    expect(projectHref(projects[1], to)).toBe("/fr/work#translatpro");
  });
});

describe("<DepartureBoard>", () => {
  it("lists one row per project with its translated client type", () => {
    const shown = projects.slice(0, 3);
    render(
      <DepartureBoard lang="fr" projects={shown} text={fr.home.board} status={fr.status} to={to} />,
    );
    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(3);
    expect(within(rows[0]).getByText("HERZOG TRAD'")).toBeInTheDocument();
    expect(within(rows[0]).getByText("Traductrice assermentée")).toBeInTheDocument();
  });

  it("has a heading for screen readers and an anchor for the hero button", () => {
    const { container } = render(
      <DepartureBoard
        lang="fr"
        projects={projects}
        text={fr.home.board}
        status={fr.status}
        to={to}
      />,
    );
    expect(screen.getByRole("heading", { name: fr.home.board.title })).toBeInTheDocument();
    expect(container.querySelector("#departures")).not.toBeNull();
  });

  it("links to all departures", () => {
    render(
      <DepartureBoard
        lang="fr"
        projects={projects}
        text={fr.home.board}
        status={fr.status}
        to={to}
      />,
    );
    expect(screen.getByRole("link", { name: /Tous les départs/ })).toHaveAttribute(
      "href",
      "/fr/work",
    );
  });
});
