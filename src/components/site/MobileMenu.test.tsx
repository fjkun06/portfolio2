import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import en from "@/locales/en";

import { MobileMenu } from "./MobileMenu";

const gates = [
  { code: "WRK", label: "Work", href: "/en/work" },
  { code: "TKT", label: "Contact", href: "/en/contact" },
];

function setup() {
  render(
    <MobileMenu
      gates={gates}
      bookHref="/en/contact"
      text={en.menu}
      language={<span>language switch</span>}
    />,
  );
  return screen.getByRole("button", { name: en.menu.open });
}

describe("<MobileMenu>", () => {
  it("starts closed", () => {
    const button = setup();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("opens the Gates panel with every page, the language switch and the book button", async () => {
    const button = setup();
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAccessibleName(en.menu.close);
    expect(screen.getByRole("navigation", { name: en.menu.gates })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Work/ })).toHaveAttribute("href", "/en/work");
    expect(screen.getByText("language switch")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: en.menu.book.toUpperCase() })).toHaveAttribute(
      "href",
      "/en/contact",
    );
  });

  it("locks page scrolling while open and restores it after", async () => {
    const button = setup();
    await userEvent.click(button);
    expect(document.body.style.overflow).toBe("hidden");
    await userEvent.click(button);
    expect(document.body.style.overflow).toBe("");
  });

  it("closes on Escape and returns focus to the button", async () => {
    const button = setup();
    await userEvent.click(button);
    await userEvent.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });

  it("closes when a link is chosen", async () => {
    const button = setup();
    await userEvent.click(button);
    const link = screen.getByRole("link", { name: /Contact/ });
    link.addEventListener("click", (event) => event.preventDefault()); // stay on the test page
    await userEvent.click(link);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
