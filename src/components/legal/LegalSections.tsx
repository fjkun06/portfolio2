import Link from "next/link";
import type { ReactNode } from "react";

import { Led } from "@/components/Led";
import type { LegalContent, LegalSection } from "@/content/legal";
import { siteConfig } from "@/utils/site";

type Owner = { name: string; street: string; city: string };

/** True while any owner detail (name, street, city) is still empty. */
export function ownerIncomplete(owner: Owner = siteConfig.owner): boolean {
  return !owner.name || !owner.street || !owner.city;
}

type TokenValues = {
  owner: Owner;
  placeholders: LegalContent["placeholders"];
  contactHref: string;
  contactLink: string;
};

/**
 * Turns a paragraph with tokens into text and links:
 * {name} {street} {city} become the owner's details, or a red placeholder while empty;
 * {email} becomes a mailto link; {contact} a link to the Contact page.
 *
 * @example
 * fillLegal("E-Mail: {email}", values) // ["E-Mail: ", <a href="mailto:…">…</a>]
 */
export function fillLegal(text: string, values: TokenValues): ReactNode[] {
  return text.split(/(\{\w+\})/).map((part, i) => {
    const key = part.slice(1, -1);
    if (key === "email")
      return (
        <a key={i} href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
      );
    if (key === "contact")
      return (
        <Link key={i} href={values.contactHref}>
          {values.contactLink}
        </Link>
      );
    if (key === "name" || key === "street" || key === "city") {
      const value = values.owner[key];
      if (value) return value;
      return (
        <mark key={i} data-nosnippet className="bg-transparent font-semibold text-danger">
          {values.placeholders[key]}
        </mark>
      );
    }
    return part;
  });
}

/** One block of legal text: LED code, stencil heading and its paragraphs. */
function Section({ section, values }: { section: LegalSection; values: TokenValues }) {
  return (
    <section className="rv border-t-[1.5px] border-ink py-5.5 lg:grid lg:grid-cols-[90px_minmax(0,1fr)] lg:gap-6 lg:py-7.5">
      <span className="board mb-3 inline-flex self-start rounded px-1.5 py-1 lg:mb-0">
        <Led text={section.code} pitch={3} />
      </span>
      <div>
        <h3 className="m-0 font-stencil text-[26px] leading-none font-black tracking-[0.02em] uppercase lg:text-[32px]">
          {section.title}
        </h3>
        <div className="mt-2.5 flex flex-col gap-2">
          {section.paragraphs.map((p, i) => (
            <p key={i} className="m-0 [overflow-wrap:anywhere]">
              {fillLegal(p, values)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/** One of the two legal texts (Impressum or privacy policy), with an id to jump to. */
export function LegalPart({
  id,
  part,
  values,
  className = "",
}: {
  id: string;
  part: LegalContent["impressum"];
  values: TokenValues;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2
        id={id}
        className="rv-wipe m-0 scroll-mt-28 font-stencil text-[min(64px,12.5vw)] leading-[0.88] font-black [overflow-wrap:anywhere] lg:text-[104px]"
      >
        {part.title}
      </h2>
      <div className="mt-7 border-b-[1.5px] border-ink">
        {part.sections.map((s) => (
          <Section key={s.code} section={s} values={values} />
        ))}
      </div>
    </div>
  );
}
