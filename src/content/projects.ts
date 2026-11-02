import type { StaticImageData } from "next/image";

import type { Locale } from "@/i18n/config";

import brytzone from "../../public/work/brytzone.webp";
import digtal from "../../public/work/digtal.webp";
import flippbidd from "../../public/work/flippbidd.webp";
import herzogPhone from "../../public/work/herzog-phone.webp";
import herzog from "../../public/work/herzog.webp";
import translatpro from "../../public/work/translatpro.webp";
import trucks from "../../public/work/trucks.webp";

/**
 * Status codes as shown on the departures board. They stay in English in every language,
 * the way real airport boards do; screen readers get a translated label from the dictionary.
 */
export type FlightStatus = "LIVE" | "BOARDING" | "CHECK-IN" | "ON HOLD";

/** Every status, in the order boards and filters list them. */
export const STATUSES: FlightStatus[] = ["LIVE", "BOARDING", "CHECK-IN", "ON HOLD"];

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
  /** Live website or demo, without https://. Empty when there's none to link to. */
  website: string;
  /** Source code on GitHub (full address). Empty when the code isn't public. */
  repo: string;
  /** Shown in the home page's departures board. */
  onHome: boolean;
  /** One or two sentences about the project, per language. */
  summary: Record<Locale, string>;
  /**
   * A few sentences more on the project page: who it was for, what it does, how it was built.
   * Left out while there's nothing more to say than the summary.
   */
  story?: Record<Locale, string>;
  /** Tools it's built with, drawn in LED dots (capitals and simple punctuation only). */
  stack: string[];
  /**
   * Screenshot of the homepage (or, while a site is still being built, a board-style cover),
   * or null while there's none (a placeholder is shown).
   */
  image: StaticImageData | null;
  /** Phone screenshot (9 : 18), for the featured project on the home page. */
  imagePhone?: StaticImageData;
  /** Has a full flight report (case study). Every project has a page at /work/<slug>. */
  report: boolean;
};

/**
 * Image quality for project screenshots: higher than Next.js' default 75 so the small text in
 * them stays sharp. Must be listed in `images.qualities` in next.config.ts.
 * The screenshots themselves are all 2880 × 1620 (16 : 9, a 1440 px wide window at 2×), so every
 * card and page shows them at the same shape.
 */
