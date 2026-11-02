/**
 * The boarding pass email as HTML, in the website's look: a dark departures-board ticket with
 * ice-blue LED accents, the details as board rows, the message on a paper card, and a button
 * to answer the visitor.
 *
 * Email apps ignore most modern CSS (Gmail drops <style> blocks, web fonts and SVG), so it's
 * built from tables with inline styles only. The LED and stencil feel comes from monospace
 * capitals with wide letter spacing and the site's colours. Everything the visitor typed is
 * escaped, so it can never add HTML to the email.
 */
import en from "@/locales/en";

import type { BoardingPass } from "./boarding-pass";

/** The site's colours (globals.css, dark mode). */
const C = {
  page: "#ecede8",
  board: "#141517",
  onBoard: "#ecede8",
  onBoard2: "#c9cdd3",
  mutedBoard: "#9ca1a9",
  ruleBoard: "#2a2c30",
  led: "#bfe6ff",
  paper: "#f7f7f3",
  ink: "#141517",
  muted: "#52565d",
  label: "#5e636b",
  rule: "#c8cac3",
};

const MONO = "'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace";
const SANS = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
/** Heavy capitals, the nearest common fonts get to the site's stencil headings. */
const HEAVY = "'Arial Black','Helvetica Neue',Arial,sans-serif";

/** Makes text safe to put inside HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** A small LED-style label: monospace capitals, spaced out. */
const ledLabel = (text: string, color: string) =>
  `<span style="font-family:${MONO};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${color};">${escapeHtml(text)}</span>`;

/** One departures-board row: label on the left, value on the right (value is ready HTML). */
const row = (label: string, valueHtml: string) => `
  <tr>
    <td style="padding:12px 0;border-top:1px solid ${C.ruleBoard};width:150px;vertical-align:top;">${ledLabel(label, C.mutedBoard)}</td>
    <td style="padding:12px 0;border-top:1px solid ${C.ruleBoard};font-family:${MONO};font-size:15px;font-weight:bold;letter-spacing:1px;color:${C.onBoard};">${valueHtml}</td>
  </tr>`;

/** A code with its name, like the chips on the site: "ORD Order form". */
const chip = (code: string, name: string) =>
  `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 8px;border:1px solid ${C.ruleBoard};border-radius:4px;white-space:nowrap;"><span style="color:${C.led};">${escapeHtml(code)}</span> <span style="font-weight:normal;color:${C.onBoard2};">${escapeHtml(name)}</span></span>`;

const dash = `<span style="color:${C.mutedBoard};">-</span>`;

/** The full HTML email for a boarding pass. */
export function boardingPassHtml(pass: BoardingPass): string {
  const form = en.form;
  const name = escapeHtml(pass.name);
  // The button says "Reply to Ada": the full name is already on the ticket, and long names
  // would wrap the button on a phone.
  const firstName = escapeHtml(pass.name.split(/\s+/)[0] || pass.name);
  const email = escapeHtml(pass.email);
  // The usual address characters stay as they are: some mail apps (Outlook) take "%40" or
  // "%2B" literally and write to a wrong address. Anything unusual is still encoded, so it
  // can't break the link.
  const replyTo = pass.email.replace(/[^A-Za-z0-9@._+-]/g, (c) => encodeURIComponent(c));
  const reply = escapeHtml(
    `mailto:${replyTo}?subject=${encodeURIComponent(`Re: Boarding pass: ${pass.name}`)}`,
  );
  const languages = pass.languages.length
    ? pass.languages.map((l) => chip(l, form.languageNames[l])).join("")
    : dash;
  const routes = pass.routes.length
    ? pass.routes.map((r) => chip(r, form.routeNames[r])).join("")
    : dash;
  const message = escapeHtml(pass.message).replace(/\r?\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>Boarding pass: ${name}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;">New boarding pass from ${name}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:${C.board};border-radius:14px;">

      <!-- Ticket header: airline and pass type, like the site's board header -->
      <tr><td style="padding:22px 28px 18px;border-bottom:1px solid ${C.ruleBoard};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>${ledLabel(form.airline, C.led)}</td>
          <td align="right">${ledLabel("Boarding pass", C.mutedBoard)}</td>
        </tr></table>
      </td></tr>

      <!-- Passenger, in big capitals, over a dotted flight line -->
      <tr><td style="padding:26px 28px 6px;">
        ${ledLabel(form.name, C.mutedBoard)}
        <div style="margin-top:8px;font-family:${HEAVY};font-size:34px;line-height:1.05;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:${C.onBoard};">${name}</div>
      </td></tr>
      <tr><td style="padding:14px 28px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="border-top:3px dotted ${C.led};font-size:0;line-height:0;">&nbsp;</td>
          <td width="34" align="center" style="font-size:20px;line-height:1;color:${C.led};">&#9992;</td>
          <td style="border-top:3px dotted ${C.ruleBoard};font-size:0;line-height:0;">&nbsp;</td>
        </tr></table>
      </td></tr>

      <!-- The details, as departures-board rows -->
      <tr><td style="padding:16px 28px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row(form.email, `<a href="mailto:${email}" style="color:${C.led};text-decoration:none;">${email}</a>`)}
          ${row("From", pass.from ? escapeHtml(pass.from) : dash)}
          ${row("Languages", languages)}
          ${row("Route", routes)}
          ${row("Departure", pass.when ? escapeHtml(form.whenNames[pass.when]) : dash)}
          ${row("Page language", escapeHtml(pass.lang.toUpperCase()))}
        </table>
      </td></tr>

      <!-- Perforation: the tear-off line between ticket and message -->
      <tr><td style="padding:10px 0 0;">
        <div style="border-top:2px dashed ${C.ruleBoard};margin:0 14px;"></div>
      </td></tr>

      <!-- The message, on a paper card -->
      <tr><td style="padding:22px 28px 8px;">
        ${ledLabel("Message", C.mutedBoard)}
        <div style="margin-top:10px;padding:18px 20px;background:${C.paper};border-radius:8px;font-family:${SANS};font-size:16px;line-height:1.55;color:${C.ink};">${message}</div>
      </td></tr>

      <!-- Answer the visitor -->
      <tr><td style="padding:20px 28px 28px;">
        <a href="${reply}" style="display:inline-block;padding:14px 22px;background:${C.led};border-radius:4px;font-family:${HEAVY};font-size:15px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase;color:${C.ink};text-decoration:none;">Reply to ${firstName} &rarr;</a>
      </td></tr>
    </table>

    <p style="margin:18px 0 0;font-family:${SANS};font-size:12px;color:${C.label};">Sent from the boarding pass on frankjordan.dev. Replying answers ${name} directly.</p>
  </td></tr>
</table>
</body>
</html>`;
}
