import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { legalContent } from "@/content/legal";
import { siteConfig } from "@/utils/site";

import { fillLegal, LegalPart, ownerIncomplete } from "./LegalSections";

const t = legalContent.en;
const empty = { name: "", street: "", city: "" };
const owner = { name: "Frank Jordan", street: "Musterstr. 1", city: "45127 Essen" };
const values = (o = empty) => ({
  owner: o,
  placeholders: t.placeholders,
  contactHref: "/en/contact",
  contactLink: t.contactLink,
});

describe("ownerIncomplete", () => {
  it("is true while any detail is missing", () => {
    expect(ownerIncomplete(empty)).toBe(true);
    expect(ownerIncomplete({ ...owner, street: "" })).toBe(true);
    expect(ownerIncomplete(owner)).toBe(false);
  });
});

describe("fillLegal", () => {
  it("shows missing details as red placeholders", () => {
    render(<p>{fillLegal("{name}, {city}", values())}</p>);
    const marks = document.querySelectorAll("mark");
    expect([...marks].map((m) => m.textContent)).toEqual([
      t.placeholders.name,
      t.placeholders.city,
    ]);
    expect(marks[0]).toHaveClass("text-danger");
  });

  it("puts in the details once they're filled in", () => {
    render(<p>{fillLegal("{name}, {street}, {city}", values(owner))}</p>);
    expect(document.querySelector("p")).toHaveTextContent(
      "Frank Jordan, Musterstr. 1, 45127 Essen",
    );
    expect(document.querySelector("mark")).toBeNull();
  });

  it("turns {email} and {contact} into links", () => {
    render(<p>{fillLegal("Email: {email}. Form: {contact}", values())}</p>);
    expect(screen.getByRole("link", { name: siteConfig.email })).toHaveAttribute(
      "href",
      `mailto:${siteConfig.email}`,
    );
    expect(screen.getByRole("link", { name: t.contactLink })).toHaveAttribute(
      "href",
      "/en/contact",
    );
  });
});

describe("<LegalPart>", () => {
  it("is a heading to jump to, with one titled block per section", () => {
    render(<LegalPart id="privacy" part={t.privacy} values={values()} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("id", "privacy");
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(t.privacy.sections.map((s) => s.title));
  });
});
