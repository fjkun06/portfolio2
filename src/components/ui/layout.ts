/**
 * Shared layout classes, so every section lines up on the same grid.
 * `container`: centred, at most 1280 px wide, 16 px side padding on phones and 40 px from 1024 px.
 */
export const container = "mx-auto w-full max-w-[1280px] px-4 lg:px-10";

/**
 * Big stencil section heading (ROUTES I FLY, YOUR CAPTAIN…).
 * On phones the size follows the screen width (12.5vw, at most 58 px) so long words like
 * "D’EMBARQUEMENT" still fit, and an over-long word may break rather than overflow.
 */
export const sectionTitle =
  "m-0 font-stencil text-[min(58px,12.5vw)] leading-[0.88] font-black tracking-[0.01em] [overflow-wrap:anywhere] lg:text-[104px] lg:leading-[0.86]";

/** Small dark label holding LED text, like "FEATURED FLIGHT FJ 001". */
export const ledTag = "board chip-line inline-flex items-center rounded px-2.5 py-2";
