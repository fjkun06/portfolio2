/**
 * Right-pointing arrow used at the end of clickable rows (menu, footer connections).
 * It draws in `currentColor`, so it takes the colour of its parent; hover styles in
 * globals.css (`.row-go`) turn it accent-coloured and nudge it right.
 */
export function Arrow({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
