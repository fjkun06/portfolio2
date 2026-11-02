import { Led } from "@/components/Led";
import { RouteMap } from "@/components/report/RouteMap";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { arrivalAfter, FlapText } from "@/components/ui/FlapText";
import { container } from "@/components/ui/layout";
import type { Project } from "@/content/projects";
import type { Report } from "@/content/reports/herzog";
import type { Dictionary } from "@/locales/en";

type ReportHeroProps = {
  project: Project;
  report: Report;
  text: Dictionary["report"];
  status: Dictionary["status"];
  homeLabel: string;
  workHref: string;
  homeHref: string;
};

/**
 * Top of a flight report, on the dark board: breadcrumb, "FLIGHT REPORT FJ 001", the project
 * name, the promise, the route map and a strip of facts (client, route, languages, year, status).
 * The board runs on below the facts so the homepage screenshot can overlap it.
 */
export function ReportHero({
  project,
  report,
  text,
  status,
  homeLabel,
  workHref,
  homeHref,
}: ReportHeroProps) {
  const tag = `${text.tag} ${project.code}`;
  const facts: [string, React.ReactNode][] = [
    [
      text.facts.client,
      <span
        key="c"
        className="font-stencil text-lg font-extrabold tracking-[0.04em] lg:text-[22px]"
      >
        {report.client}
      </span>,
    ],
    [text.facts.route, <Led key="r" text="CM ⇄ DE" pitch={4} label={text.routeLabel} />],
    [
      text.facts.languages,
      <Led key="l" text={project.languages} pitch={4} label={project.languages} />,
    ],
    [
      text.facts.delivered,
      <Led key="d" text={report.delivered} pitch={4} tone="white" label={report.delivered} />,
    ],
    [
      text.facts.status,
      <span key="s" className="inline-flex">
        <span className="sr-only">{status[project.status]}</span>
        <Led text={project.status} pitch={4} />
      </span>,
    ],
  ];

  return (
    <section aria-labelledby="report-title" className="board pb-[120px] lg:pb-[190px]">
      <div className={`${container} pt-5 lg:pt-7.5`}>
        <Breadcrumb
          items={[
            { label: homeLabel, href: homeHref },
            { label: text.allDepartures, href: workHref },
            { label: project.code },
          ]}
        />
        <div className="mt-7 flex flex-wrap items-center justify-between gap-8 lg:mt-12 lg:gap-12">
          <div className="min-w-0 flex-[1_1_560px]">
            <p className="m-0 inline-flex rounded border border-rule-board px-2 py-1.5">
              <span className="sr-only">{tag}</span>
              <Led text={tag} pitch={3} tone="grey" glow={false} animate step={8} />
            </p>
            <h1
              id="report-title"
              className="m-0 mt-5 font-stencil text-[80px] leading-[0.88] font-black tracking-[0.01em] lg:mt-6.5 lg:text-[168px]"
            >
              <FlapText text={project.name} />
            </h1>
            <p className="rv mt-5 mb-0 max-w-[30em] text-lg leading-normal text-on-board-2 lg:mt-7 lg:text-[22px] lg:leading-[1.45]">
              {report.intro}
            </p>
          </div>
          <div className="rv-scale hidden lg:block">
            <RouteMap size="desktop" label={text.routeLabel} />
          </div>
          <div className="rv-scale lg:hidden">
            <RouteMap size="mobile" label={text.routeLabel} />
          </div>
        </div>
      </div>
      <div className={`${container} mt-6 lg:mt-15`}>
        <dl className="facts-arrive m-0 grid grid-cols-1 border-y border-rule-board lg:grid-cols-5">
          {facts.map(([label, value], i) => (
            <div
              key={label}
              style={{ animationDelay: `${arrivalAfter(project.name) + i * 90}ms` }}
              className={`flex min-w-0 items-center justify-between gap-3 py-3.5 lg:block lg:px-6 lg:pt-5.5 lg:pb-6 ${i ? "border-t border-rule-board lg:border-t-0 lg:border-l" : ""}`}
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
