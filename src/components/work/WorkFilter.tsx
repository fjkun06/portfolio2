"use client";

import { useState } from "react";

import { Led } from "@/components/Led";
import { STATUSES, type FlightStatus } from "@/content/projects";
import { fill } from "@/i18n/fill";

type Row = { slug: string; status: FlightStatus; row: React.ReactNode };

type WorkFilterProps = {
  /** The board rows, rendered on the server, with each project's status. */
  rows: Row[];
  /** Translated words: the group name, "ALL", the counter, and each status for screen readers. */
  text: {
    filterLabel: string;
    all: string;
    allName: string;
    count: { one: string; other: string };
    statusNames: Record<FlightStatus, string>;
  };
  /** Rendered between the filter bar and the rows (column headings). */
  header?: React.ReactNode;
};

/**
 * Status filter for the Work page's board: ALL, then one LED button per status that at least
 * one project has (LIVE · BOARDING · CHECK-IN · ON HOLD), so no button leads to an empty board.
 *
 * - The pressed button is lit in the accent colour and has `aria-pressed="true"`.
 * - Rows that don't match are hidden with the `hidden` attribute (they stay in the HTML, so the
 *   page works and is indexed without JavaScript).
 * - The counter ("05 flights") is announced to screen readers when it changes (`aria-live`).
 */
export function WorkFilter({ rows, text, header }: WorkFilterProps) {
  const [filter, setFilter] = useState<FlightStatus | "ALL">("ALL");
  const shown = rows.filter((r) => filter === "ALL" || r.status === filter).length;
  const count = fill(shown === 1 ? text.count.one : text.count.other, {
    n: String(shown).padStart(2, "0"),
  });

  const button = (value: FlightStatus | "ALL", label: string, name: string) => {
    const on = filter === value;
    return (
      <button
        key={value}
        type="button"
        aria-pressed={on}
        aria-label={name}
        onClick={() => setFilter(value)}
        className="inline-flex min-h-11 cursor-pointer items-center rounded border bg-transparent px-3 transition-colors"
        style={{ borderColor: on ? "var(--led)" : "var(--rule-board)" }}
      >
        <Led text={label} pitch={3} tone={on ? "accent" : "grey"} glow={on} />
      </button>
    );
  };

  return (
    <>
      <div className="rv flex flex-wrap items-center justify-between gap-4 border-t border-rule-board py-5">
        <div role="group" aria-label={text.filterLabel} className="flex flex-wrap gap-2">
          {button("ALL", text.all, text.allName)}
          {STATUSES.filter((s) => rows.some((r) => r.status === s)).map((s) =>
            button(s, s, text.statusNames[s]),
          )}
        </div>
        <span
          aria-live="polite"
          className="font-stencil text-[17px] font-extrabold tracking-[0.08em] text-muted-board lg:text-xl"
        >
          {count.toUpperCase()}
        </span>
      </div>
      {header}
      <ul className="m-0 list-none border-b border-rule-board p-0">
        {rows.map((r) => (
          <li key={r.slug} className="rv-flap" hidden={filter !== "ALL" && r.status !== filter}>
            {r.row}
          </li>
        ))}
      </ul>
    </>
  );
}
