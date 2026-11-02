"use client";

import Link from "next/link";
import { useActionState, useRef, useState, useTransition } from "react";

import { Led } from "@/components/Led";
import { CheckLed } from "@/components/ui/icons";
import {
  readBoardingPass,
  SITE_LANGUAGES,
  validateBoardingPass,
  type FieldError,
  type SendState,
} from "@/lib/contact/boarding-pass";
import { sendBoardingPass } from "@/lib/contact/send-boarding-pass";
import { fill } from "@/i18n/fill";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/locales/en";

type BoardingPassFormProps = {
  lang: Locale;
  text: Dictionary["form"];
  /** Address of the privacy policy, linked from the consent line. */
  privacyHref: string;
  /** Shown in the error message so visitors can write directly if sending fails. */
  email: string;
};

const label = "font-stencil text-sm font-extrabold tracking-[0.1em] text-label lg:text-[15px]";

/** A field's error message, linked to its input with aria-describedby. */
function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="m-0 mt-1.5 text-sm text-danger">
      {children}
    </p>
  );
}

/**
 * The boarding pass: the contact form, styled as a plane ticket.
 *
 * - Left part: name, email, business, languages (chips with an LED tick), message, consent.
 * - Right part (the stub, after the dashed tear line): gate, seat, reply time, time zone,
 *   a barcode and the send button. On phones the stub sits under the form.
 *
 * Sending:
 * 1. On submit, the fields are checked in the browser first. Wrong fields get a red line and a
 *    message under them, and the first one gets focus. Nothing is lost.
 * 2. If all is fine, the server action checks again and emails it. Meanwhile the button says
 *    "Sending…".
 * 3. Success: "CHECKED IN" covers the ticket, with a button to send another.
 *    Failure: a message with the email address to write to directly; the text stays in the form.
 *
 * Spam protection without a captcha: a hidden "company" field only bots fill in, and the time
 * since the first keystroke (people take more than 3 seconds).
 */
