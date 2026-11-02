import type { Locale } from "@/i18n/config";

/**
 * Everything written on the About page, in three languages.
 * The flight log is also shown on the home page ("Your captain"), so it lives here only once.
 * LED texts (title, badges, years, the entry count) are drawn in dots: capitals and simple punctuation.
 */
export type LogEntry = {
  /** LED text, e.g. 2023-25 or NOW. */
  year: string;
  role: string;
  where: string;
  /** One short line, shown on the About page only. */
  note: string;
};

export type AboutContent = {
  meta: { title: string; description: string };
  breadcrumb: string;
  titleLed: [string, string];
  titleText: string;
  /** Two small LED badges under the title. */
  badges: [string, string];
  intro: string;
  photo: string;
  caption: string;
  why: { label: string; statement: string; body: string };
  languages: { title: [string, string]; titleText: string };
  log: {
    title: string;
    count: string;
    columns: [string, string, string, string];
    entries: LogEntry[];
  };
  tools: { title: string; intro: string };
  principles: { title: string; items: [string, string][] };
};

/** The three languages, each introduced in itself; the same on every version of the page. */
export const LANGUAGES = [
  { code: "EN", name: "ENGLISH", lang: "en", line: "I speak your customers’ language." },
  { code: "FR", name: "FRANÇAIS", lang: "fr", line: "Je parle la langue de vos clients." },
  { code: "DE", name: "DEUTSCH", lang: "de", line: "Ich spreche die Sprache Ihrer Kunden." },
] as const;

/** Tools shown as LED tiles ("Instruments"). */
export const TOOLS = ["NEXT.JS", "REACT", "TYPESCRIPT", "NODE.JS", "VERCEL", "GIT"] as const;

