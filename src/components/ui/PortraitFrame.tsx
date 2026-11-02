import Image from "next/image";

import { Led } from "@/components/Led";

import portrait from "../../../public/about/frank.webp";

/** Dotted side panel next to the portrait, with a rotated LED label (desktop only). */
function SidePanel({ label, side }: { label: string; side: "left" | "right" }) {
  return (
    <div
      aria-hidden="true"
      className={`relative min-w-[22px] flex-1 border-rule-board ${side === "left" ? "border-r" : "border-l"} max-lg:flex-[0_0_26px]`}
      style={{
        backgroundImage: "radial-gradient(circle, var(--dot-dim) 1.1px, transparent 1.3px)",
        backgroundSize: "6px 6px",
        backgroundPosition: "center",
      }}
    >
      <span
        className="absolute top-1/2 left-1/2 hidden lg:block"
        style={{ transform: `translate(-50%, -50%) rotate(${side === "left" ? -90 : 90}deg)` }}
      >
        <Led text={label} pitch={3} tone="dim" glow={false} />
      </span>
    </div>
  );
}

type PortraitFrameProps = {
  /** Alt text of the photo. */
  alt: string;
  /** Small line under the name, e.g. "Frontend developer, Germany". */
  caption: string;
  /** Load the photo first: true when the frame is in the first screen (About page hero). */
  priority?: boolean;
};

/**
 * Frank's black-and-white portrait in a dark frame with dotted side panels
 * ("CREW FJ-001" and "CM ⇄ DE"), his name in LED dots and the languages he speaks.
 * Used on the home page ("Your captain") and the About page.
 */
export function PortraitFrame({ alt, caption, priority = false }: PortraitFrameProps) {
  return (
    <div className="board card-edge rv-scale flex w-full min-w-0 items-stretch overflow-hidden rounded-xl">
      <SidePanel label="CREW FJ-001" side="left" />
      <figure className="m-0 flex min-w-0 flex-[0_1_380px] flex-col p-2.5 pb-4 lg:p-3.5 lg:pb-5">
        <Image
          src={portrait}
          alt={alt}
          sizes="(min-width: 1024px) 352px, 80vw"
          placeholder="blur"
          priority={priority}
          className="block aspect-[4/5] w-full rounded-md object-cover object-[center_30%] grayscale contrast-[1.08]"
        />
        <figcaption className="mt-4.5 flex flex-col gap-2.5 px-1.5">
          <Led text="FRANK JORDAN" pitch={4} tone="white" label="Frank Jordan" />
          <span className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-board">{caption}</span>
            <Led text="EN FR DE" pitch={3} />
          </span>
        </figcaption>
      </figure>
      <SidePanel label="CM ⇄ DE" side="right" />
    </div>
  );
}
