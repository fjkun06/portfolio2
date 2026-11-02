import { Led } from "@/components/Led";
import { Disclosure } from "@/components/site/Disclosure";
import { container, sectionTitle } from "@/components/ui/layout";
import { SplitTitle } from "@/components/ui/SplitTitle";
import type { ServicesContent } from "@/content/services";

/** Two-line section heading, its words written once (see SplitTitle). */
function TwoLineTitle({ id, lines, text }: { id: string; lines: [string, string]; text: string }) {
  return (
    <h2 id={id} className={`rv-wipe ${sectionTitle}`}>
      <SplitTitle text={text} lines={lines} />
    </h2>
  );
}

/** "On every flight": eight things included with every service, as LED-coded tiles. */
export function Always({ text }: { text: ServicesContent["always"] }) {
  return (
    <section aria-labelledby="always-title" className="board mt-5 lg:mt-10">
      <div className={`${container} pt-15 pb-15 lg:pt-28 lg:pb-28`}>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <TwoLineTitle id="always-title" lines={text.title} text={text.titleText} />
          <p className="rv m-0 max-w-[360px] text-on-board-2">{text.intro}</p>
        </div>
        <ul className="m-0 mt-7.5 grid list-none grid-cols-1 border-b border-rule-board p-0 sm:grid-cols-2 lg:mt-12.5 lg:grid-cols-4 lg:border-r">
          {text.items.map((item) => (
            <li
              key={item.code}
              className="rv-flap min-w-0 border-t border-rule-board px-4 py-4.5 lg:border-l lg:px-5.5 lg:py-6.5"
            >
              <Led text={item.code} pitch={4.4} label={item.code} />
              <span className="mt-3.5 block font-stencil text-2xl leading-none font-black tracking-[0.02em] uppercase lg:text-3xl">
                {item.title}
              </span>
              <span className="mt-2 block text-[15px] leading-[1.45] text-muted-board">
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "Fares": no prices online, a blinking "ON REQUEST" sign and what sets the price. */
export function Fares({ text }: { text: ServicesContent["fares"] }) {
  return (
    <section aria-labelledby="fares-title" className={`${container} pt-18 lg:pt-36`}>
      <div className="flex flex-wrap items-start gap-7.5 lg:gap-16">
        <div className="min-w-0 flex-[1_1_480px]">
          <h2 id="fares-title" className={`rv-wipe ${sectionTitle}`}>
            {text.title}
          </h2>
          <div className="board card-edge rv-scale mt-6.5 inline-flex flex-col gap-3.5 rounded-[10px] px-4.5 py-4 lg:px-6.5 lg:py-5.5">
            <span className="text-[13px] text-muted-board">{text.label}</span>
            <span className="sr-only">{text.signText}</span>
            <Led text={text.sign} pitch={7} className="blink hidden lg:block" />
            <Led text={text.sign} pitch={4.4} className="blink lg:hidden" />
          </div>
          <p className="rv mt-6.5 mb-0 max-w-[30em] text-[19px] leading-[1.45] font-medium lg:text-[22px]">
            {text.lead}
          </p>
        </div>
        <div className="min-w-0 flex-[1_1_440px]">
          <p className="rv m-0 mb-3 text-[13px] text-label">{text.factorsTitle}</p>
          <ul className="m-0 list-none border-b border-rule p-0">
            {text.factors.map(([title, detail]) => (
              <li
                key={title}
                className="rv-left flex min-h-[58px] items-center justify-between gap-4 border-t border-rule lg:min-h-[66px]"
              >
                <span className="font-stencil text-2xl font-black tracking-[0.03em] lg:text-3xl">
                  {title}
                </span>
                <span className="text-right text-[15px] text-muted">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * "Questions at the desk": frequently asked questions as native <details> rows. They open with
 * a click or Enter, work without JavaScript, and screen readers announce them as expandable.
 */
export function Faq({ text }: { text: ServicesContent["faq"] }) {
  return (
    <section aria-labelledby="faq-title" className={`${container} pt-18 pb-18 lg:pt-36 lg:pb-36`}>
      <TwoLineTitle id="faq-title" lines={text.title} text={text.titleText} />
      <ul className="m-0 mt-7 list-none border-b-[1.5px] border-ink p-0 lg:mt-12.5">
        {text.items.map(([question, answer], i) => (
          <li key={question} className="rv border-t-[1.5px] border-ink">
            <Disclosure
              className="faq"
              summaryClassName="grid min-h-[72px] cursor-pointer grid-cols-[40px_minmax(0,1fr)_30px] items-center gap-3 lg:min-h-[88px] lg:grid-cols-[70px_minmax(0,1fr)_30px] lg:gap-5"
              summary={
                <>
                  <span className="board chip-line inline-flex justify-self-start rounded px-1.5 py-1">
                    <Led text={`Q${i + 1}`} pitch={2.6} />
                  </span>
                  <span className="font-stencil text-[25px] leading-[1.05] font-black tracking-[0.02em] uppercase lg:text-4xl">
                    {question}
                  </span>
                  <span className="faq-x inline-flex justify-self-end">
                    <Led text="+" pitch={3.4} tone="ink" board={false} glow={false} />
                  </span>
                </>
              }
            >
              <p className="faq-answer m-0 max-w-[62ch] pb-6 text-muted lg:pb-7.5 lg:pl-[90px]">
                {answer}
              </p>
            </Disclosure>
          </li>
        ))}
      </ul>
    </section>
  );
}
