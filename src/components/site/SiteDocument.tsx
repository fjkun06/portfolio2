import localFont from "next/font/local";
import type { ReactNode } from "react";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { InlineScript } from "@/components/site/InlineScript";
import { ScrollEffects } from "@/components/site/ScrollEffects";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import type { Dictionary } from "@/locales/en";

const stencil = localFont({
  src: [
    { path: "../../fonts/stencil-700.woff2", weight: "700" },
    { path: "../../fonts/stencil-800.woff2", weight: "800" },
    { path: "../../fonts/stencil-900.woff2", weight: "900" },
  ],
  variable: "--font-stencil-face",
  display: "swap",
});

const body = localFont({
  src: [
    { path: "../../fonts/familjen.woff2", style: "normal", weight: "400 700" },
    { path: "../../fonts/familjen-italic.woff2", style: "italic", weight: "400 700" },
  ],
  variable: "--font-body-face",
  display: "swap",
});

/**
 * Runs before the first paint: picks dark or light mode (saved choice, else the device setting)
 * and flags browsers that need the JavaScript fallback for scroll animations.
 */
export const BOOT = `(function(){var d=document.documentElement;try{var m=localStorage.getItem("mode");if(m!=="light"&&m!=="dark"){m=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}d.dataset.mode=m}catch(e){}if(!(window.CSS&&CSS.supports("animation-timeline: view()")))d.classList.add("no-sda")})()`;

/**
 * The whole HTML document around a page: fonts, the dark/light boot script, skip link,
 * header, main content, footer and the scroll effects.
 * Shared by the language layout (every normal page) and the global 404 page, which Next.js
 * renders without any layout.
 */
export function SiteDocument({
  lang,
  dict,
  children,
}: {
  lang: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  const to = routes(lang);
  return (
    <html
      lang={lang}
      data-mode="dark"
      className={`${stencil.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      {/* App Router document, not a Pages Router page: a plain <head> is right here. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <InlineScript html={BOOT} />
      </head>
      <body id="top">
        <a
          href="#main"
          className="sr-only z-[60] rounded bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {dict.nav.skip}
        </a>
        <Header lang={lang} nav={dict.nav} menu={dict.menu} to={to} />
        <main id="main">{children}</main>
        <Footer lang={lang} text={dict.footer} nav={dict.nav} to={to} />
        <ScrollEffects />
      </body>
    </html>
  );
}
