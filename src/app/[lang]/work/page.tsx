import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { flipDelays, Led } from "@/components/Led";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { container } from "@/components/ui/layout";
import { Gallery } from "@/components/work/Gallery";
import { WorkBoard } from "@/components/work/WorkBoard";
import { projects } from "@/content/projects";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes } from "@/i18n/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { work, meta } = await getDictionary(lang);
  return pageMetadata({ lang, path: "/work", ...work.meta, imageAlt: meta.ogAlt });
}

/**
 * The Work page: every project as a filterable departures board ("All departures"),
 * then a closer look at each one ("At the gate").
 */
export default function WorkPage({ params }: PageProps<"/[lang]/work">) {
  return (
    <Suspense>
      <Work params={params} />
    </Suspense>
  );
}

async function Work({ params }: { params: PageProps<"/[lang]/work">["params"] }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { work, status, project } = await getDictionary(lang);
  const to = routes(lang);

  return (
    <>
      <section aria-labelledby="work-title" className="board">
        <div className={`${container} pt-5 lg:pt-7.5`}>
          <Breadcrumb items={[{ label: work.home, href: to.home }, { label: work.titleText }]} />
          <div className="mt-7.5 flex flex-wrap items-end justify-between gap-8 lg:mt-12">
            <h1 id="work-title" className="m-0">
              <span className="sr-only">{work.titleText}</span>
              <span aria-hidden="true" className="hidden flex-col gap-5 lg:flex">
                <Led
                  text={work.titleLed[0]}
                  pitch={12}
                  step={10}
                  animate
                  flip="once"
                  tone="white"
                />
                <Led
                  text={work.titleLed[1]}
                  pitch={12}
                  step={10}
                  delay={150}
                  animate
                  flip="once"
                  flipDelay={flipDelays(work.titleLed)[1]}
                />
              </span>
              <span aria-hidden="true" className="flex flex-col gap-3 lg:hidden">
                <Led text={work.titleLed[0]} pitch={6} step={12} animate flip="once" tone="white" />
                <Led
                  text={work.titleLed[1]}
                  pitch={5.6}
                  step={10}
                  delay={120}
                  animate
                  flip="once"
                  flipDelay={flipDelays(work.titleLed)[1]}
                />
              </span>
            </h1>
            <p className="rv m-0 max-w-[380px] text-on-board-2 lg:text-lg">{work.intro}</p>
          </div>
          <div className="mt-6 pb-7 lg:mt-12 lg:pb-14">
            <WorkBoard lang={lang} projects={projects} text={work} status={status} to={to} />
          </div>
        </div>
      </section>
      <Gallery
        lang={lang}
        projects={projects}
        text={work}
        status={status}
        wipLabel={project.wip}
        to={to}
      />
    </>
  );
}
