/**
 * Site facts in one place. Change them here, never in components or texts.
 * An empty string hides the matching link instead of showing a dead one.
 */
export const siteConfig = {
  name: "Frank Jordan",
  url: "https://frankjordan.dev",
  email: "hello@frankjordan.dev",
  /** International format without +, spaces or leading zeros, e.g. "4917612345678". */
  whatsapp: "491771560344",
  linkedin: "https://www.linkedin.com/in/fjkun06/",
  github: "https://github.com/fjkun06",
  /**
   * Legal details for the Impressum and the privacy policy (required in Germany, § 5 DDG).
   * Empty fields show as red placeholders on the legal page until they're filled in.
   */
  owner: {
    /** Full legal name, as in your ID. */
    name: "Frank Jordan Zone Nguemfouo",
    /** Street and house number. */
    street: "Kronprinzenstraße 13",
    /** Postcode and city, e.g. "45127 Essen". */
    city: "45128 Essen",
  },
} as const;

/**
 * Click-to-chat link for WhatsApp.
 *
 * @example
 * whatsappLink("4917612345678") // "https://wa.me/4917612345678"
 */
export function whatsappLink(number: string): string {
  return `https://wa.me/${number}`;
}
