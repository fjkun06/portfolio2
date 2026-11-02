"use server";

/**
 * Server action behind the boarding pass form. Runs on the server only.
 *
 * 1. Reads and checks the fields again (never trust the browser's check alone).
 * 2. Quietly "accepts" submissions that look automated, without sending anything,
 *    so bots get no hint to try again.
 * 3. Emails the boarding pass to Frank. Any failure becomes { status: "error" },
 *    and the form tells the visitor to write directly instead.
 */
import {
  looksLikeBot,
  readBoardingPass,
  validateBoardingPass,
  type SendState,
} from "./boarding-pass";
import { sendBoardingPassEmail } from "./mailer";

export async function sendBoardingPass(_previous: SendState, form: FormData): Promise<SendState> {
  const pass = readBoardingPass(form);
  const errors = validateBoardingPass(pass);
  if (errors.length) return { status: "invalid", errors };
  if (looksLikeBot(pass)) return { status: "sent" };

  try {
    await sendBoardingPassEmail(pass);
    return { status: "sent" };
  } catch (error) {
    console.error("[boarding pass] sending failed", error);
    return { status: "error" };
  }
}
