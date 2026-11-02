import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NavLinks } from "./NavLinks";

const pathname = vi.hoisted(() => ({ value: "/en" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));

const items = [
  { href: "/en/work", label: "Work" },
  { href: "/en/about", label: "About" },
];

describe("<NavLinks>", () => {
  beforeEach(() => {
    pathname.value = "/en";
  });

  it("renders a named navigation with every link", () => {
    render(<NavLinks items={items} label="Main" />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/en/work");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/en/about");
  });

  it("marks the current page", () => {
    pathname.value = "/en/about";
    render(<NavLinks items={items} label="Main" />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Work" })).not.toHaveAttribute("aria-current");
  });

  it("keeps a section marked on its sub-pages", () => {
    pathname.value = "/en/work/herzog";
    render(<NavLinks items={items} label="Main" />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
  });

  it("doesn't mark a link on the home page", () => {
    render(<NavLinks items={items} label="Main" />);
    for (const link of screen.getAllByRole("link"))
      expect(link).not.toHaveAttribute("aria-current");
  });
});
