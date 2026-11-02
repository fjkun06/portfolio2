const DELAY = 150;
const STEP = 45;
/** How long one letter takes to drop, in ms (see .flap-char in globals.css). */
const DROP = 550;

/**
 * Milliseconds until `text` has fully arrived (with the default timing), so what comes after it
 * can start just as its last letter lands.
 */
export function arrivalAfter(text: string): number {
  const letters = text.replace(/ /g, "").length;
  return DELAY + Math.max(letters - 1, 0) * STEP + DROP - 200;
}

/**
 * Text whose letters drop into place one after another, like split-flap cards on a departures
 * board when a flight arrives. Plays once when the page loads (CSS only, so from the first
 * paint), then stays still; visitors who prefer reduced motion see it in place straight away.
 *
 * Screen readers and search engines get the text as it is; the letters are a hidden copy.
 * Each word keeps its letters on one line, so long names only wrap at spaces.
 *
 * @example
 * <h1><FlapText text="FIRST TRUCKS SARL" /></h1>
 */
export function FlapText({
  text,
  delay = DELAY,
  step = STEP,
}: {
  text: string;
  /** Milliseconds before the first letter drops. */
  delay?: number;
  /** Milliseconds between two letters. */
  step?: number;
}) {
  let n = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="whitespace-nowrap">
              {[...word].map((char, c) => (
                <span
                  key={c}
                  className="flap-char"
                  style={{ animationDelay: `${delay + n++ * step}ms` }}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
