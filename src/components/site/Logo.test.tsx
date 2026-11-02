import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo } from "./Logo";

describe("<Logo>", () => {
  it("links home with an accessible name", () => {
    render(<Logo href="/en" label="Frank Jordan, home" />);
    expect(screen.getByRole("link", { name: "Frank Jordan, home" })).toHaveAttribute("href", "/en");
  });

  it("draws FJ at the given dot size", () => {
    const { container } = render(<Logo href="/en" label="Home" pitch={5} />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "55"); // 11 columns × 5
  });
});
