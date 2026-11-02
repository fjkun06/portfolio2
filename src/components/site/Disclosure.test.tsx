import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** Each call to animate() returns controls whose `finish` ends the animation in the test. */
const motion = vi.hoisted(() => {
  const runs: { finish: () => void; stop: ReturnType<typeof vi.fn> }[] = [];
  const animate = vi.fn(() => {
    let finish = () => {};
    const done = new Promise<void>((resolve) => (finish = resolve));
    const run = { finish, stop: vi.fn(), then: done.then.bind(done) };
    runs.push(run);
    return run;
  });
  return { animate, runs };
});
vi.mock("motion/mini", () => ({ animate: motion.animate }));

import { Disclosure } from "./Disclosure";

function setup() {
  render(
    <Disclosure summary="Question">
      <p>Answer</p>
    </Disclosure>,
  );
  const details = screen.getByText("Question").closest("details")!;
  return { details, user: userEvent.setup() };
}

const finish = (i: number) => act(async () => motion.runs[i].finish());

describe("<Disclosure>", () => {
  beforeEach(() => vi.stubGlobal("matchMedia", () => ({ matches: false })));
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    motion.runs.length = 0;
  });

  it("opens at once and slides the content open from zero height", async () => {
    const { details, user } = setup();
    await user.click(screen.getByText("Question"));
    expect(details).toHaveAttribute("open");
    const [panel, keyframes] = motion.animate.mock.calls[0] as unknown as [
      HTMLElement,
      { height: string[]; opacity: number[] },
    ];
    expect(panel).toHaveTextContent("Answer");
    expect(keyframes.height[0]).toBe("0px");
    expect(keyframes.opacity).toEqual([0, 1]);

    await finish(0);
    expect(panel.style.height).toBe("");
    expect(panel.style.overflow).toBe("");
  });

  it("stays open while it slides shut, then closes", async () => {
    const { details, user } = setup();
    await user.click(screen.getByText("Question"));
    await finish(0);

    await user.click(screen.getByText("Question"));
    expect(details).toHaveAttribute("open");
    expect(details).toHaveAttribute("data-closing");
    const keyframes = motion.animate.mock.calls[1] as unknown as [unknown, { height: string[] }];
    expect(keyframes[1].height[1]).toBe("0px");

    await finish(1);
    expect(details).not.toHaveAttribute("open");
    expect(details).not.toHaveAttribute("data-closing");
  });

  it("turns around when clicked again mid-slide", async () => {
    const { details, user } = setup();
    await user.click(screen.getByText("Question"));
    await finish(0);
    await user.click(screen.getByText("Question")); // starts closing
    await user.click(screen.getByText("Question")); // opens again
    expect(motion.runs[1].stop).toHaveBeenCalled();
    expect(details).not.toHaveAttribute("data-closing");

    await finish(1); // the stopped closing run must not close it
    expect(details).toHaveAttribute("open");
  });

  it("leaves it to the browser when the visitor prefers reduced motion", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    const { details, user } = setup();
    await user.click(screen.getByText("Question"));
    expect(details).toHaveAttribute("open");
    expect(motion.animate).not.toHaveBeenCalled();
  });
});
