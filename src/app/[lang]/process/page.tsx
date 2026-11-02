import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Led } from "@/components/Led";
import { AfterLanding, CarryOn, Stops } from "@/components/process/ProcessSections";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { container } from "@/components/ui/layout";
import { processContent } from "@/content/process";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes } from "@/i18n/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/process">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return processContent[lang].meta;
}

/**
 * The Process page: "Your flight plan" hero with key numbers, the four stops with the cockpit
 * that follows you, what to prepare, and what happens after launch.
 */
export default function ProcessPage({ params }: PageProps<"/[lang]/process">) {
  return (
    <Suspense>
      <ProcessContentView params={params} />
    </Suspense>
  );
}

async function ProcessContentView({ params }: { params: PageProps<"/[lang]/process">["params"] }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const text = processContent[lang];
  const { work } = await getDictionary(lang);
  const to = routes(lang);

  return (
    <>
      <section aria-labelledby="process-title" className="board">
        <div className={`${container} pt-5 pb-11 lg:pt-7.5 lg:pb-20`}>
          <Breadcrumb items={[{ label: work.home, href: to.home }, { label: text.breadcrumb }]} />
          <h1 id="process-title" className="m-0 mt-7.5 lg:mt-12">
            <span className="sr-only">{text.titleText}</span>
            <span aria-hidden="true" className="hidden flex-col gap-6 lg:flex">
              <Led text={text.titleLed[0]} pitch={12} step={10} animate tone="white" />
              <Led text={text.titleLed[1]} pitch={12} step={10} delay={160} animate />
            </span>
            <span aria-hidden="true" className="flex flex-col gap-3 lg:hidden">
              <Led text={text.titleLed[0]} pitch={6} step={10} animate tone="white" />
              <Led text={text.titleLed[1]} pitch={6} step={10} delay={160} animate />
            </span>
          </h1>
          <div className="mt-6.5 flex flex-wrap items-end justify-between gap-7.5 lg:mt-11">
            <p className="rv m-0 max-w-[520px] text-lg text-on-board-2 lg:text-[21px]">
              {text.intro}
            </p>
            <dl className="rv m-0 grid grid-cols-3 gap-5 lg:gap-12">
              {text.stats.map(([label, value], i) => (
                <div key={label} className="min-w-0">
                  <dt className="text-[13px] text-muted-board">{label}</dt>
                  <dd className="m-0 mt-2">
                    <Led
                      text={value}
                      pitch={5}
                      tone={i === 0 ? "accent" : "white"}
                      label={value}
                      className="hidden lg:block"
                    />
                    <Led
                      text={value}
                      pitch={3.4}
                      tone={i === 0 ? "accent" : "white"}
                      label={value}
                      className="lg:hidden"
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <Stops text={text} />
      <CarryOn text={text.carry} />
      <AfterLanding text={text.after} />
    </>
  );
}
