import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Breadcrumb } from "./Breadcrumb";

describe("<Breadcrumb>", () => {
  it("links every step except the current page", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/en" },
          { label: "Work", href: "/en/work" },
          { label: "FJ 001" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/en/work");
    expect(screen.getByText("FJ 001")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "FJ 001" })).not.toBeInTheDocument();
  });
});
