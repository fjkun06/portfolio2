import Link from "next/link";

import { LangSwitch } from "@/components/site/LangSwitch";
import { Logo } from "@/components/site/Logo";
import { MobileMenu, type Gate } from "@/components/site/MobileMenu";
import { ModeSwitch } from "@/components/site/ModeSwitch";
import { NavLinks } from "@/components/site/NavLinks";
import type { Locale } from "@/i18n/config";
import type { Routes } from "@/i18n/routes";
import type { Dictionary } from "@/locales/en";

type HeaderProps = {
  lang: Locale;
  /** Navigation texts in the current language. */
  nav: Dictionary["nav"];
  /** Mobile menu texts in the current language. */
  menu: Dictionary["menu"];
  /** All page addresses in the current language, from `routes(lang)`. */
  to: Routes;
  /** Show the dotted reading-progress line under the header. On by default. */
  progress?: boolean;
};

/**
 * Dotted line under the header that fills up in the accent colour as you scroll down the page.
 * The fill grows with the page's scroll (`.runway-fill`, animated by MotionEffects).
 */
export function Runway() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 -bottom-px h-[3px]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, var(--dot-dim) 0 3px, transparent 3px 6px)",
      }}
    >
      <div
        className="runway-fill h-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--led) 0 3px, transparent 3px 6px)",
          filter: "drop-shadow(0 0 3px var(--led-glow))",
        }}
      />
    </div>
  );
}

/**
 * The site header, sticky at the top of every page. It renders two layouts and CSS shows one:
 *
 * - From 1024 px (`lg`): logo · navigation · language, mode switch and "Book a project".
 * - Below 1024 px: logo · mode switch and menu button (the menu holds navigation and language).
 *
 * It's a server component; only the interactive parts inside it (navigation highlight,
 * language switch, mode switch, mobile menu) run in the browser.
 */
export function Header({ lang, nav, menu, to, progress = true }: HeaderProps) {
  const items = [
    { href: to.work, label: nav.work },
    { href: to.services, label: nav.services },
    { href: to.process, label: nav.process },
    { href: to.about, label: nav.about },
    { href: to.contact, label: nav.contact },
  ];
  // Same pages for the mobile menu, with the three-letter codes of the departures board.
  const gates: Gate[] = [
    { code: "WRK", label: nav.work, href: to.work },
    { code: "SRV", label: nav.services, href: to.services },
    { code: "PLN", label: nav.process, href: to.process },
    { code: "ABT", label: nav.about, href: to.about },
    { code: "TKT", label: nav.contact, href: to.contact },
  ];

  return (
    <header className="board sticky top-0 z-50 border-b border-rule-board">
      {/* Desktop */}
      <div className="mx-auto hidden h-[78px] max-w-[1280px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-8 px-10 lg:grid">
        <Logo href={to.home} label={nav.home} />
        <NavLinks items={items} label={nav.main} />
        <div className="flex items-center gap-[18px]">
          <LangSwitch current={lang} label={nav.language} />
          <ModeSwitch label={nav.mode} hint={nav.modeHint} />
          <Link href={to.contact} className="btn btn-accent text-[19px]">
            {nav.book.toUpperCase()}
          </Link>
        </div>
      </div>

      {/* Phones and tablets */}
      <div className="flex h-16 items-center justify-between px-4 lg:hidden">
        <Logo href={to.home} label={nav.home} pitch={5.1} />
        <span className="inline-flex items-center gap-2.5">
          <ModeSwitch label={nav.mode} hint={nav.modeHint} size={48} />
          <MobileMenu
            gates={gates}
            bookHref={to.contact}
            text={menu}
            language={<LangSwitch current={lang} label={nav.language} />}
          />
        </span>
      </div>

      {progress && <Runway />}
    </header>
  );
}
