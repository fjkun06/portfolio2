import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { notFoundContent } from "@/content/not-found";
import { findProject } from "@/content/projects";

import { NotFoundView, REPORT_SLUG } from "./NotFoundView";

describe("<NotFoundView>", () => {
  it("says the flight was not found, in the page's language", () => {
    render(<NotFoundView lang="fr" />);
    expect(
      screen.getByRole("heading", { level: 1, name: notFoundContent.fr.titleText }),
    ).toBeInTheDocument();
    expect(screen.getByText(notFoundContent.fr.statusText)).toBeInTheDocument();
  });

  it("offers ways back, all in the same language", () => {
    render(<NotFoundView lang="de" />);
    const t = notFoundContent.de;
    expect(screen.getByRole("link", { name: t.home.toUpperCase() })).toHaveAttribute("href", "/de");
    expect(screen.getByRole("link", { name: t.work.toUpperCase() })).toHaveAttribute(
      "href",
      "/de/work",
    );
    expect(screen.getByRole("link", { name: new RegExp(t.links.report) })).toHaveAttribute(
      "href",
      `/de/work/${REPORT_SLUG}`,
    );
    expect(screen.getByRole("link", { name: new RegExp(t.links.book) })).toHaveAttribute(
      "href",
      "/de/contact",
    );
  });

  it("links to a report that exists", () => {
    expect(findProject(REPORT_SLUG)?.report).toBeTruthy();
  });
});
