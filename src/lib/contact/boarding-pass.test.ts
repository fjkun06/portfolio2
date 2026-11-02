import { describe, expect, it } from "vitest";

import {
  looksLikeBot,
  MIN_FILL_MS,
  readBoardingPass,
  validateBoardingPass,
  type BoardingPass,
} from "./boarding-pass";

function formData(fields: Record<string, string | string[]>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields))
    for (const v of Array.isArray(value) ? value : [value]) form.append(key, v);
  return form;
}

const valid: BoardingPass = {
  name: "Ada",
  email: "ada@example.com",
  from: "Ada Ltd, Douala",
  languages: ["EN", "FR"],
  message: "I need a site in French and English.",
  consent: true,
  company: "",
  startedAt: 1_000,
  lang: "fr",
};

describe("readBoardingPass", () => {
  it("reads and trims every field", () => {
    const pass = readBoardingPass(
      formData({
        name: "  Ada  ",
        email: "ada@example.com ",
        from: "Ada Ltd",
        languages: ["EN", "DE"],
        message: " Hello there, a site please ",
        consent: "on",
        startedAt: "1234",
        lang: "de",
      }),
    );
    expect(pass).toMatchObject({
      name: "Ada",
      email: "ada@example.com",
      languages: ["EN", "DE"],
      message: "Hello there, a site please",
      consent: true,
      startedAt: 1234,
      lang: "de",
      company: "",
    });
  });

  it("ignores unknown languages and falls back to English for an unknown page language", () => {
    const pass = readBoardingPass(formData({ languages: ["EN", "XX"], lang: "es" }));
    expect(pass.languages).toEqual(["EN"]);
    expect(pass.lang).toBe("en");
  });

  it("treats a missing checkbox and start time as false and 0", () => {
    const pass = readBoardingPass(formData({}));
    expect(pass.consent).toBe(false);
    expect(pass.startedAt).toBe(0);
  });

  it("cuts overly long values", () => {
    const pass = readBoardingPass(formData({ name: "x".repeat(500) }));
    expect(pass.name).toHaveLength(120);
  });
});

describe("validateBoardingPass", () => {
  it("accepts a complete boarding pass", () => {
    expect(validateBoardingPass(valid)).toEqual([]);
  });

  it("lists every problem in the order of the form", () => {
    expect(
      validateBoardingPass({ ...valid, name: "", email: "nope", message: "short", consent: false }),
    ).toEqual(["name", "email", "message", "consent"]);
  });

  it("rejects email addresses without a proper domain", () => {
    for (const email of ["a@b", "a@b.c", "a b@c.de", "@c.de"])
      expect(validateBoardingPass({ ...valid, email })).toEqual(["email"]);
  });

  it("doesn't require the business or the languages", () => {
    expect(validateBoardingPass({ ...valid, from: "", languages: [] })).toEqual([]);
  });
});

describe("looksLikeBot", () => {
  it("lets a person through", () => {
    expect(looksLikeBot(valid, valid.startedAt + MIN_FILL_MS + 1)).toBe(false);
  });

  it("catches a filled honeypot, a form never typed in, or a too-fast submission", () => {
    const later = valid.startedAt + 60_000;
    expect(looksLikeBot({ ...valid, company: "Spam Inc" }, later)).toBe(true);
    expect(looksLikeBot({ ...valid, startedAt: 0 }, later)).toBe(true);
    expect(looksLikeBot(valid, valid.startedAt + 500)).toBe(true);
  });
});
