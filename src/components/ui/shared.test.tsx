import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FLIP_STEP } from "@/components/Led";

import { LedTitle } from "./LedTitle";
import { PortraitFrame } from "./PortraitFrame";

vi.mock("next/image", () => import("@/test/next-image-mock"));

describe("<LedTitle>", () => {
  it("is a level-1 heading named by the real text, with the dots hidden", () => {
    const { container } = render(
      <LedTitle id="t" lines={["YOUR", "CAPTAIN"]} text="Your captain: about Frank" />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Your captain: about Frank" }),
    ).toHaveAttribute("id", "t");
    const signs = container.querySelectorAll("h1 > [aria-hidden='true']");
    expect(signs).toHaveLength(2); // desktop and phone sizes
    for (const sign of signs) expect(sign.querySelectorAll("svg")).toHaveLength(2);
  });

  it("flips its letters in one wave through both lines", () => {
    const { container } = render(
      <LedTitle id="t" lines={["YOUR", "CAPTAIN"]} text="Your captain" />,
    );
    const [first, second] = container.querySelector("h1 > [aria-hidden='true']")!.children;
    expect(first.querySelectorAll(".led-flip")).toHaveLength(4);
    expect((second.querySelector(".led-flip") as SVGGElement).style.animationDelay).toBe(
      `${4 * FLIP_STEP}ms`,
    );
  });
});

describe("<PortraitFrame>", () => {
  it("shows the photo with its description and Frank's name", () => {
    render(<PortraitFrame alt="Portrait of Frank Jordan" caption="Frontend developer, Germany" />);
    expect(screen.getByRole("img", { name: "Portrait of Frank Jordan" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Frank Jordan" })).toBeInTheDocument();
    expect(screen.getByText("Frontend developer, Germany")).toBeInTheDocument();
  });
});
