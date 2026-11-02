import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SplitTitle, splitTitle } from "./SplitTitle";

describe("splitTitle", () => {
  it("splits the sentence where the design breaks the line", () => {
    expect(splitTitle("On every flight", ["ON EVERY", "FLIGHT"])).toEqual(["On every", "flight"]);
    expect(splitTitle("Après l’atterrissage", ["APRÈS", "L’ATTERRISSAGE"])).toEqual([
      "Après",
      "l’atterrissage",
    ]);
  });

  it("gives up when the lines aren't the sentence in capitals", () => {
    expect(splitTitle("Handgepäck-Checkliste", ["HANDGEPÄCK", "CHECKLISTE"])).toBeNull();
    expect(splitTitle("Bagage cabine : la liste", ["BAGAGE", "CABINE"])).toBeNull();
  });
});

describe("SplitTitle", () => {
  it("names the heading once, in sentence case", () => {
    render(
      <h2>
        <SplitTitle text="Three languages on board" lines={["THREE LANGUAGES", "ON BOARD"]} />
      </h2>,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAccessibleName("Three languages on board");
    expect(heading.textContent).toBe("Three languages on board");
  });

  it("shows the design's lines when they differ from the sentence", () => {
    render(
      <h2>
        <SplitTitle text="Carry-on checklist" lines={["CARRY-ON", "LIST"]} />
      </h2>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("CARRY-ON LIST");
  });
});
