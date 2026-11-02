import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Arrow } from "./Arrow";

describe("<Arrow>", () => {
  it("is decorative and follows the text colour", () => {
    const { container } = render(<Arrow size={30} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "30");
    expect(container.querySelector("path")).toHaveAttribute("stroke", "currentColor");
  });
});
