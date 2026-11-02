import Link from "next/link";

import { Led } from "@/components/Led";
import { Arrow } from "@/components/site/Arrow";
import { container } from "@/components/ui/layout";
import { StatusLed } from "@/components/ui/StatusLed";
import type { Project } from "@/content/projects";
import type { Locale } from "@/i18n/config";
import type { Routes } from "@/i18n/routes";
import type { Dictionary } from "@/locales/en";

type DepartureBoardProps = {
  lang: Locale;
  projects: Project[];
  text: Dictionary["home"]["board"];
  status: Dictionary["status"];
  to: Routes;
};

/** Where a row leads: the project's own page for the featured flight, the Work page otherwise. */
export function projectHref(project: Project, to: Routes): string {
  return project.slug === "herzog" ? `${to.work}/${project.slug}` : `${to.work}#${project.slug}`;
}

/**
 * The departures board: recent projects as rows of an airport board, on the same dark panel as
 * the hero. Year in LED dots, name in stencil, client, route, languages and status.
 *
 * - From 1024 px it's a table-like grid with column headings.
 * - Below, each row stacks into a small card (year and status on top, name, then client and
 *   languages), so nothing needs horizontal scrolling on a phone.
 * Rows flip down into place as they scroll in (`rv-flap`), like split-flap displays.
 */
export function DepartureBoard({ lang, projects, text, status, to }: DepartureBoardProps) {
  const grid =
    "lg:grid lg:grid-cols-[96px_minmax(0,1.6fr)_minmax(0,1fr)_110px_120px_170px_40px] lg:items-center lg:gap-5";
  return (
    <section
      id="departures"
      aria-labelledby="board-title"
      className="board border-t border-rule-board"
    >
      <div className={`${container} pt-7 pb-14`}>
        <h2 id="board-title" className="sr-only">
          {text.title}
        </h2>
        <div
          className={`hidden px-5 pb-3.5 text-[13px] text-muted-board ${grid}`}
          aria-hidden="true"
        >
          {text.columns.map((c) => (
            <span key={c}>{c}</span>
          ))}
          <span />
        </div>
        <ul className="m-0 list-none border-b border-rule-board p-0">
          {projects.map((p) => (
            <li key={p.slug} className="rv-flap">
              <Link
                href={projectHref(p, to)}
                className={`row-board block border-t border-rule-board px-3 py-4 no-underline lg:min-h-[82px] lg:px-5 lg:py-0 ${grid}`}
              >
                <span className="flex items-center justify-between gap-3 lg:block">
                  <Led text={p.year} pitch={4} tone="white" className="hidden lg:block" />
                  <Led text={p.year} pitch={3} tone="white" className="lg:hidden" />
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
            </li>
          ))}
        </ul>
        <p className="mt-6 mb-0 text-right">
          <Link href={to.work} className="text-[15px] text-on-board-2 underline-offset-4">
            {text.all} →
          </Link>
        </p>
      </div>
    </section>
  );
}
