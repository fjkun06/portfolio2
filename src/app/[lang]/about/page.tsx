import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  FlightLog,
  Instruments,
  Languages,
  Principles,
  Why,
} from "@/components/about/AboutSections";
import { Led } from "@/components/Led";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { container } from "@/components/ui/layout";
import { LedTitle } from "@/components/ui/LedTitle";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import { aboutContent } from "@/content/about";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes } from "@/i18n/routes";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return pageMetadata({ lang, path: "/about", ...aboutContent[lang].meta, imageAlt: meta.ogAlt });
}

/**
 * The About page: "Your captain" hero with the portrait, why I do this, the three languages,
 * the flight log, the tools and how I work.
 */
export default function AboutPage({ params }: PageProps<"/[lang]/about">) {
  return (
    <Suspense>
      <About params={params} />
    </Suspense>
  );
}

async function About({ params }: { params: PageProps<"/[lang]/about">["params"] }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const text = aboutContent[lang];
  const { work } = await getDictionary(lang);
  const to = routes(lang);

  return (
    <>
      <section aria-labelledby="about-title" className="board">
        <div className={`${container} pt-5 pb-12.5 lg:pt-7.5 lg:pb-22.5`}>
          <Breadcrumb items={[{ label: work.home, href: to.home }, { label: text.breadcrumb }]} />
          <div className="mt-7.5 flex flex-wrap items-center gap-7.5 lg:mt-12 lg:gap-16">
            <div className="min-w-0 flex-[1_1_520px]">
              <LedTitle id="about-title" lines={text.titleLed} text={text.titleText} pitch={11} />
              <p className="rv mt-5.5 mb-0 flex flex-wrap gap-2.5 lg:mt-9">
                {text.badges.map((badge, i) => (
                  <span
                    key={badge}
                    className="inline-flex rounded border border-rule-board px-2 py-1.5"
                  >
                    <Led
                      text={badge}
                      pitch={3}
                      tone={i ? "white" : "accent"}
                      label={badge}
                      className="h-auto max-w-full"
                    />
                  </span>
                ))}
              </p>
              <p className="rv mt-5.5 mb-0 max-w-[500px] text-lg text-on-board-2 lg:mt-7.5 lg:text-[21px]">
                {text.intro}
              </p>
            </div>
            <div className="flex min-w-0 flex-[1_1_440px]">
              <PortraitFrame alt={text.photo} caption={text.caption} priority />
            </div>
          </div>
        </div>
      </section>

      <Why text={text.why} />
      <Languages text={text.languages} />
      <FlightLog text={text.log} />
      <Instruments text={text.tools} />
      <Principles text={text.principles} />
    </>
  );
}
