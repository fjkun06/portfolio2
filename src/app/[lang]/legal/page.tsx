import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { LegalPart, ownerIncomplete } from "@/components/legal/LegalSections";
import { Led } from "@/components/Led";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { container } from "@/components/ui/layout";
import { LedTitle } from "@/components/ui/LedTitle";
import { LEGAL_UPDATED, legalContent } from "@/content/legal";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes } from "@/i18n/routes";
import { siteConfig } from "@/utils/site";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/legal">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return pageMetadata({ lang, path: "/legal", ...legalContent[lang].meta, imageAlt: meta.ogAlt });
}

/**
 * The legal page ("Terms of carriage"): the Impressum (/legal#impressum) and the privacy
 * policy (/legal#privacy) on one page, with two tabs to jump between them.
 * Owner details come from siteConfig.owner; missing ones show as red placeholders.
 */
export default function LegalPage({ params }: PageProps<"/[lang]/legal">) {
  return (
    <Suspense>
      <Legal params={params} />
    </Suspense>
  );
}

async function Legal({ params }: { params: PageProps<"/[lang]/legal">["params"] }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const text = legalContent[lang];
  const { work } = await getDictionary(lang);
  const to = routes(lang);
  const values = {
    owner: siteConfig.owner,
    placeholders: text.placeholders,
    contactHref: to.contact,
    contactLink: text.contactLink,
  };
  const note = [text.binding, ownerIncomplete() ? text.missing : ""].filter(Boolean).join(" ");

  return (
    <>
      <section aria-labelledby="legal-title" className="board">
        <div className={`${container} pt-5 pb-8 lg:pt-7.5 lg:pb-14`}>
          <Breadcrumb items={[{ label: work.home, href: to.home }, { label: text.breadcrumb }]} />
          <div className="mt-7.5 lg:mt-11.5">
            <LedTitle
              id="legal-title"
              lines={text.titleLed}
              text={text.titleText}
              pitch={10}
              flip={false}
            />
          </div>
          {note && <p className="rv mt-4.5 mb-0 max-w-[520px] text-on-board-2 lg:mt-6.5">{note}</p>}
          <nav aria-label={text.tabsLabel} className="rv mt-6 flex flex-wrap gap-2 lg:mt-9">
            {(
              [
                ["#impressum", text.tabs.impressum],
                ["#privacy", text.tabs.privacy],
              ] as const
            ).map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="route-chip inline-flex min-h-11 items-center rounded border border-rule-board px-3 no-underline"
              >
                <Led text={label} pitch={3} label={label} />
              </a>
            ))}
          </nav>
        </div>
      </section>

      <article className={`${container} pt-15 pb-20 lg:pt-27.5 lg:pb-35`}>
        <div className="max-w-[900px]">
          <LegalPart id="impressum" part={text.impressum} values={values} />
          <LegalPart
            id="privacy"
            part={text.privacy}
            values={values}
            className="mt-17.5 lg:mt-30"
          />
          <p className="rv mt-6 mb-0 flex items-center gap-3 text-sm text-label">
            {text.updated}
            <span className="board inline-flex rounded px-1.5 py-1">
              <Led text={LEGAL_UPDATED} pitch={2.4} tone="white" label={LEGAL_UPDATED} />
            </span>
          </p>
        </div>
      </article>
    </>
  );
}
