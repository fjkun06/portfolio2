import type { StaticImageData } from "next/image";

import type { Locale } from "@/i18n/config";

import choose from "../../../public/work/herzog-choose.webp";
import confirm from "../../../public/work/herzog-confirm.webp";
import pay from "../../../public/work/herzog-pay.webp";
import upload from "../../../public/work/herzog-upload.webp";

/**
 * The flight report (case study) of Herzog trad', in three languages.
 * Section headings (THE BRIEF, THE JOURNEY…) are shared by every report and live in the
 * dictionaries under `report`; this file holds what's specific to this project.
 *
 * LED texts (manifest codes, stack) are drawn in dots: capitals and simple punctuation only.
 */
export type Report = {
  /** One-line promise under the title. */
  intro: string;
  /** Kind of client, shown in the facts strip. */
  client: string;
  /** Year the site went live. */
  delivered: string;
  /** The big sentence that colours in as you scroll. */
  lead: string;
  /** Who the client is and what they needed. */
  clientText: string;
  goalText: string;
  /** Introduction to the four screens. */
  journeyIntro: string;
  /** The four steps a customer goes through, each with a phone screen. */
  journey: { step: string; text: string }[];
  /** What was built: a three-letter LED code, a title and a sentence. */
  manifest: { code: string; title: string; text: string }[];
  /** Tools used, drawn in LED dots. */
  stack: string[];
  /** A sentence from the client. Leave empty and the quote section isn't shown. */
  quote: string;
  /** Who said it, e.g. "Jane Doe, founder of Herzog trad'". */
  quoteBy: string;
};

const stack = [
  "NEXT.JS",
  "TYPESCRIPT",
  "TAILWIND CSS",
  "REACT HOOK FORM",
  "ZOD",
  "REACT EMAIL",
  "CLOUDFLARE R2",
  "VERCEL",
];

