import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import en from "@/locales/en";

import { Routes } from "./Routes";

describe("<Routes>", () => {
  it("shows every service as a route from now to next", () => {
    render(<Routes text={en.home.routes} servicesHref="/en/services" />);
    for (const r of en.home.routes.items) {
      expect(screen.getByText(r.from)).toBeInTheDocument();
      expect(screen.getByText(r.to)).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: r.title, level: 3 })).toBeInTheDocument();
    }
  });

  it("names the section in plain words and links to the Services page", () => {
    render(<Routes text={en.home.routes} servicesHref="/en/services" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(en.home.routes.titleText);
    expect(screen.getByRole("link", { name: en.home.routes.more })).toHaveAttribute(
      "href",
      "/en/services",
    );
  });
});
