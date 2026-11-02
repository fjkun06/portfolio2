import type { StaticImageData } from "next/image";

import type { Locale } from "@/i18n/config";

import brytzone from "../../public/work/brytzone.webp";
import digtal from "../../public/work/digtal.webp";
import flippbidd from "../../public/work/flippbidd.webp";
import herzogPhone from "../../public/work/herzog-phone.webp";
import herzog from "../../public/work/herzog.webp";
import trucks from "../../public/work/trucks.webp";

/**
 * Status codes as shown on the departures board. They stay in English in every language,
 * the way real airport boards do; screen readers get a translated label from the dictionary.
 */
export type FlightStatus = "LIVE" | "BOARDING" | "ON HOLD";

/** One project ("flight"). Texts that change per language are records keyed by locale. */
export type Project = {
  /** Used in the address: /en/work/<slug>. */
  slug: string;
  /** Flight number shown on boards, e.g. "FJ 001". */
  code: string;
  year: string;
  /** Name as written on the board, in capitals. */
  name: string;
  /** Kind of client, per language. */
  client: Record<Locale, string>;
  /** Countries involved, as LED text ("CM ⇄ DE"), or "-" when it doesn't apply. */
  route: string;
  /** Languages of the site, as shown on the board. */
  languages: string;
  status: FlightStatus;
  /** Live website, without https://. Empty when there's none to link to. */
  website: string;
  /** Shown in the home page's departures board. */
  onHome: boolean;
  /** One or two sentences about the project, per language. */
  summary: Record<Locale, string>;
  /** Screenshot of the homepage, or null while there's none (a placeholder is shown). */
  image: StaticImageData | null;
  /** Phone screenshot (9 : 18), for the featured project on the home page. */
  imagePhone?: StaticImageData;
  /** Has its own flight report page at /work/<slug>. */
  report: boolean;
};

/** All projects, newest first. The Work page lists them all. */
export const projects: Project[] = [
  {
    slug: "herzog",
    code: "FJ 001",
    year: "2026",
    name: "HERZOG TRAD'",
    client: {
      en: "Sworn translator",
      fr: "Traductrice assermentée",
      de: "Vereidigte Übersetzerin",
    },
    route: "DE ⇄ CM",
    languages: "FR DE EN",
    status: "LIVE",
    website: "herzog-translations.com",
    onHome: true,
    summary: {
      en: "Clients in Cameroon order certified translations from Germany online: upload, price by page, pay by SEPA or Orange Money.",
      fr: "Depuis le Cameroun, les clients commandent des traductions certifiées en Allemagne : envoi des documents, prix à la page, paiement par SEPA ou Orange Money.",
      de: "Kunden in Kamerun bestellen beglaubigte Übersetzungen aus Deutschland online: Upload, Preis pro Seite, Zahlung per SEPA oder Orange Money.",
    },
    image: herzog,
    imagePhone: herzogPhone,
    report: true,
  },
  {
    slug: "translatpro",
    code: "FJ 002",
    year: "2026",
    name: "TRANSLATPRO",
    client: { en: "Translation agency", fr: "Agence de traduction", de: "Übersetzungsagentur" },
    route: "CM",
    languages: "FR EN DE",
    status: "BOARDING",
    website: "",
    onHome: true,
    summary: {
      en: "A translation and interpreting agency in Yaoundé, moving from WordPress to a faster site without losing its Google rankings.",
      fr: "Une agence de traduction et d’interprétation à Yaoundé, qui passe de WordPress à un site plus rapide sans perdre son référencement Google.",
      de: "Eine Übersetzungs- und Dolmetschagentur in Yaoundé, die von WordPress auf eine schnellere Website umzieht, ohne ihre Google-Rankings zu verlieren.",
    },
    image: null,
    report: false,
  },
  {
    slug: "first-trucks",
    code: "FJ 003",
    year: "2023",
    name: "FIRST TRUCKS SARL",
    client: { en: "Car parts supplier", fr: "Fournisseur de pièces auto", de: "Autoteilehändler" },
    route: "CM",
    languages: "FR EN DE",
    status: "LIVE",
    website: "",
    onHome: true,
    summary: {
      en: "A product showcase where every visit can turn into a WhatsApp chat with the shop.",
      fr: "Une vitrine de produits où chaque visite peut devenir une conversation WhatsApp avec la boutique.",
      de: "Ein Produktkatalog, bei dem jeder Besuch zu einem WhatsApp-Chat mit dem Laden werden kann.",
    },
    image: trucks,
    report: false,
  },
  {
    slug: "digtal",
    code: "FJ 004",
    year: "2023",
    name: "DIGTAL",
    client: { en: "Web agency", fr: "Agence web", de: "Webagentur" },
    route: "-",
    languages: "EN FR DE",
    status: "LIVE",
    website: "",
    onHome: true,
    summary: {
      en: "An agency website built in a team, where I led the frontend development.",
      fr: "Le site d’une agence, réalisé en équipe, dont j’ai dirigé le développement frontend.",
      de: "Eine Agentur-Website, im Team gebaut, bei der ich die Frontend-Entwicklung geleitet habe.",
    },
    image: digtal,
    report: false,
  },
  {
    slug: "brytzone",
    code: "FJ 005",
    year: "2023",
    name: "BRYTZONE",
    client: { en: "Student platform", fr: "Plateforme étudiante", de: "Studierendenplattform" },
    route: "-",
    languages: "EN FR DE",
    status: "ON HOLD",
    website: "",
    onHome: true,
    summary: {
      en: "News, internships and polls for university students, organised by faculty.",
      fr: "Actualités, stages et sondages pour les étudiants, organisés par faculté.",
      de: "News, Praktika und Umfragen für Studierende, nach Fakultät geordnet.",
    },
    image: brytzone,
    report: false,
  },
  {
    slug: "flippbidd",
    code: "FJ 006",
    year: "2023",
    name: "FLIPPBIDD",
    client: { en: "Landing page", fr: "Page d’accueil produit", de: "Landingpage" },
    route: "-",
    languages: "EN",
    status: "LIVE",
    website: "",
    onHome: false,
    summary: {
      en: "A product landing page built pixel for pixel from a Figma design.",
      fr: "Une page de présentation produit réalisée au pixel près à partir d’une maquette Figma.",
      de: "Eine Produkt-Landingpage, pixelgenau nach einem Figma-Design umgesetzt.",
    },
    image: flippbidd,
    report: false,
  },
];

/** Finds a project by its address, or undefined. */
export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * The project suggested at the end of a flight report: the next live project in the list
 * (wrapping around), so the link always leads to something finished.
 */
export function nextDeparture(current: Project): Project {
  const start = projects.indexOf(current);
  for (let i = 1; i <= projects.length; i++) {
    const candidate = projects[(start + i) % projects.length];
    if (candidate.status === "LIVE" && candidate !== current) return candidate;
  }
  return current;
}

/** The project featured on the home page. */
export const featured = projects[0];
