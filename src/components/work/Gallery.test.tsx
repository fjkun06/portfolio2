import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { projects } from "@/content/projects";
import { routes } from "@/i18n/routes";
import en from "@/locales/en";

import { Gallery } from "./Gallery";

vi.mock("next/image", () => import("@/test/next-image-mock"));

function setup() {
  return render(
    <Gallery lang="en" projects={projects} text={en.work} status={en.status} to={routes("en")} />,
  );
}

describe("<Gallery>", () => {
  it("gives every card its project address as id, so /work#slug lands on it", () => {
    const { container } = setup();
    for (const p of projects) expect(container.querySelector(`#${p.slug}`)).not.toBeNull();
  });

  it("describes screenshots and marks missing ones as placeholders", () => {
    setup();
    expect(screen.getByRole("img", { name: "Homepage of DIGTAL" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: `Placeholder: ${en.work.inProgress}` }),
    ).toBeInTheDocument();
  });

  it("links to the flight report where there is one", () => {
    setup();
    expect(screen.getByRole("link", { name: en.work.readReport })).toHaveAttribute(
      "href",
      "/en/work/herzog",
    );
  });

  it("shows each project's summary in the page language", () => {
    setup();
    for (const p of projects) expect(screen.getByText(p.summary.en)).toBeInTheDocument();
  });
});
