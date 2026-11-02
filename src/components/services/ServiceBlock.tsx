import Link from "next/link";

import { Led } from "@/components/Led";
import { FlightLine } from "@/components/ui/FlightLine";
import { CheckLed } from "@/components/ui/icons";
import type { Service, ServicesContent } from "@/content/services";
import { fill } from "@/i18n/fill";

type ServiceBlockProps = {
  service: Service;
  index: number;
  total: number;
  text: ServicesContent;
  /** Where the example link goes and the name it shows, if this service has one. */
  example: { href: string; name: string } | null;
};

/**
 * One service on the Services page:
 * route code and position ("ROUTE MLT · 01 / 04"), the trip from → to in huge stencil letters,
 * the title, a lead and a paragraph, "Good for" chips, an optional example link,
 * and a dark "ON BOARD" panel listing what's included (each line flips in with an LED tick).
 */
export function ServiceBlock({ service: s, index, total, text, example }: ServiceBlockProps) {
  return (
    <article
      id={s.code.toLowerCase()}
      aria-labelledby={`service-${s.code}`}
      className="scroll-mt-28 border-t-[1.5px] border-ink pt-12 pb-13.5 lg:pt-20 lg:pb-22.5"
    >
      <div className="mb-6.5 flex items-center justify-between gap-4 lg:mb-10">
        <span className="rv board chip-line inline-flex rounded px-2.5 py-2">
          <Led text={`${text.routeTag} ${s.code}`} pitch={3} label={`${text.routeTag} ${s.code}`} />
        </span>
        <span className="text-[13px] text-label">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:gap-7">
        <span className="rv-left font-stencil text-[40px] leading-[0.9] font-black lg:flex-none lg:text-[76px]">
          {s.from}
        </span>
        <FlightLine index={index} className="lg:min-w-20 lg:flex-1" />
        <span className="rv font-stencil text-[40px] leading-[0.9] font-black text-accent-ink lg:flex-none lg:text-[76px]">
          {s.to}
        </span>
      </div>

      <div className="mt-7.5 flex flex-wrap items-start gap-7.5 lg:mt-14 lg:gap-16">
        <div className="min-w-0 flex-[1_1_460px]">
          <h3
            id={`service-${s.code}`}
            className="rv m-0 text-2xl leading-[1.2] font-bold tracking-[-0.015em] lg:text-3xl"
          >
            {s.title}
          </h3>
          <p className="rv mt-3.5 mb-0 text-[19px] leading-[1.45] font-medium lg:text-[22px]">
            {s.lead}
          </p>
          <p className="rv mt-3.5 mb-0 max-w-[58ch] text-muted">{s.body}</p>
          <p className="rv mt-6.5 mb-2.5 text-[13px] text-label">{text.goodFor}</p>
          <ul className="rv m-0 flex list-none flex-wrap gap-2 p-0">
            {s.goodFor.map((g) => (
              <li
                key={g}
                className="inline-flex min-h-9 items-center rounded border-[1.5px] border-ink px-3 font-stencil text-[17px] font-extrabold tracking-[0.06em] uppercase"
              >
                {g}
              </li>
            ))}
          </ul>
          {example && (
            <Link
              href={example.href}
              className="rv mt-6.5 inline-flex items-center gap-2.5 font-semibold underline-offset-[6px]"
            >
              {fill(text.example, { name: example.name })}
            </Link>
          )}
        </div>
        <div className="board card-edge rv-scale min-w-0 flex-[1_1_400px] rounded-xl px-4.5 pt-4 pb-3 lg:px-6.5 lg:pt-5.5 lg:pb-4.5">
          <div className="flex items-center justify-between pb-3.5">
            <Led text={text.included} pitch={3} tone="white" label={text.included} />
            <span className="text-[13px] text-muted-board">{text.includedNote}</span>
          </div>
          <ul className="m-0 list-none p-0">
            {s.included.map((item) => (
              <li
                key={item}
                className="rv-flap flex min-h-[50px] items-center gap-3.5 border-t border-rule-board lg:min-h-14"
              >
                <span className="inline-flex flex-none">
                  <CheckLed />
                </span>
                <span className="text-[15px] text-on-board-2 lg:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
