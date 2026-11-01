import Link from "next/link";
import { notFound } from "next/navigation";

import { Led } from "@/components/Led";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes } from "@/i18n/routes";

/**
 * Temporary page to check the foundation: header, footer, LED lettering, modes and scroll reveals.
 * The real home page replaces it in the next step.
 */
export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { preview, nav } = await getDictionary(lang);
  const to = routes(lang);

  const words = [
    { lang: "en", word: "DEPARTURES" },
    { lang: "fr", word: "DÉPARTS" },
    { lang: "de", word: "ABFLUG" },
  ];

  return (
    <>
      <section aria-labelledby="hero-title" className="board">
        <div className="mx-auto max-w-[1280px] px-4 pt-7 pb-12 lg:px-10 lg:pt-11 lg:pb-16">
          <p className="m-0 flex gap-5 border-b border-rule-board pb-6 font-stencil text-2xl leading-none font-black tracking-[0.05em] lg:gap-7 lg:text-[34px]">
            {words.map((w) => (
              <span
                key={w.lang}
                lang={w.lang}
                style={{ color: w.lang === lang ? "var(--led)" : "var(--text-off)" }}
              >
                {w.word}
              </span>
            ))}
          </p>

          <h1 id="hero-title" className="mt-10 mb-0 lg:mt-16">
            <span className="sr-only">{preview.headlineText}</span>
            <span aria-hidden="true" className="hidden flex-col gap-5 lg:flex">
              {preview.headline.map((line, i) => (
                <Led
                  key={line}
                  text={line}
                  pitch={10}
                  step={7}
                  delay={i * 260}
                  animate
                  tone={i === 2 ? "accent" : "white"}
                />
              ))}
            </span>
            <span aria-hidden="true" className="flex flex-col gap-[9px] lg:hidden">
              {preview.headlineShort.map((line, i, all) => (
                <Led
                  key={line}
                  text={line}
                  pitch={4.6}
                  step={6}
                  delay={i * 180}
                  animate
                  tone={i >= all.length - 2 ? "accent" : "white"}
                />
              ))}
            </span>
          </h1>

          <p className="mt-10 max-w-[31em] text-lg text-on-board-2 lg:text-[22px] lg:leading-[1.45]">
            {preview.note}
          </p>
          <div className="mt-7 flex flex-col gap-3.5 sm:flex-row">
            <Link href={to.contact} className="btn btn-accent min-h-[58px] px-7 text-2xl">
              {nav.book.toUpperCase()}
            </Link>
            <Link href={to.work} className="btn btn-ghost min-h-[58px] px-6 text-2xl">
              {nav.work.toUpperCase()}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-20 lg:px-10 lg:py-36">
        {preview.sections.map((title, i) => (
          <div key={title} className="border-t-[1.5px] border-ink py-12">
            <span className="board chip-line inline-flex rounded px-2 py-1.5">
              <Led text={`0${i + 1}`} pitch={3} />
            </span>
            <h2
              className={`${["rv", "rv-left", "rv-wipe"][i]} mt-6 mb-0 font-stencil text-[52px] leading-[0.9] font-black lg:text-[104px]`}
            >
              {title.toUpperCase()}
            </h2>
          </div>
        ))}
      </section>

      <section className="board">
        <ul className="mx-auto max-w-[1280px] list-none px-4 py-14 lg:px-10">
          {["HERZOG TRAD'", "TRANSLATPRO", "FIRST TRUCKS SARL", "DIGTAL"].map((name, i) => (
            <li
              key={name}
              className="rv-flap flex min-h-[78px] items-center justify-between border-t border-rule-board"
            >
              <span className="font-stencil text-[30px] font-extrabold tracking-[0.03em] lg:text-[34px]">
                {name}
              </span>
              <Led
                text={i === 1 ? "BOARDING" : "LIVE"}
                pitch={4}
                tone={i === 1 ? "white" : "accent"}
                className={i === 1 ? "blink" : ""}
              />
            </li>
          ))}
        </ul>
      </section>
      <div className="h-[60vh]" />
    </>
  );
}
