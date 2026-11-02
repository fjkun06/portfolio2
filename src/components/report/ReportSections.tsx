import Image from "next/image";
import Link from "next/link";

import { Led } from "@/components/Led";
import { Arrow } from "@/components/site/Arrow";
import { container, sectionTitle } from "@/components/ui/layout";
import { Placeholder } from "@/components/ui/Placeholder";
import type { Project } from "@/content/projects";
import type { Report } from "@/content/reports/herzog";
import { fill } from "@/i18n/fill";
import type { Dictionary } from "@/locales/en";

type Text = Dictionary["report"];

/** The homepage screenshot in a browser frame, tilted up as it arrives and overlapping the board. */
export function HomepageShot({ project, text }: { project: Project; text: Text }) {
  return (
    <section
      aria-label={text.homepage}
      className={`rv-tilt relative ${container} -mt-[84px] lg:-mt-[150px]`}
    >
      <div className="shot board card-edge overflow-hidden rounded-xl shadow-[0_60px_90px_-50px_rgba(0,0,0,0.6)] lg:rounded-[14px]">
        <div className="flex h-[34px] items-center gap-3.5 border-b border-rule-board px-4.5 lg:h-[46px]">
          <span aria-hidden="true" className="hidden gap-1.5 lg:inline-flex">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-[9px] rounded-full bg-[var(--line-strong)]" />
            ))}
          </span>
          <span className="mx-auto">
            <Led
              text={project.website.toUpperCase()}
              pitch={2.4}
              tone="grey"
              glow={false}
              label={project.website}
            />
          </span>
          <a
            href={`https://${project.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-[13px] text-muted-board lg:inline"
          >
            {text.openSite}
          </a>
        </div>
        {project.image ? (
          <Image
            src={project.image}
            alt={fill(text.shotHome, { site: project.website })}
            sizes="(min-width: 1280px) 1200px, 100vw"
            placeholder="blur"
            loading="eager"
            className="block aspect-[16/8.5] w-full object-cover object-top"
          />
        ) : (
          <Placeholder
            label={fill(text.shotHome, { site: project.website })}
            ratio="16 / 8.5"
            className="w-full"
          />
        )}
      </div>
    </section>
  );
}

/** "The brief": the big sentence that colours in as you read, then the client and the goal. */
export function Brief({ report, text }: { report: Report; text: Text }) {
  return (
    <section aria-labelledby="brief-title" className={`${container} pt-20 lg:pt-36`}>
      <h2 id="brief-title" className={`rv-wipe ${sectionTitle}`}>
        {text.brief}
      </h2>
      <p className="read-on mt-5.5 mb-0 max-w-[24ch] text-[28px] leading-[1.18] font-medium tracking-[-0.015em] lg:mt-9 lg:text-[46px] lg:leading-[1.12] lg:tracking-[-0.02em]">
        {report.lead}
      </p>
      <div className="mt-8 grid max-w-[1060px] grid-cols-1 gap-6 lg:mt-13 lg:grid-cols-2 lg:gap-14">
        {[
          [text.client, report.clientText],
          [text.goal, report.goalText],
        ].map(([title, body]) => (
          <div key={title} className="rv">
            <h3 className="m-0 mb-2.5 font-stencil text-[26px] font-black lg:text-[30px]">
              {title}
            </h3>
            <p className="m-0 text-[#33373d]">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * "The journey": the four screens a customer goes through.
 * Desktop: four phones in a row, drifting up and down at different speeds as you scroll.
 * Phones: a horizontal strip you swipe through, one phone at a time (scroll snapping).
 */
export function Journey({ report, text }: { report: Report; text: Text }) {
  return (
    <section aria-labelledby="journey-title" className="pt-20 lg:pt-36">
      <div className={`${container} flex flex-wrap items-end justify-between gap-5`}>
        <h2 id="journey-title" className={`rv-wipe ${sectionTitle}`}>
          {text.journey}
        </h2>
        <p className="rv m-0 max-w-[340px] text-base text-muted lg:mb-2">
          {report.journeyIntro} <span className="lg:hidden">{text.swipe}</span>
        </p>
      </div>
      <div className={`${container} max-lg:px-0`}>
        <ol className="m-0 mt-7 flex list-none snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2.5 lg:mt-13 lg:snap-none lg:gap-9 lg:overflow-visible lg:px-0 lg:pb-0">
          {report.journey.map((s, i) => (
            <li key={s.step} className="rv min-w-0 flex-[0_0_210px] snap-start lg:flex-[1_1_220px]">
              <div
                className={`board card-edge rounded-[24px] p-2 shadow-[0_30px_40px_-30px_rgba(0,0,0,0.45)] lg:rounded-[28px] lg:p-2.5 ${i % 2 === 0 ? "px-up" : "px-down"}`}
              >
                <div className="overflow-hidden rounded-[17px] lg:rounded-[20px]">
                  <Placeholder
                    label={fill(text.shotScreen, { step: s.step.toLowerCase() })}
                    ratio="9 / 17"
                    className="w-full text-xs lg:text-[15px]"
                  />
                </div>
              </div>
              <p className="board chip-line m-0 mt-3.5 inline-flex rounded px-1.5 py-1 lg:mt-5 lg:px-[7px] lg:py-[5px]">
                <Led text={`0${i + 1}`} pitch={4} label={String(i + 1)} />
              </p>
              <h3 className="m-0 mt-2 font-stencil text-[32px] leading-[0.95] font-black lg:mt-2.5 lg:text-[40px]">
                {s.step}
              </h3>
              <p className="m-0 mt-1.5 text-[15px] text-muted lg:mt-2 lg:text-base">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** "The manifest": what was built, as six LED-coded entries, then the tools used. */
export function Manifest({ report, text }: { report: Report; text: Text }) {
  return (
    <section aria-labelledby="manifest-title" className={`${container} pt-20 lg:pt-36`}>
      <h2 id="manifest-title" className={`rv-wipe ${sectionTitle}`}>
        {text.manifest}
      </h2>
      <ul className="m-0 mt-6.5 grid list-none grid-cols-1 border-b-[1.5px] border-ink p-0 lg:mt-11 lg:grid-cols-3">
        {report.manifest.map((m, i) => (
          <li
            key={m.code}
            className={`rv-flap grid min-w-0 grid-cols-[64px_minmax(0,1fr)] gap-3.5 border-t-[1.5px] border-ink pt-5.5 pb-6 lg:block lg:pt-7.5 lg:pr-7.5 lg:pb-8.5 ${i % 3 ? "lg:border-l lg:border-l-rule lg:pl-7.5" : ""}`}
          >
            <span className="board chip-line inline-flex self-start justify-self-start rounded px-1.5 py-[5px] lg:px-2 lg:py-1.5">
              <Led text={m.code} pitch={3} className="lg:hidden" />
              <Led text={m.code} pitch={4} className="hidden lg:block" />
            </span>
            <span className="block lg:mt-4">
              <h3 className="m-0 font-stencil text-[28px] leading-[0.95] font-black lg:text-[34px]">
                {m.title}
              </h3>
              <p className="m-0 mt-1.5 text-[15px] text-muted lg:mt-2 lg:text-base">{m.text}</p>
            </span>
          </li>
        ))}
      </ul>
      <p className="rv mt-6.5 mb-2.5 text-[13px] text-label lg:mt-9 lg:mb-3">{text.builtWith}</p>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0 lg:gap-2">
        {report.stack.map((tool) => (
          <li
            key={tool}
            className="rv-flap board chip-line inline-flex rounded px-2.5 py-2 lg:px-3 lg:py-[9px]"
          >
            <Led text={tool} pitch={3} tone="white" label={tool} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The client's words, on a dark card. Not shown while the report has no quote yet. */
export function Quote({ report, text }: { report: Report; text: Text }) {
  if (!report.quote) return null;
  return (
    <section aria-label={text.quote} className={`rv ${container} pt-20 lg:pt-36`}>
      <figure className="board card-edge m-0 flex flex-wrap items-start gap-8 rounded-xl px-5.5 py-6.5 lg:rounded-[14px] lg:px-14 lg:py-13">
        <span aria-hidden="true">
          <Led text="''" pitch={8} />
        </span>
        <div className="min-w-0 flex-[1_1_600px]">
          <blockquote className="rv-wipe m-0 font-stencil text-[34px] leading-[1.02] font-extrabold tracking-[0.01em] lg:text-[54px]">
            {report.quote}
          </blockquote>
          <figcaption className="mt-3.5 text-sm text-muted-board lg:mt-5.5 lg:text-base">
            {report.quoteBy}
          </figcaption>
        </div>
      </figure>
    </section>
  );
}

/** Band at the end of a report leading to the next project, its name in LED dots. */
export function NextDeparture({
  project,
  href,
  text,
}: {
  project: Project;
  href: string;
  text: Text;
}) {
  const words = project.name.split(" ");
  const half = Math.ceil(words.length / 2);
  return (
    <Link
      href={href}
      className="board group mt-20 block border-b border-rule-board no-underline lg:mt-36"
    >
      <div
        className={`${container} flex flex-wrap items-end justify-between gap-5 pt-10 pb-11 lg:gap-8 lg:pt-15 lg:pb-16.5`}
      >
        <div>
          <p className="m-0 mb-3.5 text-[13px] text-muted-board lg:mb-4.5 lg:text-sm">
            {fill(text.next, { code: project.code })}
          </p>
          <span className="sr-only">{project.name}</span>
          <span aria-hidden="true" className="rv-wipe hidden lg:block">
            <Led text={project.name} pitch={9} tone="white" />
          </span>
          <span aria-hidden="true" className="flex flex-col gap-2.5 lg:hidden">
            <Led text={words.slice(0, half).join(" ")} pitch={4.6} tone="white" />
            {words.length > 1 && (
              <Led text={words.slice(half).join(" ")} pitch={4.6} tone="white" />
            )}
          </span>
        </div>
        <span className="row-go inline-flex items-center gap-3 font-stencil text-[22px] font-black tracking-[0.05em] text-on-board group-hover:text-[var(--led)] lg:text-[26px]">
          {text.board.toUpperCase()} <Arrow />
        </span>
      </div>
    </Link>
  );
}
