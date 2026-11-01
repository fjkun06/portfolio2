/**
 * English texts. The other languages copy this shape exactly (TypeScript checks it).
 * LED lines are drawn in dots: keep them to capitals, digits and simple punctuation.
 */
const en = {
  meta: {
    title: "Frank Jordan · Websites that speak your clients’ language",
    description:
      "Frontend developer in Germany. I design and build fast websites in English, French and German.",
  },
  nav: {
    skip: "Skip to content",
    main: "Main",
    home: "Frank Jordan, home",
    work: "Work",
    services: "Services",
    process: "Process",
    about: "About",
    contact: "Contact",
    book: "Book a project",
    language: "Language",
    mode: "Light mode",
    modeHint: "Dark or light mode",
  },
  menu: {
    open: "Open menu",
    close: "Close menu",
    gates: "Gates",
    language: "Language",
    book: "Book your project",
    reply: "I answer within one working day, from Germany.",
  },
  footer: {
    next: "Next departure: your project.",
    nextLed: ["NEXT DEPARTURE:", "YOUR PROJECT."],
    nextLedShort: ["NEXT", "DEPARTURE:", "YOUR PROJECT."],
    book: "Book your project",
    connections: "Connections",
    email: "Email",
    whatsapp: "WhatsApp",
    linkedin: "LinkedIn",
    github: "GitHub",
    legal: "Legal",
    imprint: "Impressum",
    privacy: "Privacy policy",
    backToTop: "Back to top",
  },
  preview: {
    note: "Foundation preview: header, footer, LED lettering and scroll animations. The real home page comes next.",
    headline: ["WEBSITES THAT", "SPEAK YOUR", "CLIENTS’ LANGUAGE."],
    headlineShort: ["WEBSITES", "THAT SPEAK", "YOUR", "CLIENTS’", "LANGUAGE."],
    headlineText: "Websites that speak your clients’ language.",
    sections: ["Reveal: rises in", "Reveal: slides in", "Reveal: wipes in"],
  },
};

export type Dictionary = typeof en;
export default en;
