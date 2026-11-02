import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { pickLocale, proxy } from "./proxy";

describe("pickLocale", () => {
  it("picks the highest-weighted supported language", () => {
    expect(pickLocale("fr-CM,fr;q=0.9,en;q=0.8")).toBe("fr");
    expect(pickLocale("en;q=0.5,de;q=0.9")).toBe("de");
  });

  it("counts regional variants for their base language", () => {
    expect(pickLocale("de-AT")).toBe("de");
  });

  it("falls back to English", () => {
    expect(pickLocale(null)).toBe("en");
    expect(pickLocale("es-ES,es;q=0.9")).toBe("en");
    expect(pickLocale("fr;q=abc")).toBe("en"); // broken weight is ignored
  });
});

describe("proxy", () => {
  const request = (path: string, lang = "de-DE,de;q=0.9") =>
    new NextRequest(`https://frankjordan.dev${path}`, { headers: { "accept-language": lang } });

  it("redirects the bare domain to the visitor's language", () => {
    const response = proxy(request("/"))!;
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://frankjordan.dev/de");
  });

  it("keeps the rest of the address when adding the language", () => {
    const response = proxy(request("/work?x=1"))!;
    expect(response.headers.get("location")).toBe("https://frankjordan.dev/de/work?x=1");
  });

  it("leaves addresses that already have a language alone", () => {
    expect(proxy(request("/fr/contact"))).toBeUndefined();
    expect(proxy(request("/en"))).toBeUndefined();
  });
});
