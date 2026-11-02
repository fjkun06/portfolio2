import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LangSwitch, pathWithoutLocale } from "./LangSwitch";

const pathname = vi.hoisted(() => ({ value: "/fr/work/herzog" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));

describe("pathWithoutLocale", () => {
  it("removes the language and keeps the rest", () => {
    expect(pathWithoutLocale("/fr/work/herzog")).toBe("/work/herzog");
    expect(pathWithoutLocale("/de")).toBe("");
  });

  it("only removes a whole language segment", () => {
    expect(pathWithoutLocale("/english-page")).toBe("/english-page");
  });
});

describe("<LangSwitch>", () => {
  it("links each language to the same page", () => {
    render(<LangSwitch current="fr" label="Langue" />);
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en/work/herzog",
    );
    expect(screen.getByRole("link", { name: "Deutsch" })).toHaveAttribute(
      "href",
      "/de/work/herzog",
    );
    expect(screen.getByRole("link", { name: "Français" })).toHaveAttribute(
      "href",
      "/fr/work/herzog",
    );
  });

  it("marks the current language and dims the others", () => {
    render(<LangSwitch current="fr" label="Langue" />);
    expect(screen.getByRole("link", { name: "Français" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "English" })).toHaveClass("lang-off");
  });

  it("names the group and tags each link with its language", () => {
    render(<LangSwitch current="fr" label="Langue" />);
    expect(screen.getByRole("group", { name: "Langue" })).toBeInTheDocument();
    const de = screen.getByRole("link", { name: "Deutsch" });
    expect(de).toHaveAttribute("lang", "de");
    expect(de).toHaveAttribute("hreflang", "de");
  });
});
