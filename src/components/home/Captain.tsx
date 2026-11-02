import Link from "next/link";

import { Led } from "@/components/Led";
import { Arrow } from "@/components/site/Arrow";
import { container, ledTag, sectionTitle } from "@/components/ui/layout";
import { PortraitFrame } from "@/components/ui/PortraitFrame";
import type { LogEntry } from "@/content/about";
import type { Dictionary } from "@/locales/en";

type CaptainProps = {
  text: Dictionary["home"]["captain"];
  /** Flight log entries (shared with the About page, which also shows their notes). */
  entries: LogEntry[];
  /** Address of the About page. */
  aboutHref: string;
};

/**
 * "Your captain": who builds the site.
 * A black-and-white portrait centred in a dark frame with dotted side panels, the story in two
 * paragraphs, and the flight log (studies and jobs) as a small departures board.
 */
export function Captain({ text, entries, aboutHref }: CaptainProps) {
  return (
    <section id="captain" aria-labelledby="captain-title" className={`${container} pt-20 lg:pt-40`}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="captain-title" className={`rv-wipe ${sectionTitle}`}>
          {text.title}
        </h2>
        <div className="flex flex-col items-start gap-1 lg:items-end">
          <p className={`m-0 ${ledTag}`}>
            <span className="sr-only">{text.onDuty}</span>
            <Led text={text.onDuty} pitch={3} />
          </p>
          <Link
            href={aboutHref}
            className="rv mt-3.5 inline-flex items-center gap-2.5 font-semibold underline-offset-[6px]"
          >
            {text.more} <Arrow />
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-stretch gap-14 lg:mt-13">
        <div className="flex min-w-0 flex-[1_1_460px]">
          <PortraitFrame alt={text.photo} caption={text.caption} />
        </div>

        <div className="flex min-w-0 flex-[1_1_520px] flex-col">
          <p className="rv m-0 text-[22px] leading-[1.35] font-medium tracking-[-0.015em] lg:text-[30px] lg:leading-[1.3]">
            {text.lead}
          </p>
          <p className="rv mt-5.5 mb-0 text-muted lg:text-[19px]">{text.body}</p>

          <div className="board card-edge mt-auto rounded-[10px] px-4 pt-3.5 pb-1.5 max-lg:mt-7 lg:px-5.5 lg:pt-4.5 lg:pb-2">
            <h3 className="sr-only">{text.log}</h3>
            <div
              aria-hidden="true"
              className="hidden grid-cols-[120px_minmax(0,1.3fr)_minmax(0,1fr)] gap-4 pb-2.5 text-[13px] text-muted-board lg:grid"
            >
              {text.logColumns.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <p aria-hidden="true" className="m-0 mb-1.5 text-[13px] text-muted-board lg:hidden">
              {text.log}
            </p>
            <ul className="m-0 list-none p-0">
              {entries.map((entry) => (
                <li
                  key={entry.year + entry.role}
                  className="rv-left border-t border-rule-board py-3 lg:grid lg:min-h-[54px] lg:grid-cols-[120px_minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-4 lg:py-0"
                >
                  <span className="flex items-center justify-between gap-2.5 lg:block">
                    <Led text={entry.year} pitch={3} tone="white" label={entry.year} />
                    <span className="text-sm text-on-board-2 lg:hidden">{entry.where}</span>
                  </span>
                  <span className="mt-1.5 block font-stencil text-[21px] font-extrabold tracking-[0.04em] lg:mt-0">
                    {entry.role}
                  </span>
                  <span className="hidden text-[15px] text-on-board-2 lg:block">{entry.where}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
