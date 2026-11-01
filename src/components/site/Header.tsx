import Link from "next/link";

import { LangSwitch } from "@/components/site/LangSwitch";
import { Logo } from "@/components/site/Logo";
import { MobileMenu } from "@/components/site/MobileMenu";
import { ModeSwitch } from "@/components/site/ModeSwitch";
import { NavLinks } from "@/components/site/NavLinks";
import type { Locale } from "@/i18n/config";
import type { Routes } from "@/i18n/routes";
import type { Dictionary } from "@/locales/en";

type Props = {
  lang: Locale;
  nav: Dictionary["nav"];
  menu: Dictionary["menu"];
  to: Routes;
  progress?: boolean;
};

/** Dotted line under the header that fills up as you read the page. */
function Runway() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 -bottom-px h-[3px]"
      style={{
        background: "repeating-linear-gradient(90deg, var(--dot-dim) 0 3px, transparent 3px 6px)",
      }}
    >
      <div
        className="runway-fill h-full"
        style={{
          background: "repeating-linear-gradient(90deg, var(--led) 0 3px, transparent 3px 6px)",
          filter: "drop-shadow(0 0 3px var(--led-glow))",
        }}
      />
    </div>
  );
}

export function Header({ lang, nav, menu, to, progress = true }: Props) {
  const items = [
    { href: to.work, label: nav.work },
    { href: to.services, label: nav.services },
    { href: to.process, label: nav.process },
    { href: to.about, label: nav.about },
    { href: to.contact, label: nav.contact },
  ];
  const gates = [
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
