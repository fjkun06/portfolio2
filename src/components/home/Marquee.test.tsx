import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Marquee, MARQUEE_TEXT } from "./Marquee";

describe("<Marquee>", () => {
  it("is one named link to the contact page", () => {
    render(<Marquee href="/en/contact" label="Next departure: your project. Book it." />);
    expect(
      screen.getByRole("link", { name: "Next departure: your project. Book it." }),
    ).toHaveAttribute("href", "/en/contact");
  });

  it("draws the text twice so the loop is seamless", () => {
    const { container } = render(<Marquee href="/en/contact" label="Book" />);
    expect(container.querySelectorAll(".marquee svg.led-text")).toHaveLength(2);
    expect(MARQUEE_TEXT.endsWith("  ")).toBe(true); // spacing before the text repeats
  });
});
