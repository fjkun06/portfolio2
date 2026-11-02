import type { Locale } from "@/i18n/config";

/**
 * The legal page: Impressum and privacy policy, in three languages. The German text is the
 * binding one; English and French are translations.
 *
 * Paragraphs can contain tokens, replaced when the page is drawn (see LegalText):
 * - {name} {street} {city}: the owner's details from siteConfig.owner. While a detail is
 *   empty, its placeholder (below) is shown in red, so nothing missing goes unnoticed.
 * - {email}: the contact address, as a mailto link.
 * - {contact}: a link to the Contact page.
 *
 * Section codes are drawn in LED dots: capitals only.
 */
export type LegalSection = { code: string; title: string; paragraphs: string[] };

export type LegalContent = {
  meta: { title: string; description: string };
  breadcrumb: string;
  titleLed: [string, string];
  titleText: string;
  /** "The German version is binding" (null on the German page). */
  binding: string | null;
  /** Shown only while some owner details are missing. */
  missing: string;
  tabsLabel: string;
  tabs: { impressum: string; privacy: string };
  impressum: { title: string; sections: LegalSection[] };
  privacy: { title: string; sections: LegalSection[] };
  updated: string;
  placeholders: { name: string; street: string; city: string };
  contactLink: string;
};

/** Month of the last change to these texts, shown at the bottom (LED). */
export const LEGAL_UPDATED = "11/2026";

const VERCEL = "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA";
const IONOS = "IONOS SE, Elgendorfer Str. 57, 56410 Montabaur";

