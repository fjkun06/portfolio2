/**
 * The site's scroll animations as data, used by <MotionEffects> (Motion's `animate`, `inView`
 * and `scroll`). Kept free of DOM work so they can be tested on their own.
 */

/** Ends a running effect: an `inView` watcher or a `scroll` link. */
export type Stop = () => void;

/** Smooth "ease out" used by every reveal: quick start, long soft landing. */
export const EASE = [0.2, 0.7, 0.2, 1] as const;

/** CSS values an element starts from (hidden) and animates to (in place). Opacity as a number. */
type Keyframes = Record<string, string | number>;

export type Reveal = {
  /**
   * How the element waits, hidden, until it scrolls into view. Defaults to `from`.
   * It must keep the element's box: the browser ignores elements clipped or scaled to nothing
   * when it checks what's on screen, so those wait with opacity 0 instead.
   */
  hidden?: Keyframes;
  from: Keyframes;
  to: Keyframes;
  /** Seconds. */
  duration: number;
  /** transform-origin while animating. */
  origin?: string;
};

/**
 * One reveal per marker class. Put the class on any element in a server component and it
 * animates in once, the first time it scrolls into view.
 */
export const REVEALS = {
  /** Rises and fades in. The default for text and blocks. */
  rv: {
    from: { opacity: 0, transform: "translateY(48px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    duration: 0.7,
  },
  /** Slides in from the left. List rows. */
  "rv-left": {
    from: { opacity: 0, transform: "translateX(-40px)" },
    to: { opacity: 1, transform: "translateX(0px)" },
    duration: 0.7,
  },
  /**
   * Wipes in from left to right. Big headings. The clip reaches a little outside the box so
   * accents above tight stencil lines (É, Ü) aren't cut off.
   */
  "rv-wipe": {
    hidden: { opacity: 0 },
    from: { opacity: 0.2, clipPath: "inset(-0.4em 100% -0.3em -0.2em)" },
    to: { opacity: 1, clipPath: "inset(-0.4em -0.2em -0.3em -0.2em)" },
    duration: 0.8,
  },
  /** Grows from slightly smaller. Cards and panels. */
  "rv-scale": {
    from: { opacity: 0, transform: "translateY(30px) scale(0.92)" },
    to: { opacity: 1, transform: "translateY(0px) scale(1)" },
    duration: 0.7,
  },
  /** Draws from left to right. Dotted flight lines. */
  "rv-line": {
    hidden: { opacity: 0 },
    from: { opacity: 1, transform: "scaleX(0)" },
    to: { opacity: 1, transform: "scaleX(1)" },
    duration: 0.9,
    origin: "left center",
  },
  /** Flips down like a split-flap display. Board rows and tiles. */
  "rv-flap": {
    from: { opacity: 0, transform: "perspective(900px) rotateX(-82deg)" },
    to: { opacity: 1, transform: "perspective(900px) rotateX(0deg)" },
    duration: 0.6,
    origin: "50% 0",
  },
  /** Tips up from a 3D angle. Project cards. */
  "rv-tilt": {
    from: { opacity: 0.25, transform: "perspective(1400px) rotateX(26deg) scale(0.88)" },
    to: { opacity: 1, transform: "perspective(1400px) rotateX(0deg) scale(1)" },
    duration: 0.8,
    origin: "50% 100%",
  },
} satisfies Record<string, Reveal>;

export type RevealName = keyof typeof REVEALS;

/** The styles an element waits with (hidden) before its reveal starts. */
export function hiddenStyle(reveal: Reveal): Keyframes {
  return reveal.hidden ?? reveal.from;
}

/** Selector matching every element that reveals on scroll. */
export const REVEAL_SELECTOR = Object.keys(REVEALS)
  .map((name) => `.${name}`)
  .join(", ");

/** The reveal an element asks for (its first marker class), if any. */
export function revealOf(element: Element): Reveal | undefined {
  for (const name of Object.keys(REVEALS) as RevealName[])
    if (element.classList.contains(name)) return REVEALS[name];
  return undefined;
}

/**
 * Elements that enter the viewport together come in one after another: the n-th of a batch
 * waits a little longer, up to a cap so long lists don't drag.
 *
 * @example
 * staggerDelay(0) // 0
 * staggerDelay(2) // 0.14
 * staggerDelay(9) // 0.35
 */
export function staggerDelay(index: number, step = 0.07, max = 0.35): number {
  return Math.min(Math.round(index * step * 100) / 100, max);
}

/**
 * Places keyframes inside part of a scroll range: the animation holds its first frame before
 * `start` and its last frame after `end` (both 0 to 1).
 * Motion's `times` say where each keyframe falls in the whole range.
 *
 * @example
 * // Fly between 18 % and 72 % of the section's way through the screen:
 * withinRange(["0%", "75%"], [0, 1], 0.18, 0.72)
 * // { values: ["0%", "0%", "75%", "75%"], times: [0, 0.18, 0.72, 1] }
 */
export function withinRange<T>(
  values: T[],
  times: number[],
  start: number,
  end: number,
): { values: T[]; times: number[] } {
  const span = end - start;
  return {
    values: [values[0], ...values, values[values.length - 1]],
    times: [0, ...times.map((t) => Math.round((start + t * span) * 10000) / 10000), 1],
  };
}

/** True when the element hasn't been on screen yet: it sits below the bottom of the viewport. */
export function isBelowFold(rect: { top: number; height: number }, viewportHeight: number) {
  return rect.height > 0 && rect.top > viewportHeight * 0.96;
}
