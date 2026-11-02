import Image from "next/image";
import Link from "next/link";

import { Led } from "@/components/Led";
import { container, sectionTitle } from "@/components/ui/layout";
import { Placeholder } from "@/components/ui/Placeholder";
import { StatusLed } from "@/components/ui/StatusLed";
import { WipBand } from "@/components/ui/WipBand";
import { isLive, projectHref, SHOT_QUALITY, type Project } from "@/content/projects";
import { fill } from "@/i18n/fill";
import type { Locale } from "@/i18n/config";
import type { Routes } from "@/i18n/routes";
import type { Dictionary } from "@/locales/en";

type GalleryProps = {
  lang: Locale;
  projects: Project[];
  text: Dictionary["work"];
  status: Dictionary["status"];
  /** "Work in progress", for the band on unfinished projects. */
  wipLabel: string;
  to: Routes;
};

/** At most five tools, then how many more: "NEXT.JS · TYPESCRIPT · … +3". */
export function stackLine(stack: string[], max = 5): string {
  const shown = stack.slice(0, max).join(" · ");
  return stack.length > max ? `${shown} +${stack.length - max}` : shown;
}

/**
 * One project card: picture on a dark board, flight number and status, name, summary, the main
 * tools it's built with, and a link
 * to the project's own page (the whole picture links there too).
 * Live projects show their screenshot as it is. Projects still in progress wait greyed out
 * under a "Work in progress" band with their status, and invite you to follow the build.
 */
function Card({
  p,
  wide,
  lang,
  text,
  status,
  wipLabel,
  to,
}: { p: Project; wide: boolean } & Omit<GalleryProps, "projects">) {
  const href = projectHref(p, to.work);
  const live = isLive(p);
  const media = p.image ? (
    <Image
      src={p.image}
      alt={live ? fill(text.shot, { name: p.name }) : fill(text.shotWip, { name: p.name })}
      sizes={wide ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 1024px) 600px, 100vw"}
      quality={SHOT_QUALITY}
      placeholder="blur"
      className={`px-media block aspect-video w-full object-cover object-top ${live ? "" : "wip-media"}`}
    />
  ) : (
    <Placeholder
      label={live ? fill(text.shotMissing, { name: p.name }) : text.inProgress}
      ratio="16 / 9"
      className="w-full"
    />
  );

  return (
    <article id={p.slug} className={`rv-tilt min-w-0 scroll-mt-28 ${wide ? "lg:col-span-2" : ""}`}>
      <Link
        href={href}
        className="shot board card-edge block overflow-hidden rounded-xl p-2 no-underline shadow-[0_40px_60px_-45px_rgba(0,0,0,0.6)] lg:p-2.5"
      >
        <span className="relative block overflow-hidden rounded-md">
          {media}
          {!live && <WipBand status={p.status} label={wipLabel} text={status} />}
        </span>
        <span className="flex items-center justify-between gap-3 px-1.5 pt-3.5 pb-1">
          <Led text={p.code} pitch={3} tone="grey" glow={false} />
          <StatusLed status={p.status} text={status} pitch={3} />
        </span>
      </Link>
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
        <h3
          className={`rv-wipe m-0 font-stencil leading-[0.9] font-black tracking-[0.01em] ${wide ? "text-[44px] lg:text-[72px]" : "text-[44px] lg:text-[52px]"}`}
        >
          {p.name}
        </h3>
        <span className="font-stencil text-base font-bold tracking-[0.12em] text-label lg:text-lg">
          {p.languages} · {p.year}
        </span>
      </div>
      <p className="mt-2.5 mb-0 text-sm text-label lg:text-[15px]">{p.client[lang]}</p>
      <p className="rv mt-2 mb-0 max-w-[46ch] text-base text-muted lg:text-lg">{p.summary[lang]}</p>
      {p.stack.length > 0 && (
        <p className="mt-3 mb-0 font-stencil text-[13px] font-bold tracking-[0.1em] text-label lg:text-sm">
          <span className="sr-only">{text.stackLabel}: </span>
          {stackLine(p.stack)}
        </p>
      )}
      <Link href={href} className="mt-3 inline-block font-semibold underline-offset-[6px]">
        {p.report ? text.readReport : live ? text.viewProject : text.followBuild}
      </Link>
    </article>
  );
}

/**
 * "At the gate": a closer look at each project. The first project gets a full-width card,
 * the others two per row from 1024 px. Each card tips up as it arrives; screenshots drift
 * slightly inside their frame as you scroll (parallax).
 * Each card has the project's address as its id, so links like /work#digtal land on it.
 */
export function Gallery({ lang, projects, text, status, wipLabel, to }: GalleryProps) {
  return (
    <section
      aria-labelledby="gallery-title"
      className={`${container} pt-20 pb-20 lg:pt-36 lg:pb-36`}
    >
      <h2 id="gallery-title" className={`rv-wipe ${sectionTitle}`}>
        {text.galleryTitle}
      </h2>
      <p className="rv mt-4 mb-0 max-w-[460px] text-muted">{text.galleryIntro}</p>
      <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-16 lg:mt-14 lg:grid-cols-2 lg:gap-y-20">
        {projects.map((p, i) => (
          <Card
            key={p.slug}
            p={p}
            wide={i === 0}
            lang={lang}
            text={text}
            status={status}
            wipLabel={wipLabel}
            to={to}
          />
        ))}
      </div>
    </section>
  );
}
