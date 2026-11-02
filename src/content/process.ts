import type { Locale } from "@/i18n/config";

/**
 * Everything written on the Process page, in three languages.
 * LED texts (title, stop names, stats) are drawn in dots: capitals and simple punctuation.
 */
export type Stop = {
  /** Stop name in LED dots and stencil, e.g. CHECK-IN. */
  name: string;
  /** Rough timing, e.g. WEEK 1. */
  when: string;
  lead: string;
  /** What the client does at this stop. */
  you: string;
  /** What Frank does. */
  me: string;
  /** What the client has at the end of it. */
  get: string;
};

export type ProcessContent = {
  meta: { title: string; description: string };
  breadcrumb: string;
  titleLed: [string, string];
  titleText: string;
  intro: string;
  stats: [string, string][];
  stopsLabel: string;
  cockpit: { plan: string; stop: string };
  stopTag: string;
  you: string;
  me: string;
  youGet: string;
  stops: Stop[];
  carry: { title: [string, string]; titleText: string; intro: string; items: [string, string][] };
  after: {
    title: [string, string];
    titleText: string;
    items: { code: string; title: string; text: string }[];
  };
};

export const processContent: Record<Locale, ProcessContent> = {
  en: {
    meta: {
      title: "Process · Frank Jordan",
      description:
        "How a website project with me runs, in four stops: check-in, boarding, in flight and landing. You always know where we are.",
    },
    breadcrumb: "Process",
    titleLed: ["YOUR", "FLIGHT PLAN"],
    titleText: "Your flight plan: how a project runs",
    intro:
      "Four stops from the first message to a live site. You always know where we are, what I’m doing and what I need from you.",
    stats: [
      ["Stops", "4"],
      ["Typical flight", "2-6 WKS"],
      ["Reply", "24H"],
    ],
    stopsLabel: "The four stops",
    cockpit: { plan: "Flight plan", stop: "Stop" },
    stopTag: "STOP",
    you: "YOU",
    me: "ME",
    youGet: "You get",
    stops: [
      {
        name: "CHECK-IN",
        when: "DAY 1",
        lead: "We talk about your business, your customers and the languages they speak.",
        you: "Tell me what you do, who buys from you and what the site should achieve. Share the old site or examples you like.",
        me: "Ask the questions that shape the site, suggest the pages you need and send you a fixed quote.",
        get: "A clear plan and a fixed price",
      },
      {
        name: "BOARDING",
        when: "WEEK 1",
        lead: "You see the design of the key pages before any code is written.",
        you: "React to the design: what feels right, what doesn’t. Send texts, photos and your logo.",
        me: "Design the homepage and the most important page in your colours, then adjust it with you.",
        get: "A design you’ve approved",
      },
      {
        name: "IN FLIGHT",
        when: "WEEKS 2-4",
        lead: "I build the site. You follow every step on a private preview link.",
        you: "Open the preview on your phone whenever you like and leave comments. Check the translations.",
        me: "Build every page in every language, the forms and the emails, and test them on real phones.",
        get: "A working site on a preview link",
      },
      {
        name: "LANDING",
        when: "LAUNCH",
        lead: "Your domain, email and Google go live, and I stay around.",
        you: "Give the final go. Tell your customers about the new site.",
        me: "Connect the domain, set up email, register the site with Google, hand over the accounts and a short guide.",
        get: "A live site in your name",
      },
    ],
    carry: {
      title: ["CARRY-ON", "CHECKLIST"],
      titleText: "Carry-on checklist",
      intro:
        "What helps me most before take-off. Tick what you already have; nothing here has to be perfect.",
      items: [
        ["Your logo", "Any format; I can tidy it up."],
        ["Texts about your business", "Rough notes are fine."],
        ["Photos", "Of your work, your team or your place."],
        ["Your languages", "Which ones, and who checks them."],
        ["Domain access", "If you already have one."],
      ],
    },
    after: {
      title: ["AFTER", "LANDING"],
      titleText: "After landing",
      items: [
        {
          code: "AFT",
          title: "First weeks",
          text: "Questions and small fixes after launch are part of the trip.",
        },
        {
          code: "UPD",
          title: "Later changes",
          text: "New pages, a new language or a new form, whenever you need them.",
        },
        {
          code: "OWN",
          title: "Your keys",
          text: "Domain, hosting and code stay in your name. You’re never locked in.",
        },
      ],
    },
  },

  fr: {
    meta: {
      title: "Méthode · Frank Jordan",
      description:
        "Comment se déroule un projet de site avec moi, en quatre escales : enregistrement, embarquement, en vol et atterrissage. Vous savez toujours où nous en sommes.",
    },
    breadcrumb: "Méthode",
    titleLed: ["VOTRE", "PLAN DE VOL"],
    titleText: "Votre plan de vol : comment se déroule un projet",
    intro:
      "Quatre escales du premier message au site en ligne. Vous savez toujours où nous en sommes, ce que je fais et ce dont j’ai besoin.",
    stats: [
      ["Escales", "4"],
      ["Vol habituel", "2-6 SEM."],
      ["Réponse", "24H"],
    ],
    stopsLabel: "Les quatre escales",
    cockpit: { plan: "Plan de vol", stop: "Escale" },
    stopTag: "ESCALE",
    you: "VOUS",
    me: "MOI",
    youGet: "Vous obtenez",
    stops: [
      {
        name: "ENREGISTREMENT",
        when: "JOUR 1",
        lead: "On parle de votre activité, de vos clients et des langues qu’ils parlent.",
        you: "Dites-moi ce que vous faites, qui achète chez vous et ce que le site doit accomplir. Montrez-moi l’ancien site ou des exemples qui vous plaisent.",
        me: "Je pose les questions qui façonnent le site, je propose les pages nécessaires et je vous envoie un devis fixe.",
        get: "Un plan clair et un prix fixe",
      },
      {
        name: "EMBARQUEMENT",
        when: "SEMAINE 1",
        lead: "Vous voyez la maquette des pages clés avant la moindre ligne de code.",
        you: "Réagissez à la maquette : ce qui vous plaît, ce qui ne vous plaît pas. Envoyez textes, photos et logo.",
        me: "Je dessine la page d’accueil et la page la plus importante dans vos couleurs, puis je les ajuste avec vous.",
        get: "Une maquette que vous avez validée",
      },
      {
        name: "EN VOL",
        when: "SEMAINES 2-4",
        lead: "Je développe le site. Vous suivez chaque étape sur un lien d’aperçu privé.",
        you: "Ouvrez l’aperçu sur votre téléphone quand vous voulez et laissez vos remarques. Vérifiez les traductions.",
        me: "Je construis chaque page dans chaque langue, les formulaires et les e-mails, et je les teste sur de vrais téléphones.",
        get: "Un site fonctionnel sur un lien d’aperçu",
      },
      {
        name: "ATTERRISSAGE",
        when: "LANCEMENT",
        lead: "Votre domaine, vos e-mails et Google sont en ligne, et je reste disponible.",
        you: "Donnez le feu vert final. Annoncez le nouveau site à vos clients.",
        me: "Je branche le domaine, configure les e-mails, inscris le site sur Google, et vous remets les comptes avec un petit guide.",
        get: "Un site en ligne à votre nom",
      },
    ],
    carry: {
      title: ["BAGAGE", "CABINE"],
      titleText: "Bagage cabine : la liste",
      intro:
        "Ce qui m’aide le plus avant le décollage. Cochez ce que vous avez déjà ; rien ne doit être parfait.",
      items: [
        ["Votre logo", "N’importe quel format ; je peux le nettoyer."],
        ["Des textes sur votre activité", "Des notes en vrac suffisent."],
        ["Des photos", "De votre travail, de votre équipe ou de vos locaux."],
        ["Vos langues", "Lesquelles, et qui les relit."],
        ["L’accès au domaine", "Si vous en avez déjà un."],
      ],
    },
    after: {
      title: ["APRÈS", "L’ATTERRISSAGE"],
      titleText: "Après l’atterrissage",
      items: [
        {
          code: "AFT",
          title: "Premières semaines",
          text: "Les questions et petites corrections après le lancement font partie du voyage.",
        },
        {
          code: "UPD",
          title: "Changements plus tard",
          text: "De nouvelles pages, une nouvelle langue ou un nouveau formulaire, quand vous en avez besoin.",
        },
        {
          code: "OWN",
          title: "Vos clés",
          text: "Domaine, hébergement et code restent à votre nom. Vous n’êtes jamais coincé.",
        },
      ],
    },
  },

  de: {
    meta: {
      title: "Ablauf · Frank Jordan",
      description:
        "So läuft ein Website-Projekt mit mir, in vier Stationen: Check-in, Boarding, im Flug und Landung. Sie wissen immer, wo wir stehen.",
    },
    breadcrumb: "Ablauf",
    titleLed: ["IHR", "FLUGPLAN"],
    titleText: "Ihr Flugplan: so läuft ein Projekt",
    intro:
      "Vier Stationen von der ersten Nachricht bis zur fertigen Website. Sie wissen immer, wo wir stehen, was ich mache und was ich von Ihnen brauche.",
    stats: [
      ["Stationen", "4"],
      ["Typischer Flug", "2-6 WO."],
      ["Antwort", "24H"],
    ],
    stopsLabel: "Die vier Stationen",
    cockpit: { plan: "Flugplan", stop: "Station" },
    stopTag: "STATION",
    you: "SIE",
    me: "ICH",
    youGet: "Sie bekommen",
    stops: [
      {
        name: "CHECK-IN",
        when: "TAG 1",
        lead: "Wir sprechen über Ihr Unternehmen, Ihre Kunden und die Sprachen, die sie sprechen.",
        you: "Erzählen Sie, was Sie machen, wer bei Ihnen kauft und was die Website erreichen soll. Zeigen Sie mir die alte Website oder Beispiele, die Ihnen gefallen.",
        me: "Ich stelle die Fragen, die die Website formen, schlage die nötigen Seiten vor und schicke Ihnen ein Festpreisangebot.",
        get: "Einen klaren Plan und einen Festpreis",
      },
      {
        name: "BOARDING",
        when: "WOCHE 1",
        lead: "Sie sehen das Design der wichtigsten Seiten, bevor eine Zeile Code geschrieben wird.",
        you: "Reagieren Sie auf das Design: was passt, was nicht. Schicken Sie Texte, Fotos und Ihr Logo.",
        me: "Ich gestalte die Startseite und die wichtigste Unterseite in Ihren Farben und passe sie mit Ihnen an.",
        get: "Ein Design, das Sie freigegeben haben",
      },
      {
        name: "IM FLUG",
        when: "WOCHE 2-4",
        lead: "Ich baue die Website. Sie verfolgen jeden Schritt über einen privaten Vorschau-Link.",
        you: "Öffnen Sie die Vorschau auf dem Handy, wann Sie wollen, und hinterlassen Sie Kommentare. Prüfen Sie die Übersetzungen.",
        me: "Ich baue jede Seite in jeder Sprache, die Formulare und die E-Mails, und teste alles auf echten Handys.",
        get: "Eine funktionierende Website auf einem Vorschau-Link",
      },
      {
        name: "LANDUNG",
        when: "START",
        lead: "Domain, E-Mail und Google gehen live, und ich bleibe für Sie da.",
        you: "Geben Sie das finale Go. Erzählen Sie Ihren Kunden von der neuen Website.",
        me: "Ich verbinde die Domain, richte die E-Mail ein, melde die Website bei Google an und übergebe die Konten mit einer kurzen Anleitung.",
        get: "Eine fertige Website auf Ihren Namen",
      },
    ],
    carry: {
      title: ["HANDGEPÄCK", "CHECKLISTE"],
      titleText: "Handgepäck-Checkliste",
      intro:
        "Was mir vor dem Start am meisten hilft. Haken Sie ab, was Sie schon haben; nichts davon muss perfekt sein.",
      items: [
        ["Ihr Logo", "Jedes Format; ich kann es aufbereiten."],
        ["Texte über Ihr Unternehmen", "Grobe Notizen reichen."],
        ["Fotos", "Von Ihrer Arbeit, Ihrem Team oder Ihren Räumen."],
        ["Ihre Sprachen", "Welche, und wer sie gegenliest."],
        ["Zugang zur Domain", "Falls Sie schon eine haben."],
      ],
    },
    after: {
      title: ["NACH DER", "LANDUNG"],
      titleText: "Nach der Landung",
      items: [
        {
          code: "AFT",
          title: "Erste Wochen",
          text: "Fragen und kleine Korrekturen nach dem Start gehören zur Reise.",
        },
        {
          code: "UPD",
          title: "Spätere Änderungen",
          text: "Neue Seiten, eine neue Sprache oder ein neues Formular, wann immer Sie sie brauchen.",
        },
        {
          code: "OWN",
          title: "Ihre Schlüssel",
          text: "Domain, Hosting und Code bleiben auf Ihren Namen. Sie sind nie gebunden.",
        },
      ],
    },
  },
};
