/**
 * Sends a boarding pass to Frank by email, through the IONOS mail server (SMTP).
 * Only ever imported by the server action, so the password never reaches the browser.
 *
 * Settings come from environment variables (see .env.example). On Vercel, add them under
 * Project → Settings → Environment Variables.
 */
import nodemailer from "nodemailer";

import type { BoardingPass } from "./boarding-pass";

/** The SMTP settings, or null when any is missing (the form then shows an error). */
export function mailSettings(env: Record<string, string | undefined> = process.env) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO } = env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !MAIL_FROM || !MAIL_TO) return null;
  const port = Number(SMTP_PORT ?? 465);
  return {
    transport: {
      host: SMTP_HOST,
      port,
      secure: port === 465, // 465 = TLS from the start; 587 = STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    },
    from: MAIL_FROM,
    to: MAIL_TO,
  };
}

/** The email's subject and plain-text body. Replying to the email answers the visitor. */
export function composeEmail(pass: BoardingPass) {
  const lines = [
    `Passenger: ${pass.name}`,
    `Email: ${pass.email}`,
    `From: ${pass.from || "-"}`,
    `Languages: ${pass.languages.join(", ") || "-"}`,
    `Page language: ${pass.lang.toUpperCase()}`,
    "",
    pass.message,
  ];
  return { subject: `Boarding pass: ${pass.name}`, text: lines.join("\n") };
}

/** Sends the email. Throws when the settings are missing or the server refuses. */
export async function sendBoardingPassEmail(pass: BoardingPass): Promise<void> {
  const settings = mailSettings();
  if (!settings) throw new Error("Mail settings missing: see .env.example");
  const { subject, text } = composeEmail(pass);
  await nodemailer.createTransport(settings.transport).sendMail({
    from: settings.from,
    to: settings.to,
    replyTo: { name: pass.name, address: pass.email },
    subject,
    text,
  });
}
