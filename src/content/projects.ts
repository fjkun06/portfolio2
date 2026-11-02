import type { Locale } from "@/i18n/config";

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
  },
];

/** The project featured on the home page. */
export const featured = projects[0];
