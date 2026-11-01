/**
 * Site facts in one place. Change them here, never in components or texts.
 * An empty string hides the matching link instead of showing a dead one.
 */
export const siteConfig = {
  name: "Frank Jordan",
  url: "https://frankjordan.dev",
  email: "hello@frankjordan.dev",
  /** International format without +, spaces or leading zeros, e.g. "4917612345678". */
  whatsapp: "",
  linkedin: "https://www.linkedin.com/in/fjkun06/",
  github: "https://github.com/fjkun06",
} as const;

export function whatsappLink(number: string): string {
  return `https://wa.me/${number}`;
}