export const SHOT_QUALITY = 90;

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
    repo: "",
    onHome: true,
    summary: {
      en: "Clients in Cameroon order certified translations from Germany online: upload, price by page, pay by SEPA or Orange Money.",
      fr: "Depuis le Cameroun, les clients commandent des traductions certifiées en Allemagne : envoi des documents, prix à la page, paiement par SEPA ou Orange Money.",
      de: "Kunden in Kamerun bestellen beglaubigte Übersetzungen aus Deutschland online: Upload, Preis pro Seite, Zahlung per SEPA oder Orange Money.",
    },
    stack: [
      "NEXT.JS",
      "TYPESCRIPT",
      "TAILWIND CSS",
      "REACT HOOK FORM",
      "ZOD",
      "REACT EMAIL",
      "CLOUDFLARE R2",
      "VERCEL",
    ],
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
    status: "CHECK-IN",
    website: "",
    repo: "",
    onHome: true,
    summary: {
      en: "A translation and interpreting agency in Yaoundé, moving from WordPress to a faster site without losing its Google rankings.",
      fr: "Une agence de traduction et d’interprétation à Yaoundé, qui passe de WordPress à un site plus rapide sans perdre son référencement Google.",
      de: "Eine Übersetzungs- und Dolmetschagentur in Yaoundé, die von WordPress auf eine schnellere Website umzieht, ohne ihre Google-Rankings zu verlieren.",
    },
    stack: [],
    image: translatpro,
    report: false,
  },
  {
    slug: "first-trucks",
    code: "FJ 003",
    year: "2023",
    name: "FIRST TRUCKS SARL",
    client: { en: "Car parts supplier", fr: "Fournisseur de pièces auto", de: "Autoteilehändler" },
    route: "CM",
    languages: "FR EN",
    status: "LIVE",
    website: "first-trucks-e-commerce-6uzz.vercel.app",
    repo: "https://github.com/fjkun06/first_trucks-e-commerce",
    onHome: true,
    summary: {
      en: "A product showcase where every visit can turn into a WhatsApp chat with the shop.",
      fr: "Une vitrine de produits où chaque visite peut devenir une conversation WhatsApp avec la boutique.",
      de: "Ein Produktkatalog, bei dem jeder Besuch zu einem WhatsApp-Chat mit dem Laden werden kann.",
    },
    story: {
      en: "A product showcase for a supplier of car parts, engine lubricants and fluids in Cameroon. Designed in Figma in close contact with the client, multilingual from the start, and one tap on the WhatsApp button opens a chat with the shop.",
      fr: "Une vitrine pour un fournisseur de pièces auto, de lubrifiants moteur et de fluides au Cameroun. Conçue sur Figma en lien étroit avec le client, multilingue dès le départ, et un clic sur le bouton WhatsApp ouvre une conversation avec la boutique.",
      de: "Ein Produktkatalog für einen Händler von Autoteilen, Motorschmierstoffen und Flüssigkeiten in Kamerun. In enger Abstimmung mit dem Kunden in Figma gestaltet, von Anfang an mehrsprachig, und ein Tipp auf den WhatsApp-Button öffnet einen Chat mit dem Laden.",
    },
    stack: ["NEXT.JS", "TYPESCRIPT", "CSS", "I18N", "SVG", "FIGMA"],
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
    website: "digtall.netlify.app",
    repo: "https://github.com/fjkun06/Digtal",
    onHome: true,
    summary: {
      en: "An agency website built in a team, where I led the frontend development.",
      fr: "Le site d’une agence, réalisé en équipe, dont j’ai dirigé le développement frontend.",
      de: "Eine Agentur-Website, im Team gebaut, bei der ich die Frontend-Entwicklung geleitet habe.",
    },
    story: {
      en: "A multilingual website for Digtal, a web development and consulting company. I led the frontend in a cross-functional team: React components, the translations, and content from the company’s REST API.",
      fr: "Un site multilingue pour Digtal, une société de développement web et de conseil. J’ai dirigé le frontend au sein d’une équipe pluridisciplinaire : composants React, traductions et contenus issus de l’API REST de l’entreprise.",
      de: "Eine mehrsprachige Website für Digtal, ein Unternehmen für Webentwicklung und Beratung. Ich habe das Frontend in einem interdisziplinären Team geleitet: React-Komponenten, die Übersetzungen und Inhalte aus der REST-API des Unternehmens.",
    },
    stack: ["JAVASCRIPT", "REACT", "I18N", "SCSS", "REST API", "HTML5"],
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
    website: "brytzone-1.vercel.app/en-US",
    repo: "https://github.com/fjkun06/brytzone",
    onHome: true,
    summary: {
      en: "News, internships and polls for university students, organised by faculty.",
      fr: "Actualités, stages et sondages pour les étudiants, organisés par faculté.",
      de: "News, Praktika und Umfragen für Studierende, nach Fakultät geordnet.",
    },
    story: {
      en: "A multilingual platform for university students: news from their faculty, internships, polls on their courses, and projects that get them noticed by employers before they graduate. Full stack: a Next.js frontend, a Node.js and Express API, MongoDB, and sign-in with JWT.",
      fr: "Une plateforme multilingue pour les étudiants : actualités de leur faculté, stages, sondages sur leurs cours et projets qui les font remarquer par les employeurs avant même leur diplôme. Full stack : un frontend Next.js, une API Node.js et Express, MongoDB et une connexion par JWT.",
      de: "Eine mehrsprachige Plattform für Studierende: Neuigkeiten ihrer Fakultät, Praktika, Umfragen zu ihren Kursen und Projekte, mit denen sie Arbeitgebern schon vor dem Abschluss auffallen. Full Stack: ein Next.js-Frontend, eine Node.js- und Express-API, MongoDB und Anmeldung per JWT.",
    },
    stack: ["NEXT.JS", "TYPESCRIPT", "NODE.JS", "EXPRESS", "MONGODB", "JWT", "I18N", "SVG"],
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
    website: "flipp-bid.vercel.app",
    repo: "https://github.com/fjkun06/FlippBid",
    onHome: false,
    summary: {
      en: "A product landing page built pixel for pixel from a Figma design.",
      fr: "Une page de présentation produit réalisée au pixel près à partir d’une maquette Figma.",
      de: "Eine Produkt-Landingpage, pixelgenau nach einem Figma-Design umgesetzt.",
    },
    story: {
      en: "The landing page of FlippBidd, a platform where real estate investors share and discuss deals directly. Built pixel for pixel from the Figma design.",
      fr: "La page d’accueil de FlippBidd, une plateforme où les investisseurs immobiliers partagent et discutent leurs affaires en direct. Réalisée au pixel près d’après la maquette Figma.",
      de: "Die Landingpage von FlippBidd, einer Plattform, auf der Immobilieninvestoren Deals direkt teilen und besprechen. Pixelgenau nach dem Figma-Design gebaut.",
    },
    stack: ["NEXT.JS", "TYPESCRIPT", "SCSS", "FIGMA"],
    image: flippbidd,
    report: false,
  },
];

/**
 * Live projects are finished and online; the others are still in progress: at check-in (just
 * started), boarding (being built) or on hold (paused).
 */
export function isLive(project: Project): boolean {
  return project.status === "LIVE";
}

/** A project's own page: its flight report, or its project page. */
export function projectHref(project: Project, workHref: string): string {
  return `${workHref}/${project.slug}`;
}

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
