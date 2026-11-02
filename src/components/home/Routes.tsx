import Link from "next/link";

import { Arrow } from "@/components/site/Arrow";
import { FlightLine } from "@/components/ui/FlightLine";
import { container, sectionTitle } from "@/components/ui/layout";
import { SplitTitle } from "@/components/ui/SplitTitle";
import type { Dictionary } from "@/locales/en";

type RoutesProps = {
  text: Dictionary["home"]["routes"];
  /** Address of the Services page. */
  servicesHref: string;
};

/**
 * "Routes I fly": the four services, each told as a trip from where the client is now
 * to where they want to be ("ONE LANGUAGE ✈ THREE LANGUAGES").
 * Desktop: departure, flight line and arrival on one row. Phones: stacked.
 */
export function Routes({ text, servicesHref }: RoutesProps) {
  return (
    <section id="routes" aria-labelledby="routes-title" className={`${container} pt-20 lg:pt-36`}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="routes-title" className={`rv-wipe ${sectionTitle}`}>
          <SplitTitle text={text.titleText} lines={text.title} />
        </h2>
        <div className="max-w-[380px]">
          <p className="rv m-0 text-muted">{text.intro}</p>
          <Link
            href={servicesHref}
            className="rv mt-3.5 inline-flex items-center gap-2.5 font-semibold underline-offset-[6px]"
          >
            {text.more} <Arrow />
          </Link>
        </div>
      </div>

      <ul className="mt-10 mb-0 list-none border-b-[1.5px] border-ink p-0 lg:mt-14">
        {text.items.map((r, i) => (
          <li
            key={r.title}
            className="rv border-t-[1.5px] border-ink pt-6.5 pb-7 lg:pt-8.5 lg:pb-9.5"
          >
            <div className="flex flex-col gap-4.5 lg:flex-row lg:items-center lg:gap-6">
              <span className="font-stencil text-[42px] leading-[0.92] font-black tracking-[0.01em] lg:flex-none lg:text-[64px] lg:leading-[0.9]">
                {r.from}
              </span>
              <FlightLine index={i} className="lg:min-w-20 lg:flex-1" />
              <span className="font-stencil text-[42px] leading-[0.92] font-black tracking-[0.01em] text-accent-ink lg:flex-none lg:text-[64px] lg:leading-[0.9]">
                {r.to}
              </span>
            </div>
            <div className="mt-4.5 flex flex-wrap gap-x-10 gap-y-1.5">
              <h3 className="m-0 flex-[0_1_360px] text-xl font-bold tracking-[-0.01em] lg:text-[22px]">
                {r.title}
              </h3>
              <p className="m-0 max-w-[56ch] flex-[1_1_400px] text-base text-muted lg:text-lg">
                {r.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
