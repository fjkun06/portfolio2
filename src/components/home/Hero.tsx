import Link from "next/link";

import { HeroCycle } from "@/components/home/HeroCycle";
import { flipDelays, Led } from "@/components/Led";
import { container } from "@/components/ui/layout";
import type { Locale } from "@/i18n/config";
import type { Routes } from "@/i18n/routes";
import type { Dictionary } from "@/locales/en";

/** Order of the rotation, as on the design: English, French, German. */
const ROTATION: Locale[] = ["en", "fr", "de"];

/** The board word for each language, as on a real departures board. */
const BOARD_WORDS: Record<Locale, string> = { en: "DEPARTURES", fr: "DÉPARTS", de: "ABFLUG" };

type HeroProps = {
  lang: Locale;
  /** The hero texts of all three languages, for the rotating headline. */
  heroes: Record<Locale, Dictionary["home"]["hero"]>;
  to: Routes;
};

/**
 * One headline in LED dots, in two shapes: three long lines from 1024 px, five short lines below
 * (the long lines wouldn't fit a phone). The last line(s) are in the accent colour.
 * Each line switches on column by column, one line after the other; a few seconds later the
 * letters flip once like a split-flap board, in one wave through the lines.
 */
function Headline({ hero }: { hero: Dictionary["home"]["hero"] }) {
  const waves = flipDelays(hero.headline);
  const wavesShort = flipDelays(hero.headlineShort);
  return (
    <>
      <span className="hidden flex-col gap-5 lg:flex">
        {hero.headline.map((line, i) => (
          <Led
            key={line}
            text={line}
            pitch={10}
            step={7}
            delay={i * 260}
            animate
            flip="once"
            flipDelay={waves[i]}
            tone={i === hero.headline.length - 1 ? "accent" : "white"}
          />
        ))}
      </span>
      <span className="flex flex-col gap-[9px] lg:hidden">
        {hero.headlineShort.map((line, i, all) => (
          <Led
            key={line}
            text={line}
            pitch={4.6}
            step={6}
            delay={i * 180}
            animate
            flip="once"
            flipDelay={wavesShort[i]}
            tone={i >= all.length - 2 ? "accent" : "white"}
          />
        ))}
      </span>
    </>
  );
}

/**
 * Top of the home page: the departures board header (DEPARTURES · DÉPARTS · ABFLUG and the
 * route), the rotating LED headline, the introduction and the two main buttons.
 * The departures table (DepartureBoard) continues on the same dark board right below.
 */
export function Hero({ lang, heroes, to }: HeroProps) {
  const hero = heroes[lang];
  const variants = ROTATION.map((l) => ({
    lang: l,
    word: BOARD_WORDS[l],
    headline: <Headline hero={heroes[l]} />,
  }));

  return (
    <section aria-labelledby="hero-title" className="board">
      <div className={`${container} pt-7 lg:pt-11`}>
        <HeroCycle
          variants={variants}
          start={lang}
          aside={
            <span className="hidden items-center gap-3 text-sm text-muted-board sm:inline-flex">
              {hero.route} <Led text="CM ⇄ DE" pitch={4} label={hero.routeLabel} />
            </span>
          }
        />

        <h1 id="hero-title" className="sr-only">
          {hero.headlineText}
        </h1>

        <div className="flex flex-wrap items-end justify-between gap-9 pt-12 pb-12 lg:pt-14 lg:pb-16">
          <p className="m-0 max-w-[31em] text-lg leading-[1.45] text-on-board-2 lg:text-[22px]">
            {hero.intro}
          </p>
          <div className="flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
            <Link href={to.contact} className="btn btn-accent min-h-[58px] px-7 text-2xl">
              {hero.book.toUpperCase()}
            </Link>
            <a href="#departures" className="btn btn-ghost min-h-[58px] px-6 text-2xl">
              {hero.departures.toUpperCase()}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
