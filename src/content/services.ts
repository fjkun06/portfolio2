import type { Locale } from "@/i18n/config";

/**
 * Everything written on the Services page, in three languages.
 * LED texts (codes, the title, the fare sign) are drawn in dots: capitals and simple punctuation.
 */
export type Service = {
  /** Three-letter LED code, also the anchor: /services#mlt. Same in every language. */
  code: string;
  /** Where the client is now → where they'll be. */
  from: string;
  to: string;
  title: string;
  lead: string;
  body: string;
  /** What's included ("On board"). */
  included: string[];
  /** Kinds of businesses it suits. */
  goodFor: string[];
  /** Slug of a project that shows this service, if any. */
  example: string | null;
};

export type ServicesContent = {
  meta: { title: string; description: string };
  breadcrumb: string;
  titleLed: [string, string];
  titleText: string;
  intro: string;
  mapLabel: string;
  routesLabel: string;
  routeTag: string;
  included: string;
  includedNote: string;
  goodFor: string;
  example: string;
  services: Service[];
  always: {
    title: [string, string];
    titleText: string;
    intro: string;
    items: { code: string; title: string; text: string }[];
  };
  fares: {
    title: string;
    label: string;
    sign: string;
    signText: string;
    lead: string;
    factorsTitle: string;
    factors: [string, string][];
  };
  faq: { title: [string, string]; titleText: string; items: [string, string][] };
};

const codes = ["MLT", "ORD", "LND", "RBD"];