export const aboutContent: Record<Locale, AboutContent> = {
  en: {
    meta: {
      title: "About Frank Jordan, frontend developer in Essen",
      description:
        "Frank Jordan, frontend developer in Essen: multilingual websites in English, French and German, designed and built by one person.",
    },
    breadcrumb: "About",
    titleLed: ["YOUR", "CAPTAIN"],
    titleText: "Your captain: about Frank Jordan",
    badges: ["ON DUTY SINCE 2021", "BASE: ESSEN DE"],
    intro:
      "I’m Frank, a frontend developer from Cameroon, now living and studying in Germany. I design and build websites for businesses whose customers don’t all speak the same language.",
    photo: "Portrait of Frank Jordan",
    caption: "Frontend developer, Germany",
    why: {
      label: "Why I do this",
      statement:
        "I grew up between French and English, now I live in German. I know what it’s like when a website doesn’t speak your language.",
      body: "I studied computer engineering in Buea and now study Ingenieurinformatik at THGA Bochum. Since 2021 I’ve built web frontends with React, Next.js and TypeScript, most recently in an international team at Accenture. On my own projects I take care of everything: design, code, hosting, email and getting found on Google.",
    },
    languages: { title: ["THREE LANGUAGES", "ON BOARD"], titleText: "Three languages on board" },
    log: {
      title: "FLIGHT LOG",
      count: "{n} ENTRIES",
      columns: ["Year", "Role", "Where", "Note"],
      entries: [
        {
          year: "NOW",
          role: "INGENIEURINFORMATIK",
          where: "THGA Bochum",
          note: "Studying engineering informatics in Germany.",
        },
        {
          year: "2023-25",
          role: "FRONTEND DEVELOPER",
          where: "Accenture GmbH",
          note: "Web frontends in an international team.",
        },
        {
          year: "2023",
          role: "FRONTEND DEVELOPER",
          where: "WandaPrep",
          note: "Building the product’s web interface.",
        },
        {
          year: "2023",
          role: "B.SC. COMPUTER ENGINEERING",
          where: "University of Buea",
          note: "Degree in Cameroon.",
        },
        {
          year: "2021",
          role: "VOLUNTEER FRONTEND DEV",
          where: "Positive Impact Events",
          note: "Where the flying started.",
        },
      ],
    },
    tools: {
      title: "INSTRUMENTS",
      intro:
        "The tools I fly with. Modern, fast and widely used, so your site is never stuck with one developer.",
    },
    principles: {
      title: "HOW I FLY",
      items: [
        [
          "One pilot",
          "You talk to the person who designs and builds your site. Nothing gets lost in a handover.",
        ],
        ["Plain words", "I explain every choice without jargon, in English, French or German."],
        [
          "Built to last",
          "Clean code and accounts in your name, so any developer could take over later.",
        ],
      ],
    },
  },

  fr: {
    meta: {
      title: "À propos de Frank Jordan, développeur frontend à Essen",
      description:
        "Frank Jordan, développeur frontend à Essen : des sites multilingues en français, anglais et allemand, conçus et développés par une seule personne.",
    },
    breadcrumb: "À propos",
    titleLed: ["VOTRE", "COMMANDANT"],
    titleText: "Votre commandant : à propos de Frank Jordan",
    badges: ["EN SERVICE DEPUIS 2021", "BASE : ESSEN DE"],
    intro:
      "Je suis Frank, développeur frontend originaire du Cameroun, aujourd’hui installé en Allemagne pour mes études. Je conçois et développe des sites pour les entreprises dont les clients ne parlent pas tous la même langue.",
    photo: "Portrait de Frank Jordan",
    caption: "Développeur frontend, Allemagne",
    why: {
      label: "Pourquoi je fais ce métier",
      statement:
        "J’ai grandi entre le français et l’anglais, aujourd’hui je vis en allemand. Je sais ce que c’est quand un site ne parle pas votre langue.",
      body: "J’ai étudié le génie informatique à Buea et j’étudie aujourd’hui l’Ingenieurinformatik à la THGA de Bochum. Depuis 2021, je développe des interfaces web avec React, Next.js et TypeScript, dernièrement au sein d’une équipe internationale chez Accenture. Sur mes propres projets, je m’occupe de tout : design, code, hébergement, e-mail et référencement sur Google.",
    },
    languages: { title: ["TROIS LANGUES", "À BORD"], titleText: "Trois langues à bord" },
    log: {
      title: "CARNET DE VOL",
      count: "{n} ENTRÉES",
      columns: ["Année", "Poste", "Où", "Note"],
      entries: [
        {
          year: "AUJ.",
          role: "INGENIEURINFORMATIK",
          where: "THGA Bochum",
          note: "Études d’ingénierie informatique en Allemagne.",
        },
        {
          year: "2023-25",
          role: "DÉVELOPPEUR FRONTEND",
          where: "Accenture GmbH",
          note: "Interfaces web dans une équipe internationale.",
        },
        {
          year: "2023",
          role: "DÉVELOPPEUR FRONTEND",
          where: "WandaPrep",
          note: "Développement de l’interface web du produit.",
        },
        {
          year: "2023",
          role: "B.SC. GÉNIE INFORMATIQUE",
          where: "Université de Buea",
          note: "Diplôme obtenu au Cameroun.",
        },
        {
          year: "2021",
          role: "DÉV. FRONTEND BÉNÉVOLE",
          where: "Positive Impact Events",
          note: "Là où tout a décollé.",
        },
      ],
    },
    tools: {
      title: "INSTRUMENTS",
      intro:
        "Les outils avec lesquels je vole. Modernes, rapides et très répandus : votre site ne dépend jamais d’un seul développeur.",
    },
    principles: {
      title: "MA FAÇON DE VOLER",
      items: [
        [
          "Un seul pilote",
          "Vous parlez à la personne qui conçoit et développe votre site. Rien ne se perd en route.",
        ],
        [
          "Des mots simples",
          "J’explique chaque choix sans jargon, en français, en anglais ou en allemand.",
        ],
        [
          "Fait pour durer",
          "Un code propre et des comptes à votre nom : n’importe quel développeur peut reprendre plus tard.",
        ],
      ],
    },
  },

  de: {
    meta: {
      title: "Über Frank Jordan, Frontend-Entwickler in Essen",
      description:
        "Frank Jordan, Frontend-Entwickler in Essen: mehrsprachige Websites auf Deutsch, Englisch und Französisch, gestaltet und gebaut von einer Person.",
    },
    breadcrumb: "Über mich",
    titleLed: ["IHR", "KAPITÄN"],
    titleText: "Ihr Kapitän: über Frank Jordan",
    badges: ["IM DIENST SEIT 2021", "BASIS: ESSEN DE"],
    intro:
      "Ich bin Frank, Frontend-Entwickler aus Kamerun, und lebe und studiere heute in Deutschland. Ich gestalte und baue Websites für Unternehmen, deren Kunden nicht alle dieselbe Sprache sprechen.",
    photo: "Porträt von Frank Jordan",
    caption: "Frontend-Entwickler, Deutschland",
    why: {
      label: "Warum ich das mache",
      statement:
        "Ich bin zwischen Französisch und Englisch aufgewachsen, heute lebe ich auf Deutsch. Ich weiß, wie es ist, wenn eine Website nicht Ihre Sprache spricht.",
      body: "Ich habe in Buea Computer Engineering studiert und studiere jetzt Ingenieurinformatik an der THGA Bochum. Seit 2021 entwickle ich Web-Frontends mit React, Next.js und TypeScript, zuletzt in einem internationalen Team bei Accenture. Bei eigenen Projekten kümmere ich mich um alles: Design, Code, Hosting, E-Mail und die Auffindbarkeit bei Google.",
    },
    languages: { title: ["DREI SPRACHEN", "AN BORD"], titleText: "Drei Sprachen an Bord" },
    log: {
      title: "FLUGBUCH",
      count: "{n} EINTRÄGE",
      columns: ["Jahr", "Rolle", "Wo", "Notiz"],
      entries: [
        {
          year: "JETZT",
          role: "INGENIEURINFORMATIK",
          where: "THGA Bochum",
          note: "Studium der Ingenieurinformatik in Deutschland.",
        },
        {
          year: "2023-25",
          role: "FRONTEND-ENTWICKLER",
          where: "Accenture GmbH",
          note: "Web-Frontends in einem internationalen Team.",
        },
        {
          year: "2023",
          role: "FRONTEND-ENTWICKLER",
          where: "WandaPrep",
          note: "Die Weboberfläche des Produkts gebaut.",
        },
        {
          year: "2023",
          role: "B.SC. TECHNISCHE INFORMATIK",
          where: "University of Buea",
          note: "Abschluss in Kamerun.",
        },
        {
          year: "2021",
          role: "EHRENAMTLICHER FRONTEND-DEV",
          where: "Positive Impact Events",
          note: "Hier hat alles abgehoben.",
        },
      ],
    },
    tools: {
      title: "INSTRUMENTE",
      intro:
        "Die Werkzeuge, mit denen ich fliege. Modern, schnell und weit verbreitet, damit Ihre Website nie an einem einzigen Entwickler hängt.",
    },
    principles: {
      title: "SO FLIEGE ICH",
      items: [
        [
          "Ein Pilot",
          "Sie sprechen mit der Person, die Ihre Website gestaltet und baut. Unterwegs geht nichts verloren.",
        ],
        [
          "Klare Worte",
          "Ich erkläre jede Entscheidung ohne Fachjargon, auf Deutsch, Englisch oder Französisch.",
        ],
        [
          "Gebaut für Dauer",
          "Sauberer Code und Konten auf Ihren Namen, damit später jeder Entwickler übernehmen kann.",
        ],
      ],
    },
  },
};
