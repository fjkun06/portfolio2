/**
 * The boarding pass (contact form): its fields, how they're read from the form and how they're
 * checked. Shared by the browser (instant feedback) and the server (the real check), so both
 * always apply the same rules.
 */
import { hasLocale, type Locale } from "@/i18n/config";

/** Languages a visitor can tick. */
export const SITE_LANGUAGES = ["EN", "FR", "DE"] as const;
export type SiteLanguage = (typeof SITE_LANGUAGES)[number];

/** Services a visitor can tick on the Contact page (the codes from the Services page; TBD = not sure). */
export const ROUTE_CODES = ["MLT", "ORD", "LND", "RBD", "TBD"] as const;
export type RouteCode = (typeof ROUTE_CODES)[number];

/** When the visitor wants to start (Contact page): as soon as possible, in 1–2 months, later. */
export const WHEN_CODES = ["ASAP", "SOON", "LATER"] as const;
export type WhenCode = (typeof WHEN_CODES)[number];

export type BoardingPass = {
  name: string;
  email: string;
  /** Business and where it is (optional). */
  from: string;
  languages: SiteLanguage[];
  /** What they need (Contact page only; empty from the home page). */
  routes: RouteCode[];
  /** When they want to start (Contact page only; "" when not given). */
  when: WhenCode | "";
  message: string;
  consent: boolean;
  /** Hidden field people never see; bots fill it in. Must stay empty. */
  company: string;
  /** When the visitor started filling in the form (ms since 1970); 0 if never focused. */
  startedAt: number;
  /** Language of the page the form was sent from. */
  lang: Locale;
};

/** Fields that can be wrong; each has a translated message in `form.errors`. */
export type FieldError = "name" | "email" | "message" | "consent";

/** Sending faster than this after the first keystroke is treated as a bot. */
export const MIN_FILL_MS = 3000;

const LIMITS = { name: 120, email: 200, from: 200, message: 5000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(form: FormData, key: string, max: number): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Reads the form's fields into a BoardingPass, trimming and cutting overly long values. */
export function readBoardingPass(form: FormData): BoardingPass {
  const lang = text(form, "lang", 2);
  const when = text(form, "when", 10);
  return {
    name: text(form, "name", LIMITS.name),
    email: text(form, "email", LIMITS.email),
    from: text(form, "from", LIMITS.from),
    languages: form
      .getAll("languages")
      .filter((v): v is SiteLanguage => SITE_LANGUAGES.includes(v as SiteLanguage)),
    routes: form
      .getAll("routes")
      .filter((v): v is RouteCode => ROUTE_CODES.includes(v as RouteCode)),
    when: WHEN_CODES.includes(when as WhenCode) ? (when as WhenCode) : "",
    message: text(form, "message", LIMITS.message),
    consent: form.get("consent") === "on",
    company: text(form, "company", 200),
    startedAt: Number(form.get("startedAt")) || 0,
    lang: hasLocale(lang) ? lang : "en",
  };
}

/**
 * Checks a boarding pass and lists what's wrong, in the order of the form.
 * An empty list means it can be sent.
 */
export function validateBoardingPass(pass: BoardingPass): FieldError[] {
  const errors: FieldError[] = [];
  if (!pass.name) errors.push("name");
  if (!EMAIL.test(pass.email)) errors.push("email");
  if (pass.message.length < 10) errors.push("message");
  if (!pass.consent) errors.push("consent");
  return errors;
}

/** True for submissions that look automated: honeypot filled, or sent too fast. */
export function looksLikeBot(pass: BoardingPass, now = Date.now()): boolean {
  return pass.company !== "" || pass.startedAt === 0 || now - pass.startedAt < MIN_FILL_MS;
}

/** What the server tells the form after a send attempt. */
export type SendState =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldError[] }
  | { status: "sent" }
  | { status: "error" };
