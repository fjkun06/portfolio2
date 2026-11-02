import { Led } from "@/components/Led";
import { container, sectionTitle } from "@/components/ui/layout";
import type { ContactContent } from "@/content/contact";

/**
 * Small status board next to the Contact title: desk OPEN (blinking), reply time, languages.
 * The LED values are labelled, so screen readers read "Desk: OPEN".
 */
export function StatusBoard({ items }: { items: ContactContent["status"] }) {
  return (
    <dl className="rv m-0 grid grid-cols-[repeat(3,auto)] rounded-lg border border-rule-board">
      {items.map(([label, value], i) => (
        <div
          key={label}
          className={`min-w-0 px-3 py-3 lg:px-5 lg:py-4 ${i ? "border-l border-rule-board" : ""}`}
        >
          <dt className="text-xs text-muted-board">{label}</dt>
          <dd className="m-0 mt-2">
            <Led
              text={value}
              pitch={2.6}
              tone={i === 1 ? "white" : "accent"}
              label={value}
              className={`lg:hidden ${i === 0 ? "blink" : ""}`}
            />
            <Led
              text={value}
              pitch={4}
              tone={i === 1 ? "white" : "accent"}
              label={value}
              className={`hidden lg:block ${i === 0 ? "blink" : ""}`}
            />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** "After check-in": what happens once the boarding pass is sent, in three numbered steps. */
export function AfterCheckIn({ text }: { text: ContactContent["after"] }) {
  return (
    <section aria-labelledby="after-title" className={`${container} pt-18 pb-18 lg:pt-36 lg:pb-36`}>
      <h2 id="after-title" className={`rv-wipe ${sectionTitle}`}>
        {text.title}
      </h2>
      <ol className="m-0 mt-6.5 grid list-none grid-cols-1 border-b-[1.5px] border-ink p-0 lg:mt-12.5 lg:grid-cols-3 lg:border-b-0">
        {text.steps.map(([title, detail], i) => (
          <li
            key={title}
            className={`rv-flap min-w-0 border-t-[1.5px] border-ink py-6 lg:py-7.5 ${i ? "lg:border-l-[1.5px] lg:pl-7" : ""} lg:pr-7`}
          >
            <span className="board inline-flex rounded px-1.5 py-1">
              <Led text={`0${i + 1}`} pitch={3} />
            </span>
            <h3 className="m-0 mt-4 font-stencil text-[34px] leading-none font-black uppercase lg:text-[44px]">
              {title}
            </h3>
            <p className="m-0 mt-2.5 text-muted">{detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
