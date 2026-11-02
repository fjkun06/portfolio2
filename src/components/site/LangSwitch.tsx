"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Led } from "@/components/Led";
import { localeNames, locales, type Locale } from "@/i18n/config";

type LangSwitchProps = {
  /** The language of the page being shown. Its code is lit in the accent colour. */
  current: Locale;
  /** Accessible name of the group, e.g. "Language". */
  label: string;
};

/**
 * Removes the language from the start of an address, keeping the rest.
 *
 * @example
 * pathWithoutLocale("/fr/work/herzog") // "/work/herzog"
 * pathWithoutLocale("/de")             // ""
 */
export function pathWithoutLocale(pathname: string): string {
  return pathname.replace(/^\/(en|de|fr)(?=\/|$)/, "");
}

/**
 * EN DE FR in LED dots. Each code links to the same page in that language,
 * so switching language on /fr/work leads to /de/work, not back to the home page.
 *
 * Accessibility: each link is named in its own language ("Deutsch", "Français") and marked
 * with `hrefLang`/`lang`; the current one has `aria-current`. The links are 44 × 44 px at least,
 * the minimum comfortable touch target.
 */
export function LangSwitch({ current, label }: LangSwitchProps) {
  const rest = pathWithoutLocale(usePathname() ?? `/${current}`);

  return (
    <span role="group" aria-label={label} className="inline-flex items-center">
      {locales.map((locale) => {
        const on = locale === current;
        return (
          <Link
            key={locale}
            href={`/${locale}${rest}`}
            hrefLang={locale}
            lang={locale}
            aria-label={localeNames[locale]}
            aria-current={on ? "true" : undefined}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center ${on ? "" : "lang-off"}`}
          >
            <Led text={locale.toUpperCase()} pitch={3} tone={on ? "accent" : "white"} glow={on} />
          </Link>
        );
      })}
    </span>
  );
}
