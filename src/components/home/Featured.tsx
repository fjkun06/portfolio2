import Image from "next/image";
import Link from "next/link";

import { Led } from "@/components/Led";
import { fill } from "@/i18n/fill";
import { container, ledTag } from "@/components/ui/layout";
import { Placeholder } from "@/components/ui/Placeholder";
import { SHOT_QUALITY, type Project } from "@/content/projects";
import type { Routes } from "@/i18n/routes";
import type { Dictionary } from "@/locales/en";

type FeaturedProps = {
  project: Project;
  text: Dictionary["home"]["featured"];
  status: Dictionary["status"];
  to: Routes;
};

/**
 * The featured project (Herzog trad'): name in huge stencil letters, a browser-framed screenshot
 * with a phone overlapping it, the story in two paragraphs, a small dark details board
 * (route, languages, payment, status) and three highlights.
 *
 * The screenshots come from the project (`image`, `imagePhone`); a striped placeholder stands in
 * for any that's missing.
 */
export function Featured({ project, text, status, to }: FeaturedProps) {
  const reportHref = `${to.work}/${project.slug}`;
  const details: [string, React.ReactNode][] = [
    [text.details.route, <Led key="r" text="CM ⇄ DE" pitch={3} />],
    [text.details.languages, <Led key="l" text={project.languages} pitch={3} />],
    [
      text.details.payment,
      <span key="p" className="font-stencil text-[19px] font-extrabold tracking-[0.06em]">
        {text.payment}
      </span>,
    ],
    [
      text.details.status,
      <span key="s" className="inline-flex">
        <span className="sr-only">{status[project.status]}</span>
        <Led text={project.status} pitch={3} />
      </span>,
    ],
  ];

  return (
    <section aria-labelledby="featured-title" className={`${container} pt-20 lg:pt-36`}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className={`m-0 ${ledTag}`}>
            <span className="sr-only">{text.tag}</span>
            <Led text={text.tag} pitch={3} />
          </p>
          <h2
            id="featured-title"
            className="rv-wipe m-0 mt-6 font-stencil text-[68px] leading-[0.86] font-black tracking-[0.01em] lg:text-[168px]"
          >
            {project.name}
          </h2>
        </div>
        <p className="rv m-0 mb-3.5 max-w-[330px] text-base text-muted">{text.intro}</p>
      </div>

      <div className="mt-10 flex flex-wrap items-start gap-14 lg:mt-14">
        <div className="rv-scale relative min-w-0 flex-[7_1_560px] pb-16">
          <Link
            href={reportHref}
            aria-label={text.reportLabel}
            className="shot board card-edge block overflow-hidden rounded-xl shadow-[0_50px_80px_-50px_rgba(0,0,0,0.6)]"
          >
            <span className="flex h-[42px] items-center gap-3 border-b border-rule-board px-4">
              <span aria-hidden="true" className="inline-flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-[9px] rounded-full bg-[var(--line-strong)]" />
                ))}
              </span>
              <span className="mx-auto text-[13px] text-muted-board">{project.website}</span>
            </span>
            {project.image ? (
              <Image
                src={project.image}
                alt={text.shotDesktop}
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw"
                quality={SHOT_QUALITY}
                placeholder="blur"
                className="block aspect-video w-full object-cover object-top"
              />
            ) : (
              <Placeholder label={text.shotDesktop} ratio="16 / 9" className="w-full" />
            )}
          </Link>
          <span className="shot board card-edge absolute right-0 bottom-0 w-[120px] rounded-[26px] p-2 shadow-[0_30px_50px_-30px_rgba(0,0,0,0.6)] lg:-right-6 lg:w-[190px]">
            {project.imagePhone ? (
              <Image
                src={project.imagePhone}
                alt={text.shotPhone}
                sizes="(min-width: 1024px) 174px, 104px"
                quality={SHOT_QUALITY}
                placeholder="blur"
                className="block aspect-[9/18] w-full rounded-[19px] object-cover object-top"
              />
            ) : (
              <Placeholder
                label={text.shotPhone}
                ratio="9 / 18"
                radius={19}
                className="text-[13px]"
              />
            )}
          </span>
        </div>

        <div className="min-w-0 flex-[5_1_380px]">
          <p className="rv m-0 text-xl leading-[1.45] font-medium tracking-[-0.01em] lg:text-[23px]">
            {text.lead}
          </p>
          <p className="rv mt-4.5 mb-0 text-muted">{text.body}</p>

          <dl className="board card-edge rv mt-8 mb-0 rounded-[10px] px-5.5 py-1.5">
            {details.map(([label, value], i) => (
              <div
                key={label}
                className={`flex min-h-[52px] items-center justify-between gap-4 ${i ? "border-t border-rule-board" : ""}`}
              >
                <dt className="text-[13px] text-muted-board">{label}</dt>
                <dd className="m-0">{value}</dd>
              </div>
            ))}
          </dl>

          <ul className="rv mt-8 mb-0 grid list-none grid-cols-1 border-t-[1.5px] border-ink p-0 sm:grid-cols-3">
            {text.highlights.map((h, i) => (
              <li
                key={h.title}
                className={`min-w-0 pt-4 sm:pr-3.5 ${i ? "border-t border-rule sm:border-t-0 sm:border-l sm:pl-3.5" : ""} pb-4 sm:pb-0`}
              >
                <span className="block font-stencil text-[30px] leading-[0.95] font-black tracking-[0.02em] uppercase">
                  {h.title}
                </span>
                <span className="mt-2 block text-sm leading-[1.45] text-muted">{h.text}</span>
              </li>
            ))}
          </ul>

          <div className="rv mt-9 flex flex-wrap items-center gap-x-5.5 gap-y-3.5">
            <Link
              href={reportHref}
              className="btn btn-ink min-h-[54px] px-6 text-[22px] font-extrabold"
            >
              {text.report.toUpperCase()}
            </Link>
            <a
              href={`https://${project.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline-offset-[6px]"
            >
              {fill(text.visit, { site: project.website })}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
