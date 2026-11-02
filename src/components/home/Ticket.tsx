import { BoardingPassForm } from "@/components/home/BoardingPassForm";
import { container, sectionTitle } from "@/components/ui/layout";
import type { Locale } from "@/i18n/config";
import type { Routes } from "@/i18n/routes";
import type { Dictionary } from "@/locales/en";
import { siteConfig } from "@/utils/site";

type TicketProps = {
  lang: Locale;
  text: Dictionary["home"]["ticket"];
  form: Dictionary["form"];
  to: Routes;
};

/** "Your boarding pass": the last section of the home page, with the contact form. */
export function Ticket({ lang, text, form, to }: TicketProps) {
  return (
    <section
      id="ticket"
      aria-labelledby="ticket-title"
      className={`${container} pt-24 pb-20 lg:pt-48 lg:pb-36`}
    >
      <h2 id="ticket-title" className={`rv-wipe ${sectionTitle}`}>
        {text.title}
      </h2>
      <p className="rv mt-4.5 mb-0 max-w-[520px] text-muted">{text.intro}</p>
      <div className="mt-7 lg:mt-11">
        <BoardingPassForm
          lang={lang}
          text={form}
          privacyHref={to.privacy}
          email={siteConfig.email}
        />
      </div>
    </section>
  );
}
