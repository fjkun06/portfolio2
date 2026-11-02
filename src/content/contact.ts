import type { Locale } from "@/i18n/config";

/**
 * Everything written on the Contact page, in three languages (the form's own texts are in the
 * dictionaries under `form`, because the home page uses the same form).
 * LED texts (title, status values, step numbers) are drawn in dots: capitals and simple punctuation.
 */
export type ContactContent = {
  meta: { title: string; description: string };
  breadcrumb: string;
  titleLed: [string, string];
  titleText: string;
  /** Status board next to the title: [label, LED value]. The first value blinks. */
  status: [string, string][];
  intro: string;
  formLabel: string;
  after: { title: string; steps: [string, string][] };
};

export const contactContent: Record<Locale, ContactContent> = {
  en: {
    meta: {
      title: "Contact · Frank Jordan",
      description:
        "Tell me about your website project. I answer within one working day, in English, French or German.",
    },
    breadcrumb: "Contact",
    titleLed: ["CHECK-IN", "DESK"],
    titleText: "Check-in desk: contact",
    status: [
      ["Desk", "OPEN"],
      ["Reply", "24H"],
      ["Languages", "EN FR DE"],
    ],
    intro:
      "Fill in your boarding pass, or write to me directly: my email and other contacts are at the bottom of the page. I answer every message myself, in English, French or German.",
    formLabel: "Boarding pass",
    after: {
      title: "AFTER CHECK-IN",
      steps: [
        ["I read it", "Personally, the same day if I can."],
        ["I reply", "Within one working day, with a few questions."],
        ["We talk", "A short call, then a fixed quote. No obligation."],
      ],
    },
  },

  fr: {
    meta: {
      title: "Contact · Frank Jordan",
      description:
        "Parlez-moi de votre projet de site. Je réponds sous un jour ouvré, en français, en anglais ou en allemand.",
    },
    breadcrumb: "Contact",
    titleLed: ["COMPTOIR", "CHECK-IN"],
    titleText: "Comptoir d’enregistrement : contact",
    status: [
      ["Comptoir", "OUVERT"],
      ["Réponse", "24H"],
      ["Langues", "FR EN DE"],
    ],
    intro:
      "Remplissez votre carte d’embarquement, ou écrivez-moi directement : mon e-mail et mes autres contacts sont en bas de la page. Je réponds moi-même à chaque message, en français, en anglais ou en allemand.",
    formLabel: "Carte d’embarquement",
    after: {
      title: "ET ENSUITE ?",
      steps: [
        ["Je lis", "Personnellement, le jour même si possible."],
        ["Je réponds", "Sous un jour ouvré, avec quelques questions."],
        ["On en parle", "Un court appel, puis un devis fixe. Sans engagement."],
      ],
    },
  },

  de: {
    meta: {
      title: "Kontakt · Frank Jordan",
      description:
        "Erzählen Sie mir von Ihrem Website-Projekt. Ich antworte innerhalb eines Werktags, auf Deutsch, Englisch oder Französisch.",
    },
    breadcrumb: "Kontakt",
    titleLed: ["CHECK-IN", "SCHALTER"],
    titleText: "Check-in-Schalter: Kontakt",
    status: [
      ["Schalter", "OFFEN"],
      ["Antwort", "24H"],
      ["Sprachen", "DE EN FR"],
    ],
    intro:
      "Füllen Sie Ihre Bordkarte aus oder schreiben Sie mir direkt: Meine E-Mail-Adresse und weitere Kontakte stehen unten auf der Seite. Ich beantworte jede Nachricht selbst, auf Deutsch, Englisch oder Französisch.",
    formLabel: "Bordkarte",
    after: {
      title: "NACH DEM CHECK-IN",
      steps: [
        ["Ich lese", "Persönlich, wenn möglich noch am selben Tag."],
        ["Ich antworte", "Innerhalb eines Werktags, mit ein paar Fragen."],
        ["Wir sprechen", "Ein kurzes Gespräch, dann ein Festpreisangebot. Unverbindlich."],
      ],
    },
  },
};
