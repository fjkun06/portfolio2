import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { routes } from "@/i18n/routes";
import en from "@/locales/en";

import { Header } from "./Header";

vi.mock("next/navigation", () => ({ usePathname: () => "/en/services" }));

function setup(progress?: boolean) {
  return render(
    <Header lang="en" nav={en.nav} menu={en.menu} to={routes("en")} progress={progress} />,
  );
}

describe("<Header>", () => {
  it("shows the five sections in the desktop navigation, in order", () => {
    setup();
    const nav = screen.getByRole("navigation", { name: en.nav.main });
    const links = within(nav).getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual([
      en.nav.work,
      en.nav.services,
      en.nav.process,
      en.nav.about,
      en.nav.contact,
    ]);
    expect(within(nav).getByRole("link", { name: en.nav.services })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("has the logo, the book button and a mode switch for each layout", () => {
    setup();
    expect(screen.getAllByRole("link", { name: en.nav.home })).toHaveLength(2);
    expect(screen.getByRole("link", { name: en.nav.book.toUpperCase() })).toHaveAttribute(
      "href",
      "/en/contact",
    );
    expect(screen.getAllByRole("switch", { name: en.nav.mode })).toHaveLength(2);
  });

  it("puts the same five pages in the mobile menu, with their codes", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: en.menu.open }));
    const gates = screen.getByRole("navigation", { name: en.menu.gates });
    expect(within(gates).getAllByRole("listitem")).toHaveLength(5);
  });

  it("shows the reading-progress runway unless turned off", () => {
    const { container, unmount } = setup();
    expect(container.querySelector(".runway-fill")).not.toBeNull();
    unmount();
    expect(setup(false).container.querySelector(".runway-fill")).toBeNull();
  });
});
