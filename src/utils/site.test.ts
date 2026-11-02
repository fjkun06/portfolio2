import { describe, expect, it } from "vitest";

import { siteConfig, whatsappLink } from "./site";

describe("siteConfig", () => {
  it("uses the production domain and its mailbox", () => {
    expect(siteConfig.url).toBe("https://frankjordan.dev");
    expect(siteConfig.email.endsWith("@frankjordan.dev")).toBe(true);
  });

  it("stores the WhatsApp number as digits only, or nothing", () => {
    expect(siteConfig.whatsapp).toMatch(/^(\d{8,15})?$/);
  });
});

describe("whatsappLink", () => {
  it("builds a click-to-chat link", () => {
    expect(whatsappLink("4917612345678")).toBe("https://wa.me/4917612345678");
  });
});
