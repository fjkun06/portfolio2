import { Led } from "@/components/Led";
import { container, sectionTitle } from "@/components/ui/layout";
import { SplitTitle } from "@/components/ui/SplitTitle";
import { LANGUAGES, TOOLS, type AboutContent } from "@/content/about";
import { fill } from "@/i18n/fill";

/**
 * "Why": one big stencil sentence that colours in as it scrolls past (read-on),
 * then the background in a normal paragraph.
 */
export function Why({ text }: { text: AboutContent["why"] }) {
  return (
    <section aria-label={text.label} className={`${container} pt-18 lg:pt-36`}>
      <p className="read-on m-0 max-w-[15em] font-stencil text-[40px] leading-[0.98] font-black tracking-[0.01em] uppercase lg:text-[84px]">
        {text.statement}
      </p>
      <p className="rv mt-6 mb-0 max-w-[620px] text-lg text-muted lg:mt-10 lg:text-xl">
        {text.body}
      </p>
    </section>
  );
}

/**
 * "Three languages on board": one row per language, each written in that language
 * (with a matching `lang` attribute so screen readers pronounce it right).
 */
export function Languages({ text }: { text: AboutContent["languages"] }) {
  return (
    <section aria-labelledby="languages-title" className={`${container} pt-18 lg:pt-36`}>
      <h2 id="languages-title" className={`rv-wipe ${sectionTitle}`}>
        <SplitTitle text={text.titleText} lines={text.title} />
      </h2>
      <ul className="m-0 mt-6.5 list-none border-b-[1.5px] border-ink p-0 lg:mt-12.5">
        {LANGUAGES.map((l) => (
          <li
            key={l.code}
            className="rv-left grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-2 border-t-[1.5px] border-ink py-5 lg:grid-cols-[110px_330px_minmax(0,1fr)] lg:gap-7.5 lg:py-7.5"
          >
            <span className="board inline-flex justify-self-start rounded px-2 py-1.5">
              <Led text={l.code} pitch={3.4} className="lg:hidden" />
              <Led text={l.code} pitch={5} className="hidden lg:block" />
            </span>
            <span
              lang={l.lang}
              className="font-stencil text-[40px] leading-[0.9] font-black tracking-[0.01em] lg:text-[64px]"
            >
              {l.name}
            </span>
            <span
              lang={l.lang}
              className="col-span-full text-lg leading-[1.4] text-muted lg:col-span-1 lg:text-[22px]"
            >
              {l.line}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const LOG_GRID =
  "lg:grid lg:grid-cols-[150px_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center lg:gap-6";

/** "Flight log": studies and jobs as a departures board, with a note per entry. */
export function FlightLog({ text }: { text: AboutContent["log"] }) {
  return (
    <section aria-labelledby="log-title" className="board mt-18 lg:mt-36">
      <div className={`${container} py-15 lg:py-28`}>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h2 id="log-title" className={`rv-wipe ${sectionTitle}`}>
            {text.title}
          </h2>
          <Led
            text={fill(text.count, { n: text.entries.length })}
            pitch={3}
            tone="grey"
            glow={false}
            className="rv"
          />
        </div>
        <div
          aria-hidden="true"
          className={`mt-12.5 hidden px-5.5 pb-3 text-[13px] text-muted-board ${LOG_GRID}`}
        >
          {text.columns.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        <ul className="m-0 mt-6.5 list-none border-b border-rule-board p-0 lg:mt-0">
          {text.entries.map((entry, i) => (
            <li
              key={entry.year + entry.role}
              className={`rv-flap flex flex-col gap-1.5 border-t border-rule-board px-3.5 py-4 lg:min-h-[78px] lg:px-5.5 lg:py-0 ${LOG_GRID}`}
            >
              <Led
                text={entry.year}
                pitch={3}
                tone={i === 0 ? "accent" : "white"}
                label={entry.year}
                className="lg:hidden"
              />
              <Led
                text={entry.year}
                pitch={4}
                tone={i === 0 ? "accent" : "white"}
                label={entry.year}
                className="hidden lg:block"
              />
              <span className="font-stencil text-[22px] font-extrabold tracking-[0.03em] lg:text-[28px]">
                {entry.role}
              </span>
              <span className="text-[15px] text-on-board-2">{entry.where}</span>
              <span className="text-sm text-muted-board">{entry.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "Instruments": the tools, as LED tiles on dark panels. */
export function Instruments({ text }: { text: AboutContent["tools"] }) {
  return (
    <section aria-labelledby="tools-title" className={`${container} pt-18 lg:pt-36`}>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <h2 id="tools-title" className={`rv-wipe ${sectionTitle}`}>
          {text.title}
        </h2>
        <p className="rv m-0 max-w-[380px] text-muted">{text.intro}</p>
      </div>
      <ul className="m-0 mt-6.5 grid list-none grid-cols-2 gap-2 p-0 lg:mt-12.5 lg:grid-cols-3 lg:gap-3">
        {TOOLS.map((tool, i) => (
          <li
            key={tool}
            className="board card-edge rv-scale flex min-h-[78px] items-center justify-center rounded-lg px-2.5 lg:min-h-[120px]"
          >
            <Led
              text={tool}
              pitch={2.6}
              tone={i % 2 ? "white" : "accent"}
              label={tool}
              className="lg:hidden"
            />
            <Led
              text={tool}
              pitch={4}
              tone={i % 2 ? "white" : "accent"}
              label={tool}
              className="hidden lg:block"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** "How I fly": three working principles, numbered with LED tags. */
export function Principles({ text }: { text: AboutContent["principles"] }) {
  return (
    <section aria-labelledby="how-title" className={`${container} pt-18 pb-18 lg:pt-36 lg:pb-36`}>
      <h2 id="how-title" className={`rv-wipe ${sectionTitle}`}>
        {text.title}
      </h2>
      <ol className="m-0 mt-6.5 list-none border-b-[1.5px] border-ink p-0 lg:mt-12.5">
        {text.items.map(([title, detail], i) => (
          <li
            key={title}
            className="rv border-t-[1.5px] border-ink pt-6 pb-6.5 lg:grid lg:grid-cols-[90px_minmax(0,1fr)_minmax(0,1fr)] lg:items-baseline lg:gap-7.5 lg:pt-7.5 lg:pb-8.5"
          >
            <span className="board inline-flex justify-self-start rounded px-1.5 py-1">
              <Led text={`0${i + 1}`} pitch={3} />
            </span>
            <h3 className="m-0 mt-3.5 font-stencil text-[40px] leading-[0.9] font-black uppercase lg:mt-0 lg:text-[60px]">
              {title}
            </h3>
            <p className="m-0 mt-2.5 text-muted lg:mt-0">{detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
