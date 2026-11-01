import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";

import "../globals.css";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ScrollEffects } from "@/components/site/ScrollEffects";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes } from "@/i18n/routes";
import { siteConfig } from "@/utils/site";

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
const BOOT = `(function(){var d=document.documentElement;try{var m=localStorage.getItem("mode");if(m!=="light"&&m!=="dark"){m=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}d.dataset.mode=m}catch(e){}if(!(window.CSS&&CSS.supports("animation-timeline: view()")))d.classList.add("no-sda")})()`;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#141517" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(siteConfig.url),
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const to = routes(lang);

  return (
    <html
      lang={lang}
      data-mode="dark"
      className={`${stencil.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
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
