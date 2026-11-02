import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ReportHero } from "@/components/report/ReportHero";
import {
  Brief,
  HomepageShot,
  Journey,
  Manifest,
  NextDeparture,
  Quote,
} from "@/components/report/ReportSections";
import { findProject, nextDeparture, projects } from "@/content/projects";
import { reports } from "@/content/reports/herzog";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes } from "@/i18n/routes";

/** Only projects with a report get a page; every language is built for each. */
export function generateStaticParams() {
  return projects.filter((p) => p.report && reports[p.slug]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = findProject(slug);
  const report = reports[slug];
  if (!hasLocale(lang) || !project || !report) return {};
  const { report: text } = await getDictionary(lang);
  return {
    title: `${project.name} · ${text.tag.toLowerCase()} · Frank Jordan`,
    description: report[lang].intro,
  };
}

/**
 * A flight report (case study): hero with route map and facts, the homepage screenshot,
 * the brief, the customer journey, what was built, the client's words, and the next project.
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
  if (!hasLocale(lang) || !project || !reports[slug]) notFound();
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
      <Journey report={report} text={text} />
      <Manifest report={report} text={text} />
      <Quote report={report} text={text} />
      <NextDeparture
        project={next}
        href={next.report ? `${to.work}/${next.slug}` : `${to.work}#${next.slug}`}
        text={text}
      />
    </>
  );
}