export const servicesContent: Record<Locale, ServicesContent> = {
  en: {
    meta: {
      title: "Services: multilingual websites · Frank Jordan",
      description:
        "Multilingual business websites, ordering forms, landing pages and rebuilds that keep your Google rankings. In English, French and German.",
    },
    breadcrumb: "Services",
    titleLed: ["ROUTES", "I FLY"],
    titleText: "Routes I fly: services",
    intro:
      "Four kinds of websites for businesses whose customers don’t all speak the same language. No templates: each one is designed around your business.",
    mapLabel: "Route map: four services leaving from FJ",
    routesLabel: "Routes on this page",
    routeTag: "ROUTE",
    included: "ON BOARD",
    includedNote: "Included",
    goodFor: "Good for",
    example: "See it flying: {name}",
    services: [
      {
        code: codes[0],
        from: "ONE LANGUAGE",
        to: "THREE LANGUAGES",
        title: "Multilingual business websites",
        lead: "Your customers read in different languages. You get one site with a real version for each of them.",
        body: "Every language has its own pages, its own addresses and its own entry on Google, and the language switch remembers what the visitor chose. No machine-translated afterthought: the texts are written for each audience.",
        included: [
          "Up to three languages: EN, FR, DE",
          "Own address and Google entry per language",
          "Language switch on every page",
          "Forms and emails in each language",
        ],
        goodFor: ["Translators", "Agencies", "Suppliers", "Consultants"],
        example: "herzog",
      },
      {
        code: codes[1],
        from: "PHONE CALLS",
        to: "ONLINE ORDERS",
        title: "Ordering and request forms",
        lead: "Replace the back-and-forth on the phone with a form that asks the right questions.",
        body: "Customers upload their files from the phone, pick options, see the price and pay the way they already pay. You receive one tidy email with everything attached, and they get a confirmation.",
        included: [
          "File uploads that shrink phone photos",
          "Live price as the form is filled in",
          "Payment methods your customers use",
          "Confirmation emails on both sides",
        ],
        goodFor: ["Translators", "Print shops", "Repair services", "Caterers"],
        example: "herzog",
      },
      {
        code: codes[2],
        from: "AN IDEA",
        to: "A LAUNCH PAGE",
        title: "Landing pages",
        lead: "One page with one job: a product, an event or a campaign.",
        body: "A clear message, a page that loads fast on mobile data and one obvious next step, whether that’s a sign-up, a WhatsApp chat or a purchase.",
        included: [
          "Help structuring the message",
          "Fast on slow connections",
          "Sign-up, WhatsApp or buy button",
          "Privacy-friendly visit counts, if wanted",
        ],
        goodFor: ["Launches", "Events", "Campaigns", "New businesses"],
        example: null,
      },
      {
        code: codes[3],
        from: "OLD WORDPRESS",
        to: "FAST AND FOUND",
        title: "Rebuilds without losing Google",
        lead: "Your old WordPress or template site is slow or hard to change.",
        body: "I rebuild it with modern code, move your content over and point every old address to its new page, so the visitors and rankings you already have stay with you.",
        included: [
          "Content moved over",
          "Old addresses redirected",
          "Much faster pages",
          "Impressum and privacy page included",
        ],
        goodFor: ["Older sites", "Template sites", "Slow shops", "Sites you can’t edit"],
        example: null,
      },
    ],
    always: {
      title: ["ON EVERY", "FLIGHT"],
      titleText: "On every flight",
      intro: "Whatever the route, these come with it. Nothing here is an extra.",
      items: [
        { code: "MOB", title: "Works on every phone", text: "Designed for small screens first." },
        {
          code: "SPD",
          title: "Fast on slow data",
          text: "Light pages that load quickly anywhere.",
        },
        {
          code: "SEO",
          title: "Set up for Google",
          text: "Titles, descriptions and a sitemap per language.",
        },
        { code: "DOM", title: "Domain and email", text: "Connected and working on your own name." },
        { code: "LGL", title: "Legal pages", text: "Impressum and privacy page in place." },
        {
          code: "HND",
          title: "A clear handover",
          text: "A short guide to change things yourself.",
        },
        {
          code: "AFT",
          title: "Help after launch",
          text: "Questions and small fixes in the first weeks.",
        },
        { code: "OWN", title: "It’s yours", text: "Code, accounts and domain in your name." },
      ],
    },
    fares: {
      title: "FARES",
      label: "Fare",
      sign: "ON REQUEST",
      signText: "On request",
      lead: "Every project gets a fixed quote after a short call, before any work starts. No hourly surprises.",
      factorsTitle: "What sets the fare",
      factors: [
        ["PAGES", "How many pages and sections"],
        ["LANGUAGES", "One, two or three"],
        ["FORMS", "Orders, uploads, payments"],
        ["CONTENT", "Ready, or written together"],
      ],
    },
    faq: {
      title: ["QUESTIONS", "AT THE DESK"],
      titleText: "Questions at the desk",
      items: [
        [
          "How long does a website take?",
          "A landing page usually takes one to two weeks, a multilingual site three to six. Most of the time depends on how quickly texts and photos arrive.",
        ],
        [
          "Who writes the texts and translations?",
          "You know your business best, so the content starts with you. I shape it into web copy and adapt it between English, French and German. Certified or legal texts belong with a sworn translator.",
        ],
        [
          "Can I change things myself later?",
          "Yes. Small edits are easy to learn, and if you’ll update often I can add a simple editor for your texts and photos.",
        ],
        [
          "Do you work with clients outside Germany?",
          "Yes. I work remotely, with clients in Cameroon, Germany and elsewhere, on WhatsApp, by email or in video calls.",
        ],
        [
          "What about hosting?",
          "I recommend a setup that suits your site and set it up with you. The accounts and the domain are in your name, so you stay in control.",
        ],
      ],
    },
  },

  fr: {
    meta: {
      title: "Services : sites web multilingues · Frank Jordan",
      description:
        "Sites d’entreprise multilingues, formulaires de commande, pages de lancement et refontes qui gardent votre référencement Google. En français, anglais et allemand.",
    },
    breadcrumb: "Services",
    titleLed: ["MES", "ROUTES"],
    titleText: "Mes routes : services",
    intro:
      "Quatre types de sites pour les entreprises dont les clients ne parlent pas tous la même langue. Pas de modèle tout fait : chacun est pensé pour votre activité.",
    mapLabel: "Carte des routes : quatre services au départ de FJ",
    routesLabel: "Les routes de cette page",
    routeTag: "ROUTE",
    included: "À BORD",
    includedNote: "Inclus",
    goodFor: "Idéal pour",
    example: "En vol : {name}",
    services: [
      {
        code: codes[0],
        from: "UNE LANGUE",
        to: "TROIS LANGUES",
        title: "Sites d’entreprise multilingues",
        lead: "Vos clients lisent dans des langues différentes. Vous avez un seul site, avec une vraie version pour chacun d’eux.",
        body: "Chaque langue a ses propres pages, ses propres adresses et sa propre place sur Google, et le sélecteur de langue se souvient du choix du visiteur. Pas de traduction automatique ajoutée à la fin : les textes sont écrits pour chaque public.",
        included: [
          "Jusqu’à trois langues : FR, EN, DE",
          "Adresse et référencement Google par langue",
          "Sélecteur de langue sur chaque page",
          "Formulaires et e-mails dans chaque langue",
        ],
        goodFor: ["Traducteurs", "Agences", "Fournisseurs", "Consultants"],
        example: "herzog",
      },
      {
        code: codes[1],
        from: "DES APPELS",
        to: "DES COMMANDES EN LIGNE",
        title: "Formulaires de commande et de demande",
        lead: "Remplacez les allers-retours au téléphone par un formulaire qui pose les bonnes questions.",
        body: "Vos clients envoient leurs fichiers depuis leur téléphone, choisissent leurs options, voient le prix et paient comme ils en ont l’habitude. Vous recevez un e-mail clair avec tout en pièce jointe, et eux une confirmation.",
        included: [
          "Envoi de fichiers qui allège les photos",
          "Prix en direct pendant la saisie",
          "Les moyens de paiement de vos clients",
          "E-mails de confirmation des deux côtés",
        ],
        goodFor: ["Traducteurs", "Imprimeries", "Réparateurs", "Traiteurs"],
        example: "herzog",
      },
      {
        code: codes[2],
        from: "UNE IDÉE",
        to: "UNE PAGE DE LANCEMENT",
        title: "Pages de lancement",
        lead: "Une page, une mission : un produit, un événement ou une campagne.",
        body: "Un message clair, une page qui se charge vite même en données mobiles et une prochaine étape évidente : une inscription, une discussion WhatsApp ou un achat.",
        included: [
          "Aide pour structurer le message",
          "Rapide même avec une connexion lente",
          "Bouton d’inscription, WhatsApp ou d’achat",
          "Statistiques de visite respectueuses, si souhaité",
        ],
        goodFor: ["Lancements", "Événements", "Campagnes", "Nouvelles entreprises"],
        example: null,
      },
      {
        code: codes[3],
        from: "VIEUX WORDPRESS",
        to: "RAPIDE ET VISIBLE",
        title: "Refontes sans perdre Google",
        lead: "Votre ancien site WordPress ou fait avec un modèle est lent ou difficile à modifier.",
        body: "Je le reconstruis avec du code moderne, je reprends votre contenu et je redirige chaque ancienne adresse vers sa nouvelle page, pour garder les visiteurs et le référencement que vous avez déjà.",
        included: [
          "Contenu repris",
          "Anciennes adresses redirigées",
          "Pages beaucoup plus rapides",
          "Mentions légales et confidentialité incluses",
        ],
        goodFor: [
          "Sites anciens",
          "Sites faits avec un modèle",
          "Boutiques lentes",
          "Sites impossibles à modifier",
        ],
        example: null,
      },
    ],
    always: {
      title: ["À CHAQUE", "VOL"],
      titleText: "À chaque vol",
      intro: "Quelle que soit la route, tout ceci est compris. Rien n’est en option.",
      items: [
        {
          code: "MOB",
          title: "Sur tous les téléphones",
          text: "Pensé d’abord pour les petits écrans.",
        },
        {
          code: "SPD",
          title: "Rapide partout",
          text: "Des pages légères qui se chargent vite, même en 3G.",
        },
        {
          code: "SEO",
          title: "Prêt pour Google",
          text: "Titres, descriptions et plan du site dans chaque langue.",
        },
        { code: "DOM", title: "Domaine et e-mail", text: "Branchés et fonctionnels, à votre nom." },
        {
          code: "LGL",
          title: "Pages légales",
          text: "Mentions légales et confidentialité en place.",
        },
        {
          code: "HND",
          title: "Une passation claire",
          text: "Un petit guide pour faire vos changements vous-même.",
        },
        {
          code: "AFT",
          title: "Aide après le lancement",
          text: "Questions et petites corrections les premières semaines.",
        },
        { code: "OWN", title: "Tout est à vous", text: "Code, comptes et domaine à votre nom." },
      ],
    },
    fares: {
      title: "TARIFS",
      label: "Tarif",
      sign: "SUR DEMANDE",
      signText: "Sur demande",
      lead: "Chaque projet reçoit un devis fixe après un court échange, avant le début du travail. Pas de surprise à l’heure.",
      factorsTitle: "Ce qui fixe le tarif",
      factors: [
        ["PAGES", "Nombre de pages et de sections"],
        ["LANGUES", "Une, deux ou trois"],
        ["FORMULAIRES", "Commandes, envois, paiements"],
        ["CONTENU", "Prêt, ou écrit ensemble"],
      ],
    },
    faq: {
      title: ["QUESTIONS", "AU COMPTOIR"],
      titleText: "Questions au comptoir",
      items: [
        [
          "Combien de temps prend un site ?",
          "Une page de lancement prend en général une à deux semaines, un site multilingue trois à six. Le délai dépend surtout de la vitesse à laquelle arrivent les textes et les photos.",
        ],
        [
          "Qui écrit les textes et les traductions ?",
          "C’est vous qui connaissez le mieux votre activité, le contenu part donc de vous. Je le mets en forme pour le web et je l’adapte entre français, anglais et allemand. Les textes certifiés ou juridiques relèvent d’un traducteur assermenté.",
        ],
        [
          "Pourrai-je modifier le site moi-même ?",
          "Oui. Les petites modifications s’apprennent vite, et si vous changez souvent votre contenu, je peux ajouter un éditeur simple pour vos textes et vos photos.",
        ],
        [
          "Travaillez-vous avec des clients hors d’Allemagne ?",
          "Oui. Je travaille à distance, avec des clients au Cameroun, en Allemagne et ailleurs, sur WhatsApp, par e-mail ou en visio.",
        ],
        [
          "Et l’hébergement ?",
          "Je vous recommande une solution adaptée à votre site et je la configure avec vous. Les comptes et le domaine sont à votre nom, vous gardez le contrôle.",
        ],
      ],
    },
  },

  de: {
    meta: {
      title: "Leistungen: mehrsprachige Websites · Frank Jordan",
      description:
        "Mehrsprachige Firmenwebsites, Bestellformulare, Landingpages und Relaunches ohne Google-Verlust. Auf Deutsch, Englisch und Französisch.",
    },
    breadcrumb: "Leistungen",
    titleLed: ["MEINE", "ROUTEN"],
    titleText: "Meine Routen: Leistungen",
    intro:
      "Vier Arten von Websites für Unternehmen, deren Kunden nicht alle dieselbe Sprache sprechen. Keine Vorlagen: Jede wird um Ihr Unternehmen herum gestaltet.",
    mapLabel: "Streckenkarte: vier Leistungen mit Start bei FJ",
    routesLabel: "Routen auf dieser Seite",
    routeTag: "ROUTE",
    included: "AN BORD",
    includedNote: "Inklusive",
    goodFor: "Passt für",
    example: "Im Einsatz: {name}",
    services: [
      {
        code: codes[0],
        from: "EINE SPRACHE",
        to: "DREI SPRACHEN",
        title: "Mehrsprachige Firmenwebsites",
        lead: "Ihre Kunden lesen in verschiedenen Sprachen. Sie bekommen eine Website mit einer echten Version für jede davon.",
        body: "Jede Sprache hat eigene Seiten, eigene Adressen und einen eigenen Eintrag bei Google, und der Sprachwechsler merkt sich die Wahl der Besucher. Keine nachträgliche Maschinenübersetzung: Die Texte sind für jedes Publikum geschrieben.",
        included: [
          "Bis zu drei Sprachen: DE, EN, FR",
          "Eigene Adresse und Google-Eintrag pro Sprache",
          "Sprachwechsel auf jeder Seite",
          "Formulare und E-Mails in jeder Sprache",
        ],
        goodFor: ["Übersetzer", "Agenturen", "Lieferanten", "Berater"],
        example: "herzog",
      },
      {
        code: codes[1],
        from: "ANRUFE",
        to: "ONLINE-BESTELLUNGEN",
        title: "Bestell- und Anfrageformulare",
        lead: "Ersetzen Sie das Hin und Her am Telefon durch ein Formular, das die richtigen Fragen stellt.",
        body: "Kunden laden ihre Dateien vom Handy hoch, wählen Optionen, sehen den Preis und zahlen so, wie sie es gewohnt sind. Sie erhalten eine übersichtliche E-Mail mit allem im Anhang, Ihre Kunden eine Bestätigung.",
        included: [
          "Uploads, die Handyfotos verkleinern",
          "Live-Preis beim Ausfüllen",
          "Zahlungsarten, die Ihre Kunden nutzen",
          "Bestätigungs-E-Mails für beide Seiten",
        ],
        goodFor: ["Übersetzer", "Druckereien", "Reparaturdienste", "Caterer"],
        example: "herzog",
      },
      {
        code: codes[2],
        from: "EINE IDEE",
        to: "EINE LANDINGPAGE",
        title: "Landingpages",
        lead: "Eine Seite mit einer Aufgabe: ein Produkt, ein Event oder eine Kampagne.",
        body: "Eine klare Botschaft, eine Seite, die auch mit mobilen Daten schnell lädt, und ein eindeutiger nächster Schritt: eine Anmeldung, ein WhatsApp-Chat oder ein Kauf.",
        included: [
          "Hilfe beim Aufbau der Botschaft",
          "Schnell auch bei langsamer Verbindung",
          "Anmelde-, WhatsApp- oder Kauf-Button",
          "Datenschutzfreundliche Besucherzahlen, auf Wunsch",
        ],
        goodFor: ["Produktstarts", "Events", "Kampagnen", "Neue Unternehmen"],
        example: null,
      },
      {
        code: codes[3],
        from: "ALTES WORDPRESS",
        to: "SCHNELL UND GEFUNDEN",
        title: "Relaunch ohne Google-Verlust",
        lead: "Ihre alte WordPress- oder Baukasten-Website ist langsam oder schwer zu ändern.",
        body: "Ich baue sie mit modernem Code neu, übernehme Ihre Inhalte und leite jede alte Adresse auf ihre neue Seite um, damit Ihre Besucher und Rankings erhalten bleiben.",
        included: [
          "Inhalte übernommen",
          "Alte Adressen umgeleitet",
          "Deutlich schnellere Seiten",
          "Impressum und Datenschutz inklusive",
        ],
        goodFor: [
          "Ältere Websites",
          "Baukasten-Websites",
          "Langsame Shops",
          "Websites, die Sie nicht ändern können",
        ],
        example: null,
      },
    ],
    always: {
      title: ["AUF JEDEM", "FLUG"],
      titleText: "Auf jedem Flug",
      intro: "Egal welche Route, das ist immer dabei. Nichts davon kostet extra.",
      items: [
        { code: "MOB", title: "Auf jedem Handy", text: "Zuerst für kleine Bildschirme gestaltet." },
        {
          code: "SPD",
          title: "Schnell überall",
          text: "Leichte Seiten, die überall schnell laden.",
        },
        {
          code: "SEO",
          title: "Bereit für Google",
          text: "Titel, Beschreibungen und Sitemap pro Sprache.",
        },
        {
          code: "DOM",
          title: "Domain und E-Mail",
          text: "Eingerichtet und funktionsfähig, auf Ihren Namen.",
        },
        {
          code: "LGL",
          title: "Rechtliche Seiten",
          text: "Impressum und Datenschutzerklärung vorhanden.",
        },
        {
          code: "HND",
          title: "Klare Übergabe",
          text: "Eine kurze Anleitung, um selbst Änderungen zu machen.",
        },
        {
          code: "AFT",
          title: "Hilfe nach dem Start",
          text: "Fragen und kleine Korrekturen in den ersten Wochen.",
        },
        {
          code: "OWN",
          title: "Alles gehört Ihnen",
          text: "Code, Konten und Domain auf Ihren Namen.",
        },
      ],
    },
    fares: {
      title: "TARIFE",
      label: "Tarif",
      sign: "AUF ANFRAGE",
      signText: "Auf Anfrage",
      lead: "Jedes Projekt bekommt nach einem kurzen Gespräch ein Festpreisangebot, bevor die Arbeit beginnt. Keine Überraschungen nach Stunden.",
      factorsTitle: "Was den Preis bestimmt",
      factors: [
        ["SEITEN", "Wie viele Seiten und Bereiche"],
        ["SPRACHEN", "Eine, zwei oder drei"],
        ["FORMULARE", "Bestellungen, Uploads, Zahlungen"],
        ["INHALTE", "Fertig, oder gemeinsam geschrieben"],
      ],
    },
    faq: {
      title: ["FRAGEN", "AM SCHALTER"],
      titleText: "Fragen am Schalter",
      items: [
        [
          "Wie lange dauert eine Website?",
          "Eine Landingpage dauert meist ein bis zwei Wochen, eine mehrsprachige Website drei bis sechs. Die Dauer hängt vor allem davon ab, wie schnell Texte und Fotos kommen.",
        ],
        [
          "Wer schreibt die Texte und Übersetzungen?",
          "Sie kennen Ihr Unternehmen am besten, also beginnt der Inhalt bei Ihnen. Ich forme ihn zu Webtexten und übertrage ihn zwischen Deutsch, Englisch und Französisch. Beglaubigte oder juristische Texte gehören zu einem vereidigten Übersetzer.",
        ],
        [
          "Kann ich später selbst etwas ändern?",
          "Ja. Kleine Änderungen sind schnell gelernt, und wenn Sie oft aktualisieren, kann ich einen einfachen Editor für Texte und Fotos einbauen.",
        ],
        [
          "Arbeiten Sie mit Kunden außerhalb Deutschlands?",
          "Ja. Ich arbeite remote, mit Kunden in Kamerun, Deutschland und anderswo, per WhatsApp, E-Mail oder Videocall.",
        ],
        [
          "Und das Hosting?",
          "Ich empfehle eine passende Lösung für Ihre Website und richte sie mit Ihnen ein. Konten und Domain laufen auf Ihren Namen, Sie behalten die Kontrolle.",
        ],
      ],
    },
  },
};
