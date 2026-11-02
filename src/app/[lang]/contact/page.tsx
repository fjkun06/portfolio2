import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AfterCheckIn, StatusBoard } from "@/components/contact/ContactSections";
import { BoardingPassForm } from "@/components/home/BoardingPassForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { container } from "@/components/ui/layout";
import { LedTitle } from "@/components/ui/LedTitle";
import { contactContent } from "@/content/contact";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes } from "@/i18n/routes";
import { siteConfig } from "@/utils/site";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/contact",
    ...contactContent[lang].meta,
    imageAlt: meta.ogAlt,
  });
}

/**
 * The Contact page: "Check-in desk" hero with a status board, the full boarding pass
 * (with service and timing) and what happens after sending it. Email, WhatsApp and the
 * other contacts follow in the footer, as on every page.
 */
export default function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  return (
    <Suspense>
      <Contact params={params} />
    </Suspense>
  );
}

async function Contact({ params }: { params: PageProps<"/[lang]/contact">["params"] }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const text = contactContent[lang];
  const { work, form } = await getDictionary(lang);
  const to = routes(lang);

  return (
    <>
      <section aria-labelledby="contact-title" className="board">
        <div className={`${container} pt-5 pb-11 lg:pt-7.5 lg:pb-20`}>
          <Breadcrumb items={[{ label: work.home, href: to.home }, { label: text.breadcrumb }]} />
          <div className="mt-7.5 flex flex-wrap items-end justify-between gap-8.5 lg:mt-12">
            <div className="min-w-0">
              <LedTitle id="contact-title" lines={text.titleLed} text={text.titleText} />
            </div>
            <StatusBoard items={text.status} />
          </div>
          <p className="rv mt-6 mb-0 max-w-[560px] text-lg text-on-board-2 lg:mt-10 lg:text-[21px]">
            {text.intro}
          </p>
        </div>
      </section>

      <section aria-label={text.formLabel} className={`${container} pt-10 lg:pt-22.5`}>
        <BoardingPassForm
          lang={lang}
          text={form}
          privacyHref={to.privacy}
          email={siteConfig.email}
          extended
        />
      </section>

      <AfterCheckIn text={text.after} />
    </>
  );
}
