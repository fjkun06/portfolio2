import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { FlightStatus, ProjectHero, ProjectStory } from "@/components/project/ProjectSections";
import { ReportHero } from "@/components/report/ReportHero";
import {
  Brief,
  HomepageShot,
  Journey,
  Manifest,
  NextDeparture,
  Quote,
} from "@/components/report/ReportSections";
import { WipBand } from "@/components/ui/WipBand";
import {
  findProject,
  isLive,
  nextDeparture,
  projectHref,
  projects,
  type Project,
} from "@/content/projects";
import { journeyShots, reports } from "@/content/reports/herzog";
import { fill } from "@/i18n/fill";
import { hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes } from "@/i18n/routes";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * The whole page is built ahead of time. For an address that isn't a project (/work/nope),
 * Next.js waits for that result instead of streaming a shell first, so notFound() can still
 * answer with a real 404 status, not a 200 carrying the 404 page.
 */
export const ensureStatic = "navigation";

/** Every project gets a page, in every language. */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = findProject(slug);
  if (!hasLocale(lang) || !project) return {};
  const report = reports[slug];
  const { report: text, meta } = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: `/work/${slug}`,
    title: report
      ? `${project.name} · ${text.tag.toLowerCase()} · Frank Jordan`
      : `${project.name} · Frank Jordan`,
    description: report ? report[lang].intro : project.summary[lang],
    imageAlt: meta.ogAlt,
  });
}

/**
 * A project's own page.
 * - With a flight report (case study): hero with route map and facts, the homepage screenshot,
 *   the brief, the customer journey, what was built, the client's words, and the next project.
 * - Without one: hero with the facts, the screenshot, what the project is and what it's built
 *   with (with links to the demo and the code), the flight status (live, or still in progress
 *   with the picture greyed out under a status band), and the next project.
 */
export default function ReportPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  return (
    <Suspense>
      <ReportContent params={params} />
    </Suspense>
  );
}

async function ReportContent({ params }: { params: PageProps<"/[lang]/work/[slug]">["params"] }) {
  const { lang, slug } = await params;
  const project = findProject(slug);
  if (!hasLocale(lang) || !project) notFound();
  if (!reports[slug]) return <ProjectContent lang={lang} project={project} />;
  const report = reports[slug][lang];
  const { report: text, status, work } = await getDictionary(lang);
  const to = routes(lang);
  const next = nextDeparture(project);

  return (
    <>
      <ReportHero
        project={project}
        report={report}
        text={text}
        status={status}
        homeLabel={work.home}
        homeHref={to.home}
        workHref={to.work}
      />
      <HomepageShot project={project} text={text} />
      <Brief report={report} text={text} />
      <Journey report={report} shots={journeyShots[slug]} text={text} />
      <Manifest report={report} stack={project.stack} text={text} />
      <Quote report={report} text={text} />
      <NextDeparture project={next} href={projectHref(next, to.work)} text={text} />
    </>
  );
}

/** The page of a project without a flight report. */
async function ProjectContent({ lang, project }: { lang: Locale; project: Project }) {
  const { project: text, report, status, work } = await getDictionary(lang);
  const to = routes(lang);
  const next = nextDeparture(project);
  const live = isLive(project);

  return (
    <>
      <ProjectHero
        lang={lang}
        project={project}
        text={text}
        facts={report.facts}
        status={status}
        crumbs={{
          home: work.home,
          homeHref: to.home,
          all: report.allDepartures,
          workHref: to.work,
        }}
      />
      <HomepageShot
        project={project}
        text={report}
        wip={
          live
            ? undefined
            : {
                alt: fill(work.shotWip, { name: project.name }),
                band: <WipBand status={project.status} label={text.wip} text={status} />,
              }
        }
      />
      <ProjectStory lang={lang} project={project} text={text} builtWith={report.builtWith} />
      <FlightStatus project={project} text={text} status={status} contactHref={to.contact} />
      <NextDeparture project={next} href={projectHref(next, to.work)} text={report} />
    </>
  );
}
