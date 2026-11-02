import Link from "next/link";

import { flipDelays, Led } from "@/components/Led";
import { Arrow } from "@/components/site/Arrow";
import { BackToTop } from "@/components/site/BackToTop";
import { LangSwitch } from "@/components/site/LangSwitch";
import { Logo } from "@/components/site/Logo";
import { Year } from "@/components/site/Year";
import type { Locale } from "@/i18n/config";
import type { Routes } from "@/i18n/routes";
import type { Dictionary } from "@/locales/en";
import { siteConfig, whatsappLink } from "@/utils/site";

type FooterProps = {
  lang: Locale;
  /** Footer texts in the current language. */
  text: Dictionary["footer"];
  /** Navigation texts, for the logo's accessible name and the language switch label. */
  nav: Dictionary["nav"];
  /** All page addresses in the current language, from `routes(lang)`. */
  to: Routes;
};

/**
 * The big "NEXT DEPARTURE: YOUR PROJECT." sign: one LED line per entry, the last one in the
 * accent colour. Its letters keep turning over like a split-flap board, in one wave that runs
 * through the lines in order. Hidden from screen readers; the same sentence sits next to it as
 * real text.
 */
function LedLines({ lines, pitch }: { lines: string[]; pitch: number }) {
  const waves = flipDelays(lines);
  return (
    <span aria-hidden="true" className="rv-wipe flex flex-col" style={{ gap: pitch * 2 }}>
      {lines.map((line, i) => (
        <Led
          key={line}
          text={line}
          pitch={pitch}
          tone={i === lines.length - 1 ? "accent" : "white"}
          flip
          flipDelay={waves[i]}
        />
      ))}
    </span>
  );
}

/**
 * Contact rows of the footer. A row whose value is empty (like WhatsApp until the number is set
 * in src/utils/site.ts) is left out instead of showing a dead link.
 */
export function connectionsFor(text: Dictionary["footer"]) {
  return [
    {
      code: "EML",
      label: text.email,
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      code: "WAP",
      label: text.whatsapp,
      value: siteConfig.whatsapp && `+${siteConfig.whatsapp}`,
      href: whatsappLink(siteConfig.whatsapp),
    },
    { code: "LIN", label: text.linkedin, value: "fjkun06", href: siteConfig.linkedin },
    { code: "GIT", label: text.github, value: "fjkun06", href: siteConfig.github },
  ].filter((c) => c.value);
}

/**
 * The site footer, the same on every page:
 * 1. The "NEXT DEPARTURE: YOUR PROJECT." LED sign (two lines on desktop, three on phones)
 *    with the "Book your project" button.
 * 2. "Connections": email, WhatsApp, LinkedIn, GitHub as departure-board rows.
 *    External links open in a new tab.
 * 3. Bottom bar: logo and copyright, Impressum and privacy links, language switch.
 * 4. The floating back-to-top button.
 */
export function Footer({ lang, text, nav, to }: FooterProps) {
  const connections = connectionsFor(text);

  return (
    <footer className="board border-t border-rule-board">
      <div className="mx-auto max-w-[1280px] px-5 pt-14 lg:px-10 lg:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <span className="sr-only">{text.next}</span>
            <span className="hidden lg:block">
              <LedLines lines={text.nextLed} pitch={12} />
            </span>
            <span className="lg:hidden">
              <LedLines lines={text.nextLedShort} pitch={4.4} />
            </span>
          </div>
          <Link href={to.contact} className="btn btn-accent rv min-h-[58px] px-[26px] text-2xl">
            {text.book.toUpperCase()}
          </Link>
        </div>

        <div className="mt-11 lg:mt-18">
          <p className="rv m-0 mb-3 text-[13px] text-muted-board">{text.connections}</p>
          <ul className="m-0 list-none border-b border-rule-board p-0">
            {connections.map((c) => (
              <li key={c.code} className="rv-left">
                <a
                  href={c.href}
                  {...(c.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="row-board grid min-h-16 grid-cols-[64px_minmax(0,1fr)_28px] items-center gap-3.5 border-t border-rule-board px-2 no-underline lg:min-h-[76px] lg:grid-cols-[90px_200px_minmax(0,1fr)_40px] lg:gap-6 lg:px-4"
                >
                  <Led text={c.code} pitch={3} className="lg:hidden" />
                  <Led text={c.code} pitch={4} className="hidden lg:block" />
                  <span className="hidden text-sm text-muted-board lg:inline">{c.label}</span>
                  <span className="font-stencil text-[22px] font-extrabold tracking-[0.03em] [overflow-wrap:anywhere] text-on-board lg:text-[30px]">
                    {c.value}
                  </span>
                  <span className="row-go inline-flex text-muted-board">
                    <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-x-7 gap-y-4 border-t border-rule-board pt-[22px] pb-24 text-sm text-muted-board lg:mt-14 lg:pb-7">
          <span className="inline-flex items-center gap-4">
            <Logo href={to.home} label={nav.home} pitch={4.8} />
            <span>
              © <Year /> Frank Jordan
            </span>
          </span>
          <nav aria-label={text.legal} className="flex flex-wrap gap-6">
            <Link href={to.legal} className="no-underline">
              {text.imprint}
            </Link>
            <Link href={to.privacy} className="no-underline">
              {text.privacy}
            </Link>
          </nav>
          <LangSwitch current={lang} label={nav.language} />
        </div>
      </div>
      <BackToTop label={text.backToTop} />
    </footer>
  );
}