export const legalContent: Record<Locale, LegalContent> = {
  de: {
    meta: {
      title: "Impressum und Datenschutz · Frank Jordan",
      description: "Impressum und Datenschutzerklärung von frankjordan.dev.",
    },
    breadcrumb: "Rechtliches",
    titleLed: ["BEFÖRDERUNGS-", "BEDINGUNGEN"],
    titleText: "Beförderungsbedingungen: Impressum und Datenschutzerklärung",
    binding: null,
    missing: "Rot markierte Angaben fehlen noch und werden ergänzt.",
    tabsLabel: "Rechtliche Seiten",
    tabs: { impressum: "IMPRESSUM", privacy: "DATENSCHUTZ" },
    impressum: {
      title: "IMPRESSUM",
      sections: [
        {
          code: "DDG",
          title: "Angaben gemäß § 5 DDG",
          paragraphs: ["{name}", "{street}", "{city}, Deutschland"],
        },
        {
          code: "CNT",
          title: "Kontakt",
          paragraphs: ["E-Mail: {email}", "Kontaktformular: {contact}"],
        },
        {
          code: "LNK",
          title: "Links zu anderen Websites",
          paragraphs: [
            "Diese Website enthält Links zu externen Websites, auf deren Inhalte ich keinen Einfluss habe. Für diese Inhalte sind die jeweiligen Anbieter verantwortlich. Erfahre ich, dass eine verlinkte Seite gegen geltendes Recht verstößt, entferne ich den Link umgehend.",
          ],
        },
      ],
    },
    privacy: {
      title: "DATENSCHUTZ",
      sections: [
        {
          code: "WHO",
          title: "Verantwortlicher",
          paragraphs: ["{name}, {street}, {city}, Deutschland. E-Mail: {email}"],
        },
        {
          code: "LOG",
          title: "Hosting und Server-Logs",
          paragraphs: [
            `Diese Website wird bei ${VERCEL} gehostet. Beim Aufruf einer Seite verarbeitet der Hoster technisch notwendige Daten wie Ihre IP-Adresse, den Zeitpunkt und die aufgerufene Seite, um die Seite auszuliefern und vor Angriffen zu schützen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.`,
            "Vercel ist unter dem EU-US Data Privacy Framework zertifiziert. Die Übermittlung in die USA stützt sich auf den Angemessenheitsbeschluss der EU-Kommission (Art. 45 DSGVO).",
          ],
        },
        {
          code: "FRM",
          title: "Kontaktformular und E-Mail",
          paragraphs: [
            `Wenn Sie die Bordkarte absenden oder mir schreiben, verarbeite ich Ihren Namen, Ihre E-Mail-Adresse, Ihre Angaben zum Projekt und Ihre Nachricht, um Ihnen zu antworten. Die Nachricht erreicht mich per E-Mail über ${IONOS}.`,
            "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO, soweit es um ein mögliches Projekt geht, sonst Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO, die Sie jederzeit widerrufen können. Ich lösche die Daten spätestens sechs Monate nach unserem letzten Kontakt, sofern keine gesetzliche Aufbewahrungspflicht besteht.",
          ],
        },
        {
          code: "NO",
          title: "Keine Cookies, kein Tracking",
          paragraphs: [
            "Diese Website setzt keine Cookies und nutzt keine Analyse- oder Werbedienste. Die Schriften werden von dieser Website selbst geladen.",
            "Wenn Sie zwischen hellem und dunklem Modus wechseln, speichert Ihr Browser diese Wahl lokal (localStorage). Sie verlässt Ihr Gerät nicht (§ 25 Abs. 2 Nr. 2 TDDDG).",
          ],
        },
        {
          code: "YOU",
          title: "Ihre Rechte",
          paragraphs: [
            "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit sowie das Recht, der Verarbeitung zu widersprechen (Art. 15 bis 21 DSGVO). Eine E-Mail genügt. Außerdem können Sie sich bei einer Datenschutzaufsichtsbehörde beschweren, zum Beispiel bei der Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen.",
          ],
        },
      ],
    },
    updated: "Stand",
    placeholders: {
      name: "[Vollständiger Name]",
      street: "[Straße und Hausnummer]",
      city: "[PLZ und Ort]",
    },
    contactLink: "frankjordan.dev/de/contact",
  },

  en: {
    meta: {
      title: "Impressum and privacy · Frank Jordan",
      description: "Legal notice (Impressum) and privacy policy of frankjordan.dev.",
    },
    breadcrumb: "Legal",
    titleLed: ["TERMS OF", "CARRIAGE"],
    titleText: "Terms of carriage: Impressum and privacy policy",
    binding: "The German version of these texts is legally binding.",
    missing: "Details in red are still missing and will be added.",
    tabsLabel: "Legal pages",
    tabs: { impressum: "IMPRESSUM", privacy: "PRIVACY" },
    impressum: {
      title: "IMPRESSUM",
      sections: [
        {
          code: "DDG",
          title: "Information under § 5 DDG",
          paragraphs: ["{name}", "{street}", "{city}, Germany"],
        },
        {
          code: "CNT",
          title: "Contact",
          paragraphs: ["Email: {email}", "Contact form: {contact}"],
        },
        {
          code: "LNK",
          title: "Links to other websites",
          paragraphs: [
            "This website links to external websites whose content I don’t control. Their providers are responsible for that content. If I learn that a linked page breaks the law, I remove the link straight away.",
          ],
        },
      ],
    },
    privacy: {
      title: "PRIVACY POLICY",
      sections: [
        {
          code: "WHO",
          title: "Who is responsible",
          paragraphs: ["{name}, {street}, {city}, Germany. Email: {email}"],
        },
        {
          code: "LOG",
          title: "Hosting and server logs",
          paragraphs: [
            `This website is hosted by ${VERCEL}. When you open a page, the host processes technically necessary data such as your IP address, the time and the page requested, to deliver the page and protect it from attacks. Legal basis: Art. 6(1)(f) GDPR.`,
            "Vercel is certified under the EU-U.S. Data Privacy Framework. Transfers to the USA rely on the European Commission’s adequacy decision (Art. 45 GDPR).",
          ],
        },
        {
          code: "FRM",
          title: "Contact form and email",
          paragraphs: [
            `When you send the boarding pass or write to me, I process your name, email address, project details and message to answer you. The message reaches me by email via ${IONOS}, Germany.`,
            "Legal basis: Art. 6(1)(b) GDPR where it concerns a possible project, otherwise your consent under Art. 6(1)(a) GDPR, which you can withdraw at any time. I delete the data at the latest six months after our last contact, unless the law requires me to keep it.",
          ],
        },
        {
          code: "NO",
          title: "No cookies, no tracking",
          paragraphs: [
            "This website sets no cookies and uses no analytics or advertising services. Fonts are loaded from this website itself.",
            "When you switch between dark and light mode, your browser remembers the choice locally (localStorage). It never leaves your device (§ 25(2) no. 2 TDDDG).",
          ],
        },
        {
          code: "YOU",
          title: "Your rights",
          paragraphs: [
            "You can ask for access, correction, deletion, restriction or a copy of your data, and object to its processing (Art. 15 to 21 GDPR). An email is enough. You can also complain to a data protection authority, for example the State Commissioner for Data Protection and Freedom of Information of North Rhine-Westphalia.",
          ],
        },
      ],
    },
    updated: "Last updated",
    placeholders: {
      name: "[Full legal name]",
      street: "[Street and house number]",
      city: "[Postcode and city]",
    },
    contactLink: "frankjordan.dev/en/contact",
  },

  fr: {
    meta: {
      title: "Mentions légales et confidentialité · Frank Jordan",
      description:
        "Mentions légales (Impressum) et politique de confidentialité de frankjordan.dev.",
    },
    breadcrumb: "Mentions légales",
    titleLed: ["CONDITIONS DE", "TRANSPORT"],
    titleText: "Conditions de transport : mentions légales et politique de confidentialité",
    binding: "Seule la version allemande de ces textes fait foi.",
    missing: "Les informations en rouge manquent encore et seront complétées.",
    tabsLabel: "Pages juridiques",
    tabs: { impressum: "IMPRESSUM", privacy: "CONFIDENTIALITÉ" },
    impressum: {
      title: "MENTIONS LÉGALES",
      sections: [
        {
          code: "DDG",
          title: "Informations selon le § 5 DDG",
          paragraphs: ["{name}", "{street}", "{city}, Allemagne"],
        },
        {
          code: "CNT",
          title: "Contact",
          paragraphs: ["E-mail : {email}", "Formulaire de contact : {contact}"],
        },
        {
          code: "LNK",
          title: "Liens vers d’autres sites",
          paragraphs: [
            "Ce site contient des liens vers des sites externes dont je ne contrôle pas le contenu. Leurs éditeurs en sont responsables. Si j’apprends qu’une page liée enfreint la loi, je retire le lien immédiatement.",
          ],
        },
      ],
    },
    privacy: {
      title: "CONFIDENTIALITÉ",
      sections: [
        {
          code: "WHO",
          title: "Responsable du traitement",
          paragraphs: ["{name}, {street}, {city}, Allemagne. E-mail : {email}"],
        },
        {
          code: "LOG",
          title: "Hébergement et journaux du serveur",
          paragraphs: [
            `Ce site est hébergé par ${VERCEL}. Lorsque vous ouvrez une page, l’hébergeur traite les données techniquement nécessaires, comme votre adresse IP, l’heure et la page demandée, pour afficher la page et la protéger contre les attaques. Base légale : art. 6, par. 1, point f du RGPD.`,
            "Vercel est certifié dans le cadre du EU-U.S. Data Privacy Framework. Les transferts vers les États-Unis reposent sur la décision d’adéquation de la Commission européenne (art. 45 du RGPD).",
          ],
        },
        {
          code: "FRM",
          title: "Formulaire de contact et e-mail",
          paragraphs: [
            `Lorsque vous envoyez la carte d’embarquement ou m’écrivez, je traite votre nom, votre adresse e-mail, les détails de votre projet et votre message pour vous répondre. Le message me parvient par e-mail via ${IONOS}, Allemagne.`,
            "Base légale : art. 6, par. 1, point b du RGPD lorsqu’il s’agit d’un projet possible, sinon votre consentement selon l’art. 6, par. 1, point a, que vous pouvez retirer à tout moment. Je supprime les données au plus tard six mois après notre dernier échange, sauf obligation légale de conservation.",
          ],
        },
        {
          code: "NO",
          title: "Ni cookies, ni suivi",
          paragraphs: [
            "Ce site ne dépose aucun cookie et n’utilise aucun service d’analyse ou de publicité. Les polices sont chargées depuis ce site.",
            "Lorsque vous passez du mode sombre au mode clair, votre navigateur mémorise ce choix localement (localStorage). Il ne quitte jamais votre appareil (§ 25, al. 2, n° 2 TDDDG).",
          ],
        },
        {
          code: "YOU",
          title: "Vos droits",
          paragraphs: [
            "Vous pouvez demander l’accès à vos données, leur rectification, leur effacement, la limitation du traitement ou une copie, et vous opposer au traitement (art. 15 à 21 du RGPD). Un e-mail suffit. Vous pouvez aussi déposer une réclamation auprès d’une autorité de protection des données, par exemple la déléguée à la protection des données et à la liberté d’information de Rhénanie-du-Nord-Westphalie.",
          ],
        },
      ],
    },
    updated: "Dernière mise à jour",
    placeholders: {
      name: "[Nom complet]",
      street: "[Rue et numéro]",
      city: "[Code postal et ville]",
    },
    contactLink: "frankjordan.dev/fr/contact",
  },
};