export const herzogReport: Record<Locale, Report> = {
  en: {
    intro:
      "Certified translations, ordered from Cameroon and delivered from Germany. Without a phone call, a courier or a trip.",
    client: "SWORN TRANSLATOR",
    delivered: "2026",
    lead: "Most clients live 5,000 km away and write in French. The translator works in German.",
    clientText:
      "Herzog trad’ translates official documents between French and German: birth certificates, diplomas, transcripts. Her clients are mostly in Cameroon, where a call to Germany is expensive and post takes weeks.",
    goalText:
      "One page in French, German and English where a client can order, upload and pay in a few minutes, and where every order reaches her inbox complete, with the files attached.",
    journeyIntro:
      "From first tap to done in four screens. Designed for a phone first, because that’s where the clients are.",
    journey: [
      {
        step: "CHOOSE",
        text: "Birth certificate, diploma or transcript. The price per page appears at once.",
      },
      {
        step: "UPLOAD",
        text: "Phone photos are compressed in the browser, so slow connections still work.",
      },
      { step: "PAY", text: "Orange Money or SEPA transfer, in euros and CFA francs." },
      {
        step: "CONFIRM",
        text: "An email in the client’s language. The translator gets the full order, files attached.",
      },
    ],
    manifest: [
      {
        code: "ORD",
        title: "LIVE PRICING",
        text: "Document type, page count and express or standard delivery. The total updates as the client types.",
      },
      {
        code: "UPL",
        title: "LIGHT UPLOADS",
        text: "Scans and photos are compressed before sending and stored securely.",
      },
      {
        code: "PAY",
        title: "LOCAL PAYMENT",
        text: "SEPA for Europe, Orange Money for Cameroon. Every amount in both currencies.",
      },
      {
        code: "EML",
        title: "CLEAR EMAILS",
        text: "A confirmation for the client and a complete order, files attached, for the translator.",
      },
      {
        code: "LGL",
        title: "LEGAL IN 3 LANGUAGES",
        text: "Impressum, privacy policy and terms, with the German version marked as binding.",
      },
      {
        code: "SEO",
        title: "FOUND ON GOOGLE",
        text: "Titles in the words clients really search for, structured data and a Google Business Profile.",
      },
    ],
    stack,
    quote: "",
    quoteBy: "",
  },
  fr: {
    intro:
      "Des traductions certifiées, commandées depuis le Cameroun et livrées depuis l’Allemagne. Sans appel, sans coursier, sans déplacement.",
    client: "TRADUCTRICE ASSERMENTÉE",
    delivered: "2026",
    lead: "La plupart des clients vivent à 5 000 km et écrivent en français. La traductrice travaille en allemand.",
    clientText:
      "Herzog trad’ traduit des documents officiels du français vers l’allemand et inversement : actes de naissance, diplômes, relevés de notes. Ses clients sont surtout au Cameroun, où un appel vers l’Allemagne coûte cher et où le courrier met des semaines.",
    goalText:
      "Une page en français, allemand et anglais où le client commande, envoie ses documents et paie en quelques minutes, et où chaque commande arrive complète dans sa boîte mail, fichiers joints.",
    journeyIntro:
      "Du premier geste à la commande terminée en quatre écrans. Pensé d’abord pour le téléphone, parce que c’est là que sont les clients.",
    journey: [
      {
        step: "CHOISIR",
        text: "Acte de naissance, diplôme ou relevé de notes. Le prix à la page s’affiche tout de suite.",
      },
      {
        step: "ENVOYER",
        text: "Les photos du téléphone sont allégées dans le navigateur, même avec une connexion lente.",
      },
      { step: "PAYER", text: "Orange Money ou virement SEPA, en euros et en francs CFA." },
      {
        step: "CONFIRMER",
        text: "Un e-mail dans la langue du client. La traductrice reçoit la commande complète, fichiers joints.",
      },
    ],
    manifest: [
      {
        code: "ORD",
        title: "PRIX EN DIRECT",
        text: "Type de document, nombre de pages, délai express ou standard. Le total se met à jour pendant la saisie.",
      },
      {
        code: "UPL",
        title: "ENVOIS LÉGERS",
        text: "Scans et photos sont allégés avant l’envoi et stockés en sécurité.",
      },
      {
        code: "PAY",
        title: "PAIEMENT LOCAL",
        text: "SEPA pour l’Europe, Orange Money pour le Cameroun. Chaque montant dans les deux monnaies.",
      },
      {
        code: "EML",
        title: "E-MAILS CLAIRS",
        text: "Une confirmation pour le client, et une commande complète avec les fichiers pour la traductrice.",
      },
      {
        code: "LGL",
        title: "MENTIONS EN 3 LANGUES",
        text: "Impressum, confidentialité et CGV, la version allemande faisant foi.",
      },
      {
        code: "SEO",
        title: "TROUVÉ SUR GOOGLE",
        text: "Des titres avec les mots que les clients cherchent vraiment, des données structurées et une fiche Google Business.",
      },
    ],
    stack,
    quote: "",
    quoteBy: "",
  },
  de: {
    intro:
      "Beglaubigte Übersetzungen, in Kamerun bestellt und aus Deutschland geliefert. Ohne Anruf, ohne Kurier, ohne Anreise.",
    client: "VEREIDIGTE ÜBERSETZERIN",
    delivered: "2026",
    lead: "Die meisten Kunden leben 5.000 km entfernt und schreiben auf Französisch. Die Übersetzerin arbeitet auf Deutsch.",
    clientText:
      "Herzog trad’ übersetzt amtliche Dokumente zwischen Französisch und Deutsch: Geburtsurkunden, Diplome, Zeugnisse. Ihre Kunden sitzen vor allem in Kamerun, wo ein Anruf nach Deutschland teuer ist und Post Wochen braucht.",
    goalText:
      "Eine Seite auf Französisch, Deutsch und Englisch, auf der Kunden in wenigen Minuten bestellen, hochladen und bezahlen, und jede Bestellung vollständig samt Dateien in ihrem Postfach ankommt.",
    journeyIntro:
      "Vom ersten Tippen bis zum Abschluss in vier Screens. Zuerst fürs Handy gestaltet, denn dort sind die Kunden.",
    journey: [
      {
        step: "WÄHLEN",
        text: "Geburtsurkunde, Diplom oder Zeugnis. Der Preis pro Seite erscheint sofort.",
      },
      {
        step: "HOCHLADEN",
        text: "Handyfotos werden im Browser verkleinert, damit es auch bei langsamer Verbindung klappt.",
      },
      { step: "ZAHLEN", text: "Orange Money oder SEPA-Überweisung, in Euro und CFA-Franc." },
      {
        step: "BESTÄTIGEN",
        text: "Eine E-Mail in der Sprache des Kunden. Die Übersetzerin bekommt die ganze Bestellung samt Dateien.",
      },
    ],
    manifest: [
      {
        code: "ORD",
        title: "LIVE-PREISE",
        text: "Dokumentart, Seitenzahl und Express- oder Standardlieferung. Der Betrag aktualisiert sich beim Tippen.",
      },
      {
        code: "UPL",
        title: "LEICHTE UPLOADS",
        text: "Scans und Fotos werden vor dem Senden verkleinert und sicher gespeichert.",
      },
      {
        code: "PAY",
        title: "LOKAL BEZAHLEN",
        text: "SEPA für Europa, Orange Money für Kamerun. Jeder Betrag in beiden Währungen.",
      },
      {
        code: "EML",
        title: "KLARE E-MAILS",
        text: "Eine Bestätigung für den Kunden und eine vollständige Bestellung mit Dateien für die Übersetzerin.",
      },
      {
        code: "LGL",
        title: "RECHTLICHES IN 3 SPRACHEN",
        text: "Impressum, Datenschutz und AGB, die deutsche Fassung ist verbindlich.",
      },
      {
        code: "SEO",
        title: "BEI GOOGLE GEFUNDEN",
        text: "Titel mit den Wörtern, nach denen Kunden wirklich suchen, strukturierte Daten und ein Google-Unternehmensprofil.",
      },
    ],
    stack,
    quote: "",
    quoteBy: "",
  },
};

/** Reports by project address. Only projects with `report: true` need one. */
export const reports: Record<string, Record<Locale, Report>> = {
  herzog: herzogReport,
};

/**
 * Phone screens of each report's journey, in step order (the same in every language).
 * Captured from the live site without sending an order; a missing one shows a placeholder.
 */
export const journeyShots: Record<string, StaticImageData[]> = {
  herzog: [choose, upload, pay, confirm],
};
