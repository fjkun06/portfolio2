import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { projects } from "@/content/projects";
import { routes } from "@/i18n/routes";
import en from "@/locales/en";

import { WorkBoard } from "./WorkBoard";

const to = routes("en");

describe("<WorkBoard>", () => {
  it("lists every project with its flight number and year readable", () => {
    render(<WorkBoard lang="en" projects={projects} text={en.work} status={en.status} to={to} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(projects.length);
    for (const p of projects) {
      expect(screen.getByRole("img", { name: p.code })).toBeInTheDocument();
      expect(screen.getByText(p.name)).toBeInTheDocument();
    }
  });
});
