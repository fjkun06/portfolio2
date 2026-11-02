/**
 * A draft of the boarding pass, so what a visitor has filled in survives a refresh, a language
 * switch or going from the home page to the Contact page. Kept in sessionStorage: it lasts as
 * long as the browser tab, and is cleared once the boarding pass is sent.
 *
 * The draft also keeps when the visitor started typing: the spam check treats a pass sent
 * without that time as a bot, so a restored draft must bring it back too.
 */

export const DRAFT_KEY = "boarding-pass-draft";

/** The fields a visitor fills in. Hidden ones (lang, the bot trap, the timer) are never saved. */
export const DRAFT_FIELDS = [
  "name",
  "email",
  "from",
  "message",
  "languages",
  "routes",
  "when",
  "consent",
] as const;

export type Draft = {
  /** Each field's values: one for text, every ticked value for chips, [] for none ticked. */
  fields: Partial<Record<(typeof DRAFT_FIELDS)[number], string[]>>;
  /** When the visitor first typed (ms since 1970), 0 if not yet. */
  startedAt: number;
};

export function readDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null; // storage blocked, or not a draft we wrote
  }
}

/**
 * Saves the form's current values. Fields this form doesn't have (the home page has no route
 * or departure) keep their saved values, so they're still there on the Contact page.
 */
export function saveDraft(form: HTMLFormElement, startedAt: number) {
  const data = new FormData(form);
  const previous = readDraft();
  const fields: Draft["fields"] = { ...previous?.fields };
  for (const name of DRAFT_FIELDS)
    if (form.querySelector(`[name="${name}"]`)) fields[name] = data.getAll(name).map(String);
  const draft: Draft = {
    fields,
    startedAt: previous?.startedAt || startedAt,
  };
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // Storage full or blocked: the form still works, it just won't remember.
  }
}

/** Puts a saved draft back into the form's fields. */
export function restoreDraft(form: HTMLFormElement, draft: Draft) {
  for (const name of DRAFT_FIELDS) {
    const values = draft.fields[name];
    if (!values) continue;
    for (const el of form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      `[name="${name}"]`,
    )) {
      if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio"))
        el.checked = values.includes(el.value);
      else el.value = values[0] ?? "";
    }
  }
}

export function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing to clear.
  }
}
