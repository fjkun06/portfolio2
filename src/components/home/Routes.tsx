import Link from "next/link";

import { Arrow } from "@/components/site/Arrow";
import { PlaneIcon } from "@/components/ui/icons";
import { container, sectionTitle } from "@/components/ui/layout";
import type { Dictionary } from "@/locales/en";

type RoutesProps = {
  text: Dictionary["home"]["routes"];
  /** Address of the Services page. */
  servicesHref: string;
};

/** A dotted flight line with a plane in the middle; it draws itself from left to right on scroll. */
function FlightLine({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`rv-line relative block h-[3px] ${className}`}
      style={{
        background: "repeating-linear-gradient(90deg, var(--ink) 0 3px, transparent 3px 10px)",
      }}
    >
      <span className="absolute top-[-13px] left-1/2 -ml-[14px] text-ink">
        <PlaneIcon size={28} />
      </span>
    </span>
  );
}

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
          <span className="sr-only">{text.titleText}</span>
          <span aria-hidden="true">
            {text.title[0]}
            <br />
            {text.title[1]}
          </span>
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
        {text.items.map((r) => (
          <li
            key={r.title}
            className="rv border-t-[1.5px] border-ink pt-6.5 pb-7 lg:pt-8.5 lg:pb-9.5"
          >
            <div className="flex flex-col gap-4.5 lg:flex-row lg:items-center lg:gap-6">
              <span className="font-stencil text-[42px] leading-[0.92] font-black tracking-[0.01em] lg:flex-none lg:text-[64px] lg:leading-[0.9]">
                {r.from}
              </span>
              <FlightLine className="lg:min-w-20 lg:flex-1" />
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
