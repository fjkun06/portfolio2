/**
 * Replaces {key} placeholders in a translated text.
 * Unknown keys are left as they are, so a missing value is visible instead of silently empty.
 *
 * @example
 * fill("Visit {site}", { site: "herzog-translations.com" }) // "Visit herzog-translations.com"
 */
export function fill(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
