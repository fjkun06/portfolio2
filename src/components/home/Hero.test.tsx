import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { routes } from "@/i18n/routes";
import de from "@/locales/de";
import en from "@/locales/en";
import fr from "@/locales/fr";

import { Hero } from "./Hero";

vi.stubGlobal("matchMedia", () => ({ matches: true }));

describe("<Hero>", () => {
  it("has the headline as real text in the page's language", () => {
    render(
      <Hero
        lang="de"
        heroes={{ en: en.home.hero, fr: fr.home.hero, de: de.home.hero }}
        to={routes("de")}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(de.home.hero.headlineText);
  });

  it("links the two buttons to the contact page and the departures board", () => {
    render(
      <Hero
        lang="en"
        heroes={{ en: en.home.hero, fr: fr.home.hero, de: de.home.hero }}
        to={routes("en")}
      />,
    );
    expect(screen.getByRole("link", { name: en.home.hero.book.toUpperCase() })).toHaveAttribute(
      "href",
      "/en/contact",
    );
    expect(
      screen.getByRole("link", { name: en.home.hero.departures.toUpperCase() }),
    ).toHaveAttribute("href", "#departures");
  });

  it("rotates in the order English, French, German", () => {
    render(
      <Hero
        lang="en"
        heroes={{ en: en.home.hero, fr: fr.home.hero, de: de.home.hero }}
        to={routes("en")}
      />,
    );
    const words = ["DEPARTURES", "DÉPARTS", "ABFLUG"].map((w) => screen.getByText(w));
    expect(
      words[0].compareDocumentPosition(words[1]) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      words[1].compareDocumentPosition(words[2]) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
