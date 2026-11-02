/**
 * Splits a heading's sentence (`text`) into the two lines the design shows (`lines`), when the
 * lines are that sentence in capitals: "On every flight" + ["ON EVERY", "FLIGHT"] →
 * ["On every", "flight"]. Null when they differ in words, e.g. "Carry-on checklist" shown as
 * ["CARRY-ON", "CHECKLIST"].
 *
 * @example
 * splitTitle("On every flight", ["ON EVERY", "FLIGHT"]) // ["On every", "flight"]
 */
export function splitTitle(text: string, lines: readonly string[]): [string, string] | null {
  const [line1 = "", line2 = ""] = lines;
  const words = text.split(" ");
  const count = line1.split(" ").length;
  const first = words.slice(0, count).join(" ");
  const second = words.slice(count).join(" ");
  const same = (a: string, b: string) => a.toLocaleUpperCase() === b;
  return same(first, line1) && same(second, line2) ? [first, second] : null;
}

/**
 * The two lines of a big section title, written once so search engines and screen readers
 * read the heading a single time (no hidden copy next to a visible one).
 * - When `lines` are `text` in capitals, the sentence itself is shown, set in capitals by CSS:
 *   screen readers say "On every flight", not a shouted "ON EVERY FLIGHT".
 * - Otherwise the design's lines are shown as they are.
 * Goes inside the heading element, which keeps its own id and classes.
 */
export function SplitTitle({ text, lines }: { text: string; lines: readonly string[] }) {
  const [first = "", second = ""] = splitTitle(text, lines) ?? lines;
  return (
    <>
      <span className="block uppercase">{first}</span>{" "}
      <span className="block uppercase">{second}</span>
    </>
  );
}
