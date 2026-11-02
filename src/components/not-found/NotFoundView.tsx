import Link from "next/link";

import { Led } from "@/components/Led";
import { Arrow } from "@/components/site/Arrow";
import { container, sectionTitle } from "@/components/ui/layout";
import { LedTitle } from "@/components/ui/LedTitle";
import { notFoundContent } from "@/content/not-found";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";

/** Slug of the project with a full flight report, linked from the 404 page. */
export const REPORT_SLUG = "herzog";

/**
 * The 404 page ("Flight not found"): a cancelled-flight board with buttons home and to the
 * work page, then a short list of other places to go.
 */
export function NotFoundView({ lang }: { lang: Locale }) {
  const text = notFoundContent[lang];
  const to = routes(lang);
  const links = [
    { code: "HOM", label: text.links.home, href: to.home },
    { code: "WRK", label: text.links.work, href: to.work },
    { code: "FJ1", label: text.links.report, href: `${to.work}/${REPORT_SLUG}` },
    { code: "TKT", label: text.links.book, href: to.contact },
  ];

  return (
    <>
      <title>{text.title}</title>
      <section aria-labelledby="nf-title" className="board">
        <div className={`${container} pt-7 pb-12 lg:pt-12.5 lg:pb-24`}>
          <div className="flex items-center justify-between gap-3 border-b border-rule-board pb-5">
            <Led text={text.error} pitch={3} tone="grey" glow={false} label={text.error} />
            <span>
              <span className="sr-only">{text.statusText}</span>
              <Led text={text.status} pitch={3.4} tone="white" className="blink" />
            </span>
          </div>
          <div className="mt-8.5 lg:mt-16">
            <LedTitle id="nf-title" lines={text.titleLed} text={text.titleText} pitch={14} />
          </div>
          <p className="rv mt-6 mb-0 max-w-[520px] text-lg text-on-board-2 lg:mt-10 lg:text-[21px]">
            {text.text}
          </p>
          <div className="rv mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={to.home} className="btn btn-accent min-h-[58px] px-6.5 text-2xl">
              {text.home.toUpperCase()}
            </Link>
            <Link href={to.work} className="btn btn-ghost min-h-[58px] px-5.5 text-2xl">
              {text.work.toUpperCase()}
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="nf-others" className={`${container} pt-15 pb-18 lg:pt-25 lg:pb-30`}>
        <h2 id="nf-others" className={`rv-wipe ${sectionTitle}`}>
          {text.others}
        </h2>
        <ul className="m-0 mt-7 list-none border-b-[1.5px] border-ink p-0">
          {links.map((l) => (
            <li key={l.code} className="rv-left">
              <Link
                href={l.href}
                className="row-light grid min-h-16 grid-cols-[56px_minmax(0,1fr)_28px] items-center gap-4 border-t-[1.5px] border-ink no-underline lg:min-h-[78px] lg:grid-cols-[90px_minmax(0,1fr)_28px]"
              >
                <span className="board inline-flex justify-self-start rounded px-1.5 py-1">
                  <Led text={l.code} pitch={2.6} />
                </span>
                <span className="font-stencil text-[28px] font-black tracking-[0.02em] uppercase lg:text-[38px]">
                  {l.label}
                </span>
                <span className="row-go inline-flex">
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
