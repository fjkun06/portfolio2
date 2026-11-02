import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { PAUSE_KEY } from "@/lib/motion/pause";

import { MotionToggle } from "./MotionToggle";

describe("<MotionToggle>", () => {
  afterEach(() => delete document.documentElement.dataset.motion);

  it("pauses animations, remembers it, and plays them again", async () => {
    const user = userEvent.setup();
    render(<MotionToggle pause="Pause animations" play="Play animations" />);

    await user.click(screen.getByRole("button", { name: "Pause animations" }));
    expect(document.documentElement.dataset.motion).toBe("paused");
    expect(localStorage.getItem(PAUSE_KEY)).toBe("paused");

    await user.click(screen.getByRole("button", { name: "Play animations" }));
    expect(document.documentElement.dataset.motion).toBeUndefined();
    expect(localStorage.getItem(PAUSE_KEY)).toBeNull();
    expect(screen.getByRole("button", { name: "Pause animations" })).toBeInTheDocument();
  });

  it("offers to play when the page loads with animations paused", () => {
    document.documentElement.dataset.motion = "paused";
    render(<MotionToggle pause="Pause animations" play="Play animations" />);
    expect(screen.getByRole("button", { name: "Play animations" })).toBeInTheDocument();
  });
});
