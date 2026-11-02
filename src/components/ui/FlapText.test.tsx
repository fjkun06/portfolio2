import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { arrivalAfter, FlapText } from "./FlapText";

describe("<FlapText>", () => {
  it("keeps the real text for screen readers and hides the letters", () => {
    render(
      <h1>
        <FlapText text="FIRST TRUCKS" />
      </h1>,
    );
    expect(screen.getByRole("heading", { name: "FIRST TRUCKS" })).toBeInTheDocument();
    expect(screen.getByText("FIRST TRUCKS")).toHaveClass("sr-only");
  });

  it("drops the letters in one after another, keeping each word on one line", () => {
    const { container } = render(<FlapText text="AB CD" delay={100} step={50} />);
    const letters = [...container.querySelectorAll<HTMLElement>(".flap-char")];
    expect(letters.map((l) => l.textContent)).toEqual(["A", "B", "C", "D"]);
    expect(letters.map((l) => l.style.animationDelay)).toEqual([
      "100ms",
      "150ms",
      "200ms",
      "250ms",
    ]);
    expect(container.querySelectorAll(".whitespace-nowrap")).toHaveLength(2);
  });
});

describe("arrivalAfter", () => {
  it("grows with the number of letters, not counting spaces", () => {
    expect(arrivalAfter("AB CD")).toBe(arrivalAfter("ABCD"));
    expect(arrivalAfter("ABCDE")).toBeGreaterThan(arrivalAfter("ABCD"));
  });
});
