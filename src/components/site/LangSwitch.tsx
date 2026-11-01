"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Led } from "@/components/Led";
import { localeNames, locales, type Locale } from "@/i18n/config";

/** EN DE FR in LED dots. Each one links to the same page in that language. */
export function LangSwitch({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname() ?? `/${current}`;
  const rest = pathname.replace(/^\/(en|de|fr)(?=\/|$)/, "");

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
