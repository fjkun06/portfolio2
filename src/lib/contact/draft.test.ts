import { describe, expect, it } from "vitest";

import { clearDraft, DRAFT_KEY, readDraft, restoreDraft, saveDraft } from "./draft";

/** A small stand-in for the boarding pass form. */
function form(extended: boolean) {
  const el = document.createElement("form");
  el.innerHTML = `
    <input name="name" value="Ada">
    <input name="company" value="bot trap">
    <input type="checkbox" name="languages" value="EN" checked>
    <input type="checkbox" name="languages" value="DE">
    ${extended ? `<input type="radio" name="when" value="ASAP" checked><input type="radio" name="when" value="LATER">` : ""}
    <textarea name="message">Hello</textarea>`;
  document.body.append(el);
  return el;
}

describe("draft", () => {
  it("saves what the visitor filled in, but never the hidden fields", () => {
    saveDraft(form(false), 1000);
    expect(readDraft()).toEqual({
      fields: { name: ["Ada"], languages: ["EN"], message: ["Hello"] },
      startedAt: 1000,
    });
    expect(sessionStorage.getItem(DRAFT_KEY)).not.toContain("bot trap");
  });

  it("keeps the Contact page's extra answers when saved from the shorter home form", () => {
    saveDraft(form(true), 1000);
    saveDraft(form(false), 2000);
    expect(readDraft()?.fields.when).toEqual(["ASAP"]);
    expect(readDraft()?.startedAt).toBe(1000); // the first keystroke counts
  });

  it("puts text, ticks and choices back", () => {
    const el = form(true);
    restoreDraft(el, {
      fields: { name: ["Grace"], languages: ["DE"], when: ["LATER"], message: [] },
      startedAt: 1,
    });
    expect((el.querySelector('[name="name"]') as HTMLInputElement).value).toBe("Grace");
    const ticked = [...el.querySelectorAll<HTMLInputElement>("input:checked")].map((i) => i.value);
    expect(ticked).toEqual(["DE", "LATER"]);
    expect((el.querySelector("textarea") as HTMLTextAreaElement).value).toBe("");
  });

  it("ignores a broken draft and clears it on request", () => {
    sessionStorage.setItem(DRAFT_KEY, "{not json");
    expect(readDraft()).toBeNull();
    clearDraft();
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
  });
});
