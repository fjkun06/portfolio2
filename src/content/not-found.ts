import type { Locale } from "@/i18n/config";

/**
 * The 404 page ("Flight not found"), in three languages.
 * LED texts (status, title, link codes) are drawn in dots: capitals and simple punctuation.
 */
export type NotFoundContent = {
  title: string;
  error: string;
  status: string;
  statusText: string;
  titleLed: [string, string];
  titleText: string;
  text: string;
  home: string;
  work: string;
  others: string;
  links: { home: string; work: string; report: string; book: string };
};

export const notFoundContent: Record<Locale, NotFoundContent> = {
  en: {
    title: "Flight not found · Frank Jordan",
    error: "ERROR 404",
    status: "CANCELLED",
    statusText: "Status: cancelled",
    titleLed: ["FLIGHT", "NOT FOUND"],
    titleText: "Flight not found",
    text: "This page doesn’t exist or has moved. The link may be old or mistyped. Your connection home is ready.",
    home: "Back to the homepage",
    work: "See all departures",
    others: "OTHER CONNECTIONS",
    links: {
      home: "Home",
      work: "All departures",
      report: "Herzog trad’ flight report",
      book: "Book a project",
    },
  },
  fr: {
    title: "Vol introuvable · Frank Jordan",
    error: "ERREUR 404",
    status: "ANNULÉ",
    statusText: "Statut : annulé",
    titleLed: ["VOL", "INTROUVABLE"],
    titleText: "Vol introuvable",
    text: "Cette page n’existe pas ou a été déplacée. Le lien est peut-être ancien ou mal saisi. Votre correspondance vers l’accueil est prête.",
    home: "Retour à l’accueil",
    work: "Voir tous les départs",
    others: "AUTRES VOLS",
    links: {
      home: "Accueil",
      work: "Tous les départs",
      report: "Rapport de vol Herzog trad’",
      book: "Réserver un projet",
    },
  },
  de: {
    title: "Flug nicht gefunden · Frank Jordan",
    error: "FEHLER 404",
    status: "GESTRICHEN",
    statusText: "Status: gestrichen",
    titleLed: ["FLUG", "NICHT GEFUNDEN"],
    titleText: "Flug nicht gefunden",
    text: "Diese Seite gibt es nicht oder sie ist umgezogen. Vielleicht ist der Link veraltet oder vertippt. Ihr Anschluss zur Startseite steht bereit.",
    home: "Zur Startseite",
    work: "Alle Abflüge ansehen",
    others: "WEITERE ANSCHLÜSSE",
    links: {
      home: "Startseite",
      work: "Alle Abflüge",
      report: "Flugbericht Herzog trad’",
      book: "Projekt anfragen",
    },
  },
};
