import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { flipDelays, Led } from "@/components/Led";
import { RouteNetwork } from "@/components/services/RouteNetwork";
import { ServiceBlock } from "@/components/services/ServiceBlock";
import { Always, Faq, Fares } from "@/components/services/ServicesSections";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { container } from "@/components/ui/layout";
import { findProject } from "@/content/projects";
import { servicesContent } from "@/content/services";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes } from "@/i18n/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/services",
    ...servicesContent[lang].meta,
    imageAlt: meta.ogAlt,
  });
}

/**
 * The Services page: hero with the route map, the four services, what comes with every one,
 * how prices work, and frequent questions. The footer carries the call to book.
 */
export default function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  return (
    <Suspense>
      <Services params={params} />
    </Suspense>
  );
}

async function Services({ params }: { params: PageProps<"/[lang]/services">["params"] }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const text = servicesContent[lang];
  const { work } = await getDictionary(lang);
  const to = routes(lang);
  const codes = text.services.map((s) => s.code);

  return (
    <>
      <section aria-labelledby="services-title" className="board">
        <div className={`${container} pt-5 pb-11 lg:pt-7.5 lg:pb-20`}>
          <Breadcrumb items={[{ label: work.home, href: to.home }, { label: text.breadcrumb }]} />
          <div className="mt-7.5 flex flex-wrap items-center justify-between gap-8 lg:mt-12 lg:gap-10">
            <div className="min-w-0 flex-[1_1_520px]">
              <h1 id="services-title" className="m-0">
                <span className="sr-only">{text.titleText}</span>
                <span aria-hidden="true" className="hidden flex-col gap-6 lg:flex">
                  <Led
                    text={text.titleLed[0]}
                    pitch={12}
                    step={10}
                    animate
                    flip="once"
                    tone="white"
                  />
                  <Led
                    text={text.titleLed[1]}
                    pitch={12}
                    step={10}
                    delay={160}
                    animate
                    flip="once"
                    flipDelay={flipDelays(text.titleLed)[1]}
                  />
                </span>
                <span aria-hidden="true" className="flex flex-col gap-3 lg:hidden">
                  <Led
                    text={text.titleLed[0]}
                    pitch={6}
                    step={10}
                    animate
                    flip="once"
                    tone="white"
                  />
                  <Led
                    text={text.titleLed[1]}
                    pitch={6}
                    step={10}
                    delay={160}
                    animate
                    flip="once"
                    flipDelay={flipDelays(text.titleLed)[1]}
                  />
                </span>
              </h1>
              <p className="rv mt-5.5 mb-0 max-w-[480px] text-lg text-on-board-2 lg:mt-8.5 lg:text-[21px]">
                {text.intro}
              </p>
              <nav aria-label={text.routesLabel} className="rv mt-6.5 flex flex-wrap gap-2">
                {text.services.map((s) => (
                  <a
                    key={s.code}
                    href={`#${s.code.toLowerCase()}`}
                    className="route-chip inline-flex min-h-11 items-center gap-2.5 rounded border border-rule-board px-3 no-underline"
                  >
                    <Led text={s.code} pitch={2.6} />
                    <span className="text-sm text-on-board-2">{s.title}</span>
                  </a>
                ))}
              </nav>
            </div>
            <div className="rv-scale flex w-full justify-center lg:w-auto">
              <RouteNetwork codes={codes} label={text.mapLabel} />
            </div>
          </div>
        </div>
      </section>

      <section aria-label={text.routesLabel} className={`${container} pt-7.5 lg:pt-15`}>
        {text.services.map((s, i) => {
          const project = s.example ? findProject(s.example) : undefined;
          return (
            <ServiceBlock
              key={s.code}
              service={s}
              index={i}
              total={text.services.length}
              text={text}
              example={project ? { href: `${to.work}/${project.slug}`, name: project.name } : null}
            />
          );
        })}
      </section>

      <Always text={text.always} />
      <Fares text={text.fares} />
      <Faq text={text.faq} />
    </>
  );
}
