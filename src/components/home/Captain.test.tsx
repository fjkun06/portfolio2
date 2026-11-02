import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import en from "@/locales/en";

import { Captain } from "./Captain";

vi.mock("next/image", () => import("@/test/next-image-mock"));

describe("<Captain>", () => {
  it("shows the portrait with a description", () => {
    render(<Captain text={en.home.captain} aboutHref="/en/about" />);
    expect(screen.getByRole("img", { name: en.home.captain.photo })).toBeInTheDocument();
  });

  it("lists every flight log entry with its year readable", () => {
    render(<Captain text={en.home.captain} aboutHref="/en/about" />);
    for (const entry of en.home.captain.entries) {
      expect(screen.getAllByText(entry.role).length).toBeGreaterThan(0);
      expect(screen.getAllByRole("img", { name: entry.year }).length).toBeGreaterThan(0);
    }
  });

  it("links to the About page", () => {
    render(<Captain text={en.home.captain} aboutHref="/en/about" />);
    expect(screen.getByRole("link", { name: en.home.captain.more })).toHaveAttribute(
      "href",
      "/en/about",
    );
  });
});
