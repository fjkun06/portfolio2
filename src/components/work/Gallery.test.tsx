import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { projects } from "@/content/projects";
import { routes } from "@/i18n/routes";
import en from "@/locales/en";

import { Gallery } from "./Gallery";

vi.mock("next/image", () => import("@/test/next-image-mock"));

function setup() {
  return render(
    <Gallery
      lang="en"
      projects={projects}
      text={en.work}
      status={en.status}
      wipLabel={en.project.wip}
      to={routes("en")}
    />,
  );
}

describe("<Gallery>", () => {
  it("gives every card its project address as id, so /work#slug lands on it", () => {
    const { container } = setup();
    for (const p of projects) expect(container.querySelector(`#${p.slug}`)).not.toBeNull();
  });

  it("shows a picture for every project, no placeholders", () => {
    setup();
    expect(screen.getByRole("img", { name: "Homepage of DIGTAL" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /^Placeholder/ })).toBeNull();
  });

  it("opens every project's own page, from the picture and from the link", () => {
    const { container } = setup();
    for (const p of projects) {
      const card = container.querySelector(`#${p.slug}`)!;
      const hrefs = [...card.querySelectorAll("a")].map((a) => a.getAttribute("href"));
      expect(hrefs).toEqual([`/en/work/${p.slug}`, `/en/work/${p.slug}`]);
    }
  });

  it("greys out projects in progress under a status band, and invites you to follow them", () => {
    const { container } = setup();
    const live = container.querySelector("#digtal")!;
    const boarding = container.querySelector("#translatpro")!;
    expect(live.querySelector(".wip-media, .wip-band")).toBeNull();
    expect(live).toHaveTextContent(en.work.viewProject);
    expect(boarding.querySelector("img")).toHaveClass("wip-media");
    expect(boarding.querySelector(".wip-band")).toHaveTextContent(en.project.wip);
    expect(boarding).toHaveTextContent(en.work.followBuild);
    expect(screen.getByRole("img", { name: "TRANSLATPRO: work in progress" })).toBeInTheDocument();
  });

  it("calls Herzog's link a flight report", () => {
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
