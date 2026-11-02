import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { featured } from "@/content/projects";
import { routes } from "@/i18n/routes";
import en from "@/locales/en";

import { Featured } from "./Featured";

vi.mock("next/image", () => import("@/test/next-image-mock"));

function setup() {
  render(
    <Featured project={featured} text={en.home.featured} status={en.status} to={routes("en")} />,
  );
}

describe("<Featured>", () => {
  it("shows the desktop and phone screenshots instead of placeholders", () => {
    setup();
    expect(screen.getByRole("img", { name: en.home.featured.shotDesktop })).toHaveAttribute(
      "src",
      featured.image!.src,
    );
    expect(screen.getByRole("img", { name: en.home.featured.shotPhone })).toHaveAttribute(
      "src",
      featured.imagePhone!.src,
    );
    expect(screen.queryByRole("img", { name: /^Placeholder/ })).toBeNull();
  });

  it("names the project as the section heading", () => {
    setup();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("HERZOG TRAD'");
  });

  it("links the screenshot and the button to the flight report", () => {
    setup();
    expect(screen.getByRole("link", { name: en.home.featured.reportLabel })).toHaveAttribute(
      "href",
      "/en/work/herzog",
    );
    expect(
      screen.getByRole("link", { name: en.home.featured.report.toUpperCase() }),
    ).toHaveAttribute("href", "/en/work/herzog");
  });

  it("links to the live site in a new tab", () => {
    setup();
    const visit = screen.getByRole("link", { name: "Visit herzog-translations.com" });
    expect(visit).toHaveAttribute("href", "https://herzog-translations.com");
    expect(visit).toHaveAttribute("target", "_blank");
  });

  it("lists the details and the three highlights", () => {
    setup();
    expect(screen.getByText(en.home.featured.details.payment)).toBeInTheDocument();
    for (const h of en.home.featured.highlights)
      expect(screen.getByText(h.title)).toBeInTheDocument();
  });
});
