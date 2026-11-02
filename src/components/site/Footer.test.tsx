import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FLIP_STEP } from "@/components/Led";
import { routes } from "@/i18n/routes";
import en from "@/locales/en";
import { siteConfig } from "@/utils/site";

import { connectionsFor, Footer } from "./Footer";

vi.mock("next/navigation", () => ({ usePathname: () => "/en" }));
// <Year> is an async Server Component, which unit tests can't render. Replace it.
vi.mock("./Year", () => ({ Year: () => <>2026</> }));

function setup() {
  render(<Footer lang="en" text={en.footer} nav={en.nav} to={routes("en")} />);
}

describe("connectionsFor", () => {
  it("leaves out contacts that have no value yet", () => {
    const codes = connectionsFor(en.footer).map((c) => c.code);
    if (siteConfig.whatsapp) expect(codes).toContain("WAP");
    else expect(codes).not.toContain("WAP");
    expect(codes).toEqual(expect.arrayContaining(["EML", "LIN", "GIT"]));
  });

  it("builds a mailto link for the email", () => {
    const email = connectionsFor(en.footer).find((c) => c.code === "EML")!;
    expect(email.href).toBe(`mailto:${siteConfig.email}`);
  });
});

describe("<Footer>", () => {
  it("says the LED sentence as real text too", () => {
    setup();
    expect(screen.getByText(en.footer.next)).toBeInTheDocument();
  });

  it("flips the sign's letters in one wave through its lines", () => {
    const { container } = render(
      <Footer lang="en" text={en.footer} nav={en.nav} to={routes("en")} />,
    );
    const desktop = container.querySelector('[class~="lg:block"]')!;
    const lines = [...desktop.querySelectorAll("svg")];
    expect(lines).toHaveLength(en.footer.nextLed.length);
    // The second line's first letter turns right after the first line's last one.
    const firstLine = lines[0].querySelectorAll<SVGPathElement>(".led-flip");
    const last = parseInt(firstLine[firstLine.length - 1].style.animationDelay);
    const next = parseInt(lines[1].querySelector<SVGPathElement>(".led-flip")!.style.animationDelay);
    expect(next - last).toBe(FLIP_STEP);
  });

  it("links the book button to the contact page", () => {
    setup();
    expect(screen.getByRole("link", { name: en.footer.book.toUpperCase() })).toHaveAttribute(
      "href",
      "/en/contact",
    );
  });

  it("opens external profiles in a new tab, safely", () => {
    setup();
    const github = screen.getByRole("link", { name: /GitHub/ });
    expect(github).toHaveAttribute("href", siteConfig.github);
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("links to the Impressum and the privacy policy", () => {
    setup();
    expect(screen.getByRole("link", { name: en.footer.imprint })).toHaveAttribute(
      "href",
      "/en/legal",
    );
    expect(screen.getByRole("link", { name: en.footer.privacy })).toHaveAttribute(
      "href",
      "/en/legal#privacy",
    );
  });

  it("shows the copyright line and the back-to-top button", () => {
    setup();
    expect(screen.getByText(/© 2026 Frank Jordan/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: en.footer.backToTop })).toBeInTheDocument();
  });
});
