import Link from "next/link";

import { Led } from "@/components/Led";
import { Arrow } from "@/components/site/Arrow";
import { StatusLed } from "@/components/ui/StatusLed";
import { WorkFilter } from "@/components/work/WorkFilter";
import { projectHref, STATUSES, type FlightStatus, type Project } from "@/content/projects";
import type { Locale } from "@/i18n/config";
import type { Routes } from "@/i18n/routes";
import type { Dictionary } from "@/locales/en";

type WorkBoardProps = {
  lang: Locale;
  projects: Project[];
  text: Dictionary["work"];
  status: Dictionary["status"];
  to: Routes;
};

const GRID =
  "lg:grid lg:grid-cols-[110px_96px_minmax(0,1.6fr)_minmax(0,1fr)_110px_120px_170px_40px] lg:items-center lg:gap-[18px]";

/**
 * Every project as a departures board, with the status filter on top.
 * Same row design as the home page, plus the flight number. Below 1024 px rows become cards.
 */
export function WorkBoard({ lang, projects, text, status, to }: WorkBoardProps) {
  const rows = projects.map((p) => ({
    slug: p.slug,
    status: p.status,
    row: (
      <Link
        href={projectHref(p, to.work)}
        className={`row-board block border-t border-rule-board px-3 py-4 no-underline lg:min-h-[82px] lg:px-5 lg:py-0 ${GRID}`}
      >
        <span className="flex items-center justify-between gap-3 lg:contents">
          <span className="inline-flex items-center gap-3 lg:contents">
            <span className="lg:block">
              <Led text={p.code} pitch={3} tone="grey" glow={false} label={p.code} />
            </span>
            <span className="lg:block">
              <Led text={p.year} pitch={4} tone="white" label={p.year} />
            </span>
          </span>
          <span className="lg:hidden">
            <StatusLed status={p.status} text={status} pitch={3} />
          </span>
        </span>
        <span className="mt-2.5 block font-stencil text-[30px] leading-none font-extrabold tracking-[0.03em] text-on-board lg:mt-0 lg:text-[34px]">
          {p.name}
        </span>
        <span className="mt-2 flex justify-between gap-3 text-sm text-muted-board lg:mt-0 lg:block lg:text-[15px]">
          <span>{p.client[lang]}</span>
          <span className="font-stencil font-bold tracking-[0.12em] text-[var(--led-grey)] lg:hidden">
            {p.languages}
          </span>
        </span>
        <span className="hidden lg:block">
          <Led text={p.route} pitch={4} tone="grey" glow={false} />
        </span>
        <span className="hidden font-stencil text-lg font-bold tracking-[0.12em] text-[var(--led-grey)] lg:block">
          {p.languages}
        </span>
        <span className="hidden lg:block">
          <StatusLed status={p.status} text={status} />
        </span>
        <span className="row-go hidden text-muted-board lg:inline-flex">
          <Arrow />
        </span>
      </Link>
    ),
  }));

  const header = (
    <div
      aria-hidden="true"
      className={`hidden px-5 pt-6 pb-3.5 text-[13px] text-muted-board ${GRID}`}
    >
      {text.columns.map((c) => (
        <span key={c}>{c}</span>
      ))}
      <span />
    </div>
  );

  return (
    <WorkFilter
      rows={rows}
      header={header}
      text={{
        filterLabel: text.filterLabel,
        all: text.filters.all,
        allName: text.filters.allName,
        count: text.count,
        statusNames: Object.fromEntries(
          STATUSES.map((s) => [s, `${status.label}: ${status[s]}`]),
        ) as Record<FlightStatus, string>,
      }}
    />
  );
}
