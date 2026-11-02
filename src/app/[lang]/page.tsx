import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Captain } from "@/components/home/Captain";
import { DepartureBoard } from "@/components/home/DepartureBoard";
import { Featured } from "@/components/home/Featured";
import { FlightPlan } from "@/components/home/FlightPlan";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Routes } from "@/components/home/Routes";
import { Ticket } from "@/components/home/Ticket";
import { featured, projects } from "@/content/projects";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { routes } from "@/i18n/routes";

/**
 * The home page, top to bottom:
 * hero and departures board · featured project (Herzog trad') · LED band · services ("Routes I
 * fly") · process ("Your flight plan") · about ("Your captain") · contact form ("Your boarding pass").
 */
export default function HomePage({ params }: PageProps<"/[lang]">) {
  // Reading the URL (params) happens inside <Suspense>, as Next.js requires for instant navigations.
  // Every language is prerendered, so visitors still get the full page as static HTML.
  return (
    <Suspense>
      <Home params={params} />
    </Suspense>
  );
}

async function Home({ params }: { params: PageProps<"/[lang]">["params"] }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  // The hero rotates through all three languages, so it needs every dictionary.
  const [dict, en, fr, de] = await Promise.all([
    getDictionary(lang),
    getDictionary("en"),
    getDictionary("fr"),
    getDictionary("de"),
  ]);
  const { home, status, form } = dict;
  const to = routes(lang);

  return (
    <>
      <Hero lang={lang} heroes={{ en: en.home.hero, fr: fr.home.hero, de: de.home.hero }} to={to} />
      <DepartureBoard
        lang={lang}
        projects={projects.filter((p) => p.onHome)}
        text={home.board}
        status={status}
        to={to}
      />
      <Featured project={featured} text={home.featured} status={status} to={to} />
      <Marquee href={to.contact} label={home.marquee} />
      <Routes text={home.routes} servicesHref={to.services} />
      <FlightPlan text={home.plan} processHref={to.process} />
      <Captain text={home.captain} aboutHref={to.about} />
      <Ticket lang={lang} text={home.ticket} form={form} to={to} />
    </>
  );
}
