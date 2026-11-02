import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ModeSwitch, readIsLight, toggleMode } from "./ModeSwitch";

const html = () => document.documentElement;

describe("toggleMode", () => {
  it("flips the mode on <html> and saves it", () => {
    html().dataset.mode = "dark";
    expect(toggleMode()).toBe("light");
    expect(html().dataset.mode).toBe("light");
    expect(localStorage.getItem("mode")).toBe("light");
    expect(toggleMode()).toBe("dark");
    expect(localStorage.getItem("mode")).toBe("dark");
  });

  it("treats a missing mode as dark", () => {
    expect(readIsLight()).toBe(false);
    expect(toggleMode()).toBe("light");
  });
});

describe("<ModeSwitch>", () => {
  it("is a named switch that is off in dark mode", () => {
    html().dataset.mode = "dark";
    render(<ModeSwitch label="Light mode" hint="Dark or light mode" />);
    const toggle = screen.getByRole("switch", { name: "Light mode" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).toHaveAttribute("title", "Dark or light mode");
  });

  it("switches to light mode when clicked", async () => {
    html().dataset.mode = "dark";
    render(<ModeSwitch label="Light mode" hint="" />);
    await userEvent.click(screen.getByRole("switch"));
    expect(html().dataset.mode).toBe("light");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("keeps several switches in agreement", async () => {
    html().dataset.mode = "dark";
    render(
      <>
        <ModeSwitch label="Desktop" hint="" />
        <ModeSwitch label="Mobile" hint="" />
      </>,
    );
    await userEvent.click(screen.getByRole("switch", { name: "Desktop" }));
    expect(screen.getByRole("switch", { name: "Mobile" })).toHaveAttribute("aria-checked", "true");
  });

  it("follows a mode change made elsewhere", async () => {
    html().dataset.mode = "dark";
    render(<ModeSwitch label="Light mode" hint="" />);
    await act(async () => {
      html().dataset.mode = "light";
      await new Promise((resolve) => setTimeout(resolve, 0)); // let the MutationObserver fire
    });
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });
});
