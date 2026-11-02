import { describe, expect, it } from "vitest";

import en from "@/locales/en";

import type { BoardingPass } from "./boarding-pass";
import { boardingPassHtml, escapeHtml } from "./email-template";

const pass: BoardingPass = {
  name: "Ada <b>Lovelace</b>",
  email: "ada@example.com",
  from: "Analytical Engines, London",
  languages: ["FR", "DE"],
  routes: ["ORD", "TBD"],
  when: "SOON",
  message: "First line\nSecond <script>alert(1)</script> line",
  consent: true,
  company: "",
  startedAt: 1,
  lang: "fr",
};

describe("escapeHtml", () => {
  it("turns the characters HTML cares about into entities", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;",
    );
  });
});

describe("boardingPassHtml", () => {
  const html = boardingPassHtml(pass);

  it("never lets what the visitor typed become HTML", () => {
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).not.toContain("<b>Lovelace</b>");
    expect(html).toContain("Ada &lt;b&gt;Lovelace&lt;/b&gt;");
  });

  it("keeps the message's line breaks", () => {
    expect(html).toContain("First line<br>Second &lt;script&gt;");
  });

  it("names the codes the visitor ticked", () => {
    expect(html).toContain(en.form.routeNames.ORD);
    expect(html).toContain(en.form.languageNames.DE);
    expect(html).toContain(en.form.whenNames.SOON);
  });

  it("offers a button that answers the visitor, by first name", () => {
    expect(html).toContain(`href="mailto:ada%40example.com?subject=Re%3A%20Boarding%20pass%3A`);
    expect(html).toContain("Reply to Ada &rarr;");
  });

  it("styles everything inline, as email apps require", () => {
    expect(html).not.toMatch(/<style|<link|<script/);
  });
});
