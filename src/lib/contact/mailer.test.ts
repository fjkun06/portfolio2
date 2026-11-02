import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BoardingPass } from "./boarding-pass";
import { composeEmail, mailSettings, sendBoardingPassEmail } from "./mailer";

const sendMail = vi.hoisted(() => vi.fn());
vi.mock("nodemailer", () => ({ default: { createTransport: () => ({ sendMail }) } }));

const env = {
  SMTP_HOST: "smtp.ionos.de",
  SMTP_PORT: "465",
  SMTP_USER: "no-reply@frankjordan.dev",
  SMTP_PASS: "secret",
  MAIL_FROM: "Site <no-reply@frankjordan.dev>",
  MAIL_TO: "frank@frankjordan.dev",
};

const pass: BoardingPass = {
  name: "Ada",
  email: "ada@example.com",
  from: "",
  languages: ["FR"],
  routes: ["ORD", "LND"],
  when: "",
  message: "A site, please.",
  consent: true,
  company: "",
  startedAt: 1,
  lang: "fr",
};

describe("mailSettings", () => {
  it("returns null when anything is missing", () => {
    expect(mailSettings({ ...env, SMTP_PASS: "" })).toBeNull();
    expect(mailSettings({})).toBeNull();
  });

  it("uses TLS on port 465 and STARTTLS on 587", () => {
    expect(mailSettings(env)!.transport.secure).toBe(true);
    expect(mailSettings({ ...env, SMTP_PORT: "587" })!.transport.secure).toBe(false);
  });
});

describe("composeEmail", () => {
  it("puts the name in the subject and every field in the body", () => {
    const { subject, text } = composeEmail(pass);
    expect(subject).toBe("Boarding pass: Ada");
    expect(text).toContain("Email: ada@example.com");
    expect(text).toContain("From: -"); // empty fields show a dash
    expect(text).toContain("Languages: FR");
    expect(text).toContain("Route: ORD, LND");
    expect(text).toContain("When: -");
    expect(text).toContain("Page language: FR");
    expect(text.endsWith("A site, please.")).toBe(true);
  });
});

describe("sendBoardingPassEmail", () => {
  beforeEach(() => {
    sendMail.mockReset();
    vi.unstubAllEnvs();
  });

  it("refuses to send without settings", async () => {
    for (const key of Object.keys(env)) vi.stubEnv(key, "");
    await expect(sendBoardingPassEmail(pass)).rejects.toThrow(/settings/);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("sends to the owner with the visitor as reply-to", async () => {
    for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
    await sendBoardingPassEmail(pass);
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: env.MAIL_FROM,
        to: env.MAIL_TO,
        replyTo: { name: "Ada", address: "ada@example.com" },
        subject: "Boarding pass: Ada",
      }),
    );
  });
});
