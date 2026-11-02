import Link from "next/link";

import { Led } from "@/components/Led";

/** The band's text. It mixes all three languages on purpose, like a real departures board. */
export const MARQUEE_TEXT =
  "HERZOG TRAD' LIVE  ·  TRANSLATPRO CHECK-IN  ·  FIRST TRUCKS SARL LIVE  ·  NEXT DEPARTURE: YOUR PROJECT  ·  PROCHAIN DÉPART : VOTRE PROJET  ·  NÄCHSTER ABFLUG: IHR PROJEKT  ·  ";

type MarqueeProps = {
  /** Where the band leads (the contact page). */
  href: string;
  /** What the link says to screen readers, e.g. "Next departure: your project. Book it." */
  label: string;
};

/** One LED panel with four unlit rows above and below the lettering. */
function Panel({ pitch }: { pitch: number }) {
  return (
    <span
      className="inline-flex"
      style={{
        padding: `${pitch * 4}px 0`,
        backgroundImage: `radial-gradient(circle at ${pitch / 2}px ${pitch / 2}px, var(--led-off) ${pitch * 0.38}px, transparent ${pitch * 0.42}px)`,
        backgroundSize: `${pitch}px ${pitch}px`,
      }}
    >
      <Led text={MARQUEE_TEXT} pitch={pitch} />
    </span>
  );
}

/**
 * An endless LED band crossing the page, linking to the contact page.
 *
 * The text is drawn twice in a row and the strip moves left by half its width, then starts over:
 * since both halves are identical, the jump is invisible and the band never ends. The unlit-dot
 * grid moves with the text, so the dots stay aligned. Hovering pauses it; reduced motion stops it.
 */
export function Marquee({ href, label }: MarqueeProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="marquee-band board mt-20 block overflow-hidden no-underline lg:mt-36"
    >
      {/* One strip for every screen size; phones zoom it down (7 px dots become 5 px). */}
      <span className="marquee max-lg:[zoom:0.715]" aria-hidden="true">
        <Panel pitch={7} />
        <Panel pitch={7} />
      </span>
    </Link>
  );
}