export function BoardingPassForm({ lang, text, privacyHref, email }: BoardingPassFormProps) {
  const [state, send] = useActionState(sendBoardingPass, { status: "idle" } as SendState);
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [startedAt, setStartedAt] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const serverErrors = state.status === "invalid" ? state.errors : [];
  const shown = errors.length ? errors : serverErrors;
  const has = (field: FieldError) => shown.includes(field);
  const sent = state.status === "sent" && !dismissed;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const problems = validateBoardingPass(readBoardingPass(data));
    setErrors(problems);
    if (problems.length) {
      form.querySelector<HTMLElement>(`[name="${problems[0]}"]`)?.focus();
      return;
    }
    setDismissed(false);
    startTransition(() => send(data));
  }

  function again() {
    formRef.current?.reset();
    setErrors([]);
    setStartedAt(0);
    setDismissed(true);
  }

  const field = (name: "name" | "email", type: string, autoComplete: string) => (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={`bp-${name}`} className={label}>
        {text[name].toUpperCase()}
      </label>
      <input
        id={`bp-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={text[`${name}Placeholder`]}
        aria-invalid={has(name)}
        aria-describedby={has(name) ? `bp-${name}-error` : undefined}
        className="ticket-input"
      />
      {has(name) && <ErrorText id={`bp-${name}-error`}>{text.errors[name]}</ErrorText>}
    </div>
  );

  const [before, after] = text.consent.split("{privacy}");

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onInput={() => startedAt === 0 && setStartedAt(Date.now())}
      className="rv-scale relative flex flex-col rounded-[14px] bg-paper text-ink shadow-[0_1px_0_var(--rule),0_40px_70px_-50px_rgba(0,0,0,0.45)] lg:flex-row lg:flex-wrap"
    >
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* Honeypot: invisible to people and screen readers; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex min-w-0 flex-col gap-6 px-5 pt-6 pb-6.5 lg:flex-[999_1_600px] lg:gap-7.5 lg:px-11 lg:pt-10 lg:pb-11">
        <div className="flex items-center justify-between gap-3 border-b-[1.5px] border-ink pb-3.5 lg:pb-5">
          <span className="font-stencil text-[22px] font-black tracking-[0.04em] lg:text-[28px]">
            {text.airline}
          </span>
          {/* data-mode="dark": this little panel stays dark in light mode too */}
          <span data-mode="dark" className="inline-flex rounded bg-ink px-2 py-1.5">
            <Led text="CM ⇄ DE" pitch={2.6} />
          </span>
        </div>

        <div className="flex flex-wrap gap-6 lg:gap-7.5">
          <div className="min-w-0 flex-[1_1_240px]">{field("name", "text", "name")}</div>
          <div className="min-w-0 flex-[1_1_240px]">{field("email", "email", "email")}</div>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <label htmlFor="bp-from" className={label}>
            {text.from.toUpperCase()}
          </label>
          <input
            id="bp-from"
            name="from"
            type="text"
            autoComplete="organization"
            placeholder={text.fromPlaceholder}
            className="ticket-input"
          />
        </div>

        <fieldset className="m-0 border-0 p-0">
          <legend className={`mb-2.5 p-0 ${label}`}>{text.languages.toUpperCase()}</legend>
          <div className="flex flex-wrap gap-2 lg:gap-2.5">
            {SITE_LANGUAGES.map((code) => (
              <label key={code} className="relative inline-flex">
                <input
                  type="checkbox"
                  name="languages"
                  value={code}
                  defaultChecked={code !== "DE"}
                  className="cb-input"
                  aria-label={text.languageNames[code]}
                />
                <span className="chip">
                  <CheckLed />
                  {code}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-1">
          <label htmlFor="bp-message" className={label}>
            {text.message.toUpperCase()}
          </label>
          <textarea
            id="bp-message"
            name="message"
            rows={3}
            placeholder={text.messagePlaceholder}
            aria-invalid={has("message")}
            aria-describedby={has("message") ? "bp-message-error" : undefined}
            className="ticket-textarea"
          />
          {has("message") && <ErrorText id="bp-message-error">{text.errors.message}</ErrorText>}
        </div>

        <div>
          <label className="cb relative flex cursor-pointer items-start gap-3.5 text-[15px] text-label lg:items-center lg:text-base">
            <input
              type="checkbox"
              name="consent"
              className="cb-input"
              aria-invalid={has("consent")}
              aria-describedby={has("consent") ? "bp-consent-error" : undefined}
            />
            <span className="cb-box">
              <CheckLed size={14} />
            </span>
            <span>
              {before}
              <Link href={privacyHref}>{text.privacy}</Link>
              {after}
            </span>
          </label>
          {has("consent") && <ErrorText id="bp-consent-error">{text.errors.consent}</ErrorText>}
        </div>
      </div>

      <div className="relative flex flex-col justify-between gap-4.5 border-t-2 border-dashed border-[#b5b7b0] px-5 py-6 lg:flex-[1_1_300px] lg:gap-6 lg:border-t-0 lg:border-l-2 lg:px-9 lg:pt-10 lg:pb-11">
        {/* Punched notches where the stub tears off */}
        <span
          aria-hidden="true"
          className="absolute -top-[15px] -left-[15px] size-7 rounded-full bg-page"
        />
        <span
          aria-hidden="true"
          className="absolute -top-[15px] -right-[15px] size-7 rounded-full bg-page lg:top-auto lg:right-auto lg:-bottom-[15px] lg:-left-[15px]"
        />
        <dl className="m-0 grid grid-cols-4 gap-2.5 lg:grid-cols-2 lg:gap-5">
          {(
            [
              [text.stub.gate, "FJ"],
              [text.stub.seat, "1A"],
              [text.stub.reply, "24H"],
              [text.stub.zone, "CET"],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-label lg:text-[13px]">{k}</dt>
              <dd className="m-0 mt-0.5 font-stencil text-[30px] leading-none font-black lg:text-[40px]">
                {v}
              </dd>
            </div>
          ))}
        </dl>
        <div
          aria-hidden="true"
          className="h-[54px] w-full lg:h-[70px]"
          style={{
            background:
              "repeating-linear-gradient(90deg, var(--ink) 0 2px, transparent 2px 5px, var(--ink) 5px 6px, transparent 6px 9px, var(--ink) 9px 12px, transparent 12px 14px)",
          }}
        />
        {state.status === "error" && !pending && (
          <p role="alert" className="m-0 text-sm text-danger">
            {fill(text.errors.server, { email })}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="btn btn-ink min-h-[60px] cursor-pointer border-0 px-3 text-[22px] whitespace-nowrap disabled:cursor-wait"
        >
          {(pending ? text.sending : text.send).toUpperCase()}
        </button>
      </div>

      {sent && (
        <div
          role="status"
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-[14px] bg-[rgba(247,247,243,0.95)] p-6 text-center"
        >
          <span data-mode="dark" className="inline-flex rounded-lg bg-ink px-4 py-3.5">
            <Led text="CHECKED IN" pitch={6} animate step={12} label="Checked in" />
          </span>
          <p className="m-0 max-w-[420px] text-lg lg:text-xl">{text.sent}</p>
          <button
            type="button"
            onClick={again}
            className="btn btn-outline min-h-[46px] cursor-pointer bg-transparent px-5 font-sans text-base font-semibold tracking-normal"
          >
            {text.again}
          </button>
        </div>
      )}
    </form>
  );
}
