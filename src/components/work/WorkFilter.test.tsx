import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { WorkFilter } from "./WorkFilter";

const rows = [
  { slug: "a", status: "LIVE" as const, row: <span>Alpha</span> },
  { slug: "b", status: "BOARDING" as const, row: <span>Bravo</span> },
  { slug: "c", status: "LIVE" as const, row: <span>Charlie</span> },
  { slug: "d", status: "ON HOLD" as const, row: <span>Delta</span> },
];
const text = {
  filterLabel: "Filter by status",
  all: "ALL",
  allName: "All projects",
  count: { one: "{n} flight", other: "{n} flights" },
  statusNames: {
    LIVE: "Status: live",
    BOARDING: "Status: boarding",
    "CHECK-IN": "Status: check-in",
    "ON HOLD": "Status: on hold",
  },
};
const visible = () =>
  ["Alpha", "Bravo", "Charlie", "Delta"].filter((n) => !screen.getByText(n).closest("[hidden]"));

describe("<WorkFilter>", () => {
  it("shows everything at first, with ALL pressed and the count", () => {
    render(<WorkFilter rows={rows} text={text} />);
    expect(visible()).toHaveLength(4);
    expect(screen.getByRole("button", { name: "All projects" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("04 FLIGHTS")).toBeInTheDocument();
  });

  it("shows only the chosen status and updates the count", async () => {
    render(<WorkFilter rows={rows} text={text} />);
    await userEvent.click(screen.getByRole("button", { name: "Status: live" }));
    expect(visible()).toEqual(["Alpha", "Charlie"]);
    expect(screen.getByText("02 FLIGHTS")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Status: live" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "All projects" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("uses the singular for one result", async () => {
    render(<WorkFilter rows={rows} text={text} />);
    await userEvent.click(screen.getByRole("button", { name: "Status: on hold" }));
    expect(screen.getByText("01 FLIGHT")).toBeInTheDocument();
  });

  it("only offers statuses that some project has", () => {
    render(<WorkFilter rows={rows} text={text} />);
    expect(screen.getByRole("button", { name: "Status: boarding" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Status: check-in" })).toBeNull();
  });

  it("announces the count to screen readers and names the group", () => {
    render(<WorkFilter rows={rows} text={text} />);
    expect(screen.getByText("04 FLIGHTS")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("group", { name: "Filter by status" })).toBeInTheDocument();
  });
});
