import Image from "next/image";
import Link from "next/link";

import { Led } from "@/components/Led";
import { container, sectionTitle } from "@/components/ui/layout";
import { Placeholder } from "@/components/ui/Placeholder";
import { StatusLed } from "@/components/ui/StatusLed";
import type { Project } from "@/content/projects";
import { fill } from "@/i18n/fill";
import type { Locale } from "@/i18n/config";
import type { Routes } from "@/i18n/routes";
import type { Dictionary } from "@/locales/en";

type GalleryProps = {
  lang: Locale;
  projects: Project[];
  text: Dictionary["work"];
  status: Dictionary["status"];
  to: Routes;
};

/** One project card: screenshot on a dark board, flight number and status, name, summary. */
function Card({
  p,
  wide,
  lang,
  text,
  status,
  to,
}: { p: Project; wide: boolean } & Omit<GalleryProps, "projects">) {
  const href = p.report ? `${to.work}/${p.slug}` : p.website ? `https://${p.website}` : undefined;
  const media = p.image ? (
    <Image
      src={p.image}
      alt={fill(text.shot, { name: p.name })}
      sizes={wide ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 1024px) 600px, 100vw"}
      placeholder="blur"
      className="px-media block aspect-video w-full object-cover object-top"
    />
  ) : (
    <Placeholder
      label={p.status === "BOARDING" ? text.inProgress : fill(text.shotMissing, { name: p.name })}
      ratio="16 / 9"
      className="w-full"
    />
  );
  const frame = (
    <>
      <span className="block overflow-hidden rounded-md">{media}</span>
      <span className="flex items-center justify-between gap-3 px-1.5 pt-3.5 pb-1">
        <Led text={p.code} pitch={3} tone="grey" glow={false} />
        <StatusLed status={p.status} text={status} pitch={3} />
      </span>
    </>
  );
  const frameClass =
    "shot board card-edge block overflow-hidden rounded-xl p-2 no-underline shadow-[0_40px_60px_-45px_rgba(0,0,0,0.6)] lg:p-2.5";

  return (
    <article id={p.slug} className={`rv-tilt min-w-0 scroll-mt-28 ${wide ? "lg:col-span-2" : ""}`}>
      {href ? (
        <Link
          href={href}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={frameClass}
        >
          {frame}
        </Link>
      ) : (
        <div className={frameClass}>{frame}</div>
      )}
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
      {p.report && (
        <Link
          href={`${to.work}/${p.slug}`}
          className="mt-3 inline-block font-semibold underline-offset-[6px]"
        >
          {text.readReport}
        </Link>
      )}
    </article>
  );
}

/**
 * "At the gate": a closer look at each project. The first project gets a full-width card,
 * the others two per row from 1024 px. Each card tips up as it arrives; screenshots drift
 * slightly inside their frame as you scroll (parallax).
 * Each card has the project's address as its id, so links like /work#digtal land on it.
 */
export function Gallery({ lang, projects, text, status, to }: GalleryProps) {
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
          <Card key={p.slug} p={p} wide={i === 0} lang={lang} text={text} status={status} to={to} />
        ))}
      </div>
    </section>
  );
}
