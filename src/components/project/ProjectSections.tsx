import Link from "next/link";

import { Led, type LedTone } from "@/components/Led";
import { Arrow } from "@/components/site/Arrow";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { container, sectionTitle } from "@/components/ui/layout";
import { StatusLed } from "@/components/ui/StatusLed";
import { isLive, type Project } from "@/content/projects";
import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/fill";
import type { Dictionary } from "@/locales/en";

type ProjectText = Dictionary["project"];

type ProjectHeroProps = {
  lang: Locale;
  project: Project;
  text: ProjectText;
  /** Fact labels (client, route…), shared with the flight reports. */
  facts: Dictionary["report"]["facts"];
  status: Dictionary["status"];
  crumbs: { home: string; homeHref: string; all: string; workHref: string };
};

/**
 * Top of a project page, on the dark board: breadcrumb, "FLIGHT FJ 003", the project name, its
 * summary and a strip of facts (client, route, languages, year, status). For a live project the
 * year is when it was delivered; for one in progress, when it started.
 * The board runs on below the facts so the screenshot can overlap it.
 */
export function ProjectHero({ lang, project, text, facts, status, crumbs }: ProjectHeroProps) {
  const tag = `${text.tag} ${project.code}`;
  const noRoute = project.route === "-";
  const items: [string, React.ReactNode][] = [
    [
      facts.client,
      <span
        key="c"
        className="font-stencil text-lg font-extrabold tracking-[0.04em] lg:text-[22px]"
      >
        {project.client[lang]}
      </span>,
    ],
    [
      facts.route,
      noRoute ? (
        <span key="r" className="text-on-board-2">
          {text.noRoute}
        </span>
      ) : (
        <Led key="r" text={project.route} pitch={4} label={project.route} />
      ),
    ],
    [facts.languages, <Led key="l" text={project.languages} pitch={4} label={project.languages} />],
    [
      isLive(project) ? facts.delivered : text.started,
      <Led key="y" text={project.year} pitch={4} tone="white" label={project.year} />,
    ],
    [facts.status, <StatusLed key="s" status={project.status} text={status} pitch={4} />],
  ];

  return (
    <section aria-labelledby="project-title" className="board pb-[120px] lg:pb-[190px]">
      <div className={`${container} pt-5 lg:pt-7.5`}>
        <Breadcrumb
          items={[
            { label: crumbs.home, href: crumbs.homeHref },
            { label: crumbs.all, href: crumbs.workHref },
            { label: project.code },
          ]}
        />
        <div className="mt-7 lg:mt-12">
          <p className="m-0 inline-flex rounded border border-rule-board px-2 py-1.5">
            <span className="sr-only">{tag}</span>
            <Led text={tag} pitch={3} tone="grey" glow={false} />
          </p>
          <h1
            id="project-title"
            className="rv-wipe m-0 mt-5 font-stencil text-[min(80px,17vw)] leading-[0.88] font-black tracking-[0.01em] [overflow-wrap:anywhere] lg:mt-6.5 lg:text-[168px]"
          >
            {project.name}
          </h1>
          <p className="rv mt-5 mb-0 max-w-[30em] text-lg leading-normal text-on-board-2 lg:mt-7 lg:text-[22px] lg:leading-[1.45]">
            {project.summary[lang]}
          </p>
        </div>
      </div>
      <div className={`${container} mt-8 lg:mt-15`}>
        <dl className="m-0 grid grid-cols-1 border-y border-rule-board lg:grid-cols-5">
          {items.map(([label, value], i) => (
            <div
              key={label}
              className={`rv flex min-w-0 items-center justify-between gap-3 py-3.5 lg:block lg:px-6 lg:pt-5.5 lg:pb-6 ${i ? "border-t border-rule-board lg:border-t-0 lg:border-l" : ""}`}
            >
              <dt className="text-[13px] text-muted-board lg:mb-3">{label}</dt>
              <dd className="m-0">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Which progress stage a project is at: 0 check-in, 1 boarding, 2 departed. */
export function stageOf(project: Project): number {
  return isLive(project) ? 2 : 1;
}

/**
 * "Flight status": where the project stands, in a sentence and as three stages on a dotted line
 * (check-in, boarding, departed), the current one lit.
 * - Live: all three lit, "finished and online since…", and a link to the site if it's public.
 * - Boarding: the current stage blinks, the site is being built; invites you to book yours.
 * - On hold: the current stage is dimmed, the project is paused.
 */
export function FlightStatus({
  project,
  text,
  status,
  contactHref,
}: {
  project: Project;
  text: ProjectText;
  status: Dictionary["status"];
  contactHref: string;
}) {
  const live = isLive(project);
  const current = stageOf(project);
  const sentence = live
    ? fill(text.live, { year: project.year })
    : project.status === "ON HOLD"
      ? text.onHold
      : text.boarding;

  const toneOf = (i: number): LedTone =>
    i < current ? "white" : i > current ? "dim" : project.status === "ON HOLD" ? "grey" : "accent";

  return (
    <section aria-labelledby="status-title" className={`${container} pt-20 lg:pt-36`}>
      <h2 id="status-title" className={`rv-wipe ${sectionTitle}`}>
        {text.statusTitle}
      </h2>
      <div className="board card-edge rv mt-8 rounded-xl px-5.5 py-7 lg:mt-12 lg:rounded-[14px] lg:px-12 lg:py-11">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <StatusLed status={project.status} text={status} pitch={6} />
          {live && project.website && (
            <a
              href={`https://${project.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-on-board-2"
            >
              {text.liveSite} <Arrow />
            </a>
          )}
          {!live && (
            <Link href={contactHref} className="btn btn-accent min-h-[52px] px-6 text-xl">
              {text.book.toUpperCase()}
            </Link>
          )}
        </div>
        <p className="mt-5 mb-0 max-w-[40em] text-lg text-on-board-2 lg:text-xl">{sentence}</p>

        <ol
          aria-label={text.stagesLabel}
          className="m-0 mt-9 grid list-none grid-cols-3 gap-3 border-t border-rule-board p-0 pt-6 lg:mt-12 lg:gap-6 lg:pt-8"
        >
          {text.stages.map((stage, i) => (
            <li
              key={stage}
              aria-current={i === current ? "step" : undefined}
              className="flex min-w-0 flex-col gap-3"
            >
              <span
                aria-hidden="true"
                className="block h-[3px]"
                style={{
                  backgroundImage: `repeating-linear-gradient(90deg, var(${i <= current ? "--led" : "--dot-dim"}) 0 3px, transparent 3px 7px)`,
                }}
              />
              <span className="sr-only">{stage}</span>
              <Led
                text={stage}
                pitch={2.6}
                tone={toneOf(i)}
                glow={i === current}
                className={`h-auto max-w-full ${i === current && project.status === "BOARDING" ? "blink" : ""}`}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
