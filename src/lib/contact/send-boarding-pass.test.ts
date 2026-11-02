import { beforeEach, describe, expect, it, vi } from "vitest";

import { sendBoardingPass } from "./send-boarding-pass";

const sendEmail = vi.hoisted(() => vi.fn());
vi.mock("./mailer", () => ({ sendBoardingPassEmail: sendEmail }));

function form(overrides: Record<string, string> = {}): FormData {
  const data = new FormData();
  const fields = {
    name: "Ada",
    email: "ada@example.com",
    message: "A website in three languages, please.",
    consent: "on",
    startedAt: String(Date.now() - 60_000),
    lang: "en",
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

describe("sendBoardingPass (server action)", () => {
  beforeEach(() => {
    sendEmail.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("sends a valid boarding pass", async () => {
    sendEmail.mockResolvedValue(undefined);
    expect(await sendBoardingPass({ status: "idle" }, form())).toEqual({ status: "sent" });
    expect(sendEmail).toHaveBeenCalledOnce();
  });

  it("returns the invalid fields without sending", async () => {
    const state = await sendBoardingPass({ status: "idle" }, form({ email: "nope", consent: "" }));
    expect(state).toEqual({ status: "invalid", errors: ["email", "consent"] });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("pretends to accept bots but sends nothing", async () => {
    expect(await sendBoardingPass({ status: "idle" }, form({ company: "Spam" }))).toEqual({
      status: "sent",
    });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("reports an error when the mail server fails", async () => {
    sendEmail.mockRejectedValue(new Error("SMTP down"));
    expect(await sendBoardingPass({ status: "idle" }, form())).toEqual({ status: "error" });
  });
});
