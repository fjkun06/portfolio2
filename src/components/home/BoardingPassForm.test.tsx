import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DRAFT_KEY } from "@/lib/contact/draft";
import en from "@/locales/en";
import fr from "@/locales/fr";

import { BoardingPassForm } from "./BoardingPassForm";

const send = vi.hoisted(() => vi.fn());
vi.mock("@/lib/contact/send-boarding-pass", () => ({ sendBoardingPass: send }));

function setup(extended = false) {
  render(
    <BoardingPassForm
      lang="en"
      text={en.form}
      privacyHref="/en/legal#privacy"
      email="hello@frankjordan.dev"
      extended={extended}
    />,
  );
  const submit = () =>
    userEvent.click(screen.getByRole("button", { name: en.form.send.toUpperCase() }));
  return { submit };
}

async function fillIn(messageLabel = en.form.message) {
  await userEvent.type(screen.getByLabelText(en.form.name.toUpperCase()), "Ada");
  await userEvent.type(screen.getByLabelText(en.form.email.toUpperCase()), "ada@example.com");
  await userEvent.type(
    screen.getByLabelText(messageLabel.toUpperCase()),
    "A site in three languages.",
  );
  await userEvent.click(screen.getByRole("checkbox", { name: /I agree/ }));
}

describe("<BoardingPassForm>", () => {
  beforeEach(() => send.mockReset());

  it("starts with English and French ticked", () => {
    setup();
    expect(screen.getByRole("checkbox", { name: "English" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "French" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "German" })).not.toBeChecked();
  });

  it("links the consent line to the privacy policy", () => {
    setup();
    expect(screen.getByRole("link", { name: en.form.privacy })).toHaveAttribute(
      "href",
      "/en/legal#privacy",
    );
  });

  it("shows every problem, marks the fields and focuses the first one, without sending", async () => {
    const { submit } = setup();
    await submit();
    for (const key of ["name", "email", "message", "consent"] as const)
      expect(screen.getByText(en.form.errors[key])).toBeInTheDocument();
    const name = screen.getByLabelText(en.form.name.toUpperCase());
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription(en.form.errors.name);
    expect(name).toHaveFocus();
    expect(send).not.toHaveBeenCalled();
  });

  it("sends a complete form and shows CHECKED IN", async () => {
    send.mockResolvedValue({ status: "sent" });
    const { submit } = setup();
    await fillIn();
    await submit();
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(en.form.sent));
    const sent = send.mock.calls[0][1] as FormData;
    expect(sent.get("name")).toBe("Ada");
    expect(sent.getAll("languages")).toEqual(["EN", "FR"]);
    expect(Number(sent.get("startedAt"))).toBeGreaterThan(0);
    expect(sent.get("lang")).toBe("en");
  });

  it("keeps the short form on the home page: no route or departure questions", () => {
    setup();
    expect(screen.queryByRole("group", { name: en.form.routes.toUpperCase() })).toBeNull();
    expect(screen.queryByRole("radio")).toBeNull();
  });

  it("on the Contact page, also asks for the route and departure and sends them", async () => {
    send.mockResolvedValue({ status: "sent" });
    const { submit } = setup(true);
    expect(screen.getByRole("group", { name: en.form.routes.toUpperCase() })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    for (const radio of screen.getAllByRole("radio")) expect(radio).not.toBeChecked();

    await fillIn(en.form.messageMore);
    await userEvent.click(screen.getByRole("checkbox", { name: en.form.routeNames.MLT }));
    await userEvent.click(screen.getByRole("checkbox", { name: en.form.routeNames.RBD }));
    await userEvent.click(screen.getByRole("radio", { name: en.form.whenNames.SOON }));
    await userEvent.click(screen.getByRole("radio", { name: en.form.whenNames.ASAP }));
    await submit();

    await waitFor(() => expect(send).toHaveBeenCalled());
    const sent = send.mock.calls[0][1] as FormData;
    expect(sent.getAll("routes")).toEqual(["MLT", "RBD"]);
    expect(sent.get("when")).toBe("ASAP"); // radios: only the last choice counts
  });

  it("offers to send another, with an empty form", async () => {
    send.mockResolvedValue({ status: "sent" });
    const { submit } = setup();
    await fillIn();
    await submit();
    await userEvent.click(await screen.findByRole("button", { name: en.form.again }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByLabelText(en.form.name.toUpperCase())).toHaveValue("");
  });

  it("keeps the text and shows the email address when sending fails", async () => {
    send.mockResolvedValue({ status: "error" });
    const { submit } = setup();
    await fillIn();
    await submit();
    expect(await screen.findByRole("alert")).toHaveTextContent("hello@frankjordan.dev");
    expect(screen.getByLabelText(en.form.name.toUpperCase())).toHaveValue("Ada");
  });

  it("hides the spam trap from people", () => {
    const { container } = render(
      <BoardingPassForm lang="en" text={en.form} privacyHref="/p" email="x@y.zz" />,
    );
    const trap = container.querySelector('input[name="company"]')!;
    expect(trap).toHaveAttribute("tabindex", "-1");
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  describe("draft", () => {
    function renderForm(lang: "en" | "fr" = "en", extended = false) {
      return render(
        <BoardingPassForm
          lang={lang}
          text={lang === "en" ? en.form : fr.form}
          privacyHref={`/${lang}/legal#privacy`}
          email="hello@frankjordan.dev"
          extended={extended}
        />,
      );
    }

    it("keeps what was filled in through a refresh or a language switch", async () => {
      const first = renderForm("en");
      await fillIn();
      await userEvent.click(screen.getByRole("checkbox", { name: "German" }));
      first.unmount();

      renderForm("fr"); // the French page, or the same page after a refresh
      expect(screen.getByLabelText(fr.form.name.toUpperCase())).toHaveValue("Ada");
      expect(screen.getByLabelText(fr.form.email.toUpperCase())).toHaveValue("ada@example.com");
      expect(screen.getByLabelText(fr.form.message.toUpperCase())).toHaveValue(
        "A site in three languages.",
      );
      expect(screen.getByRole("checkbox", { name: fr.form.languageNames.DE })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: /J’accepte|accepte/ })).toBeChecked();
    });

    it("brings back when typing started, so a restored pass isn't taken for a bot", async () => {
      const first = renderForm();
      await fillIn();
      const started = Number(
        (document.querySelector('[name="startedAt"]') as HTMLInputElement).value,
      );
      expect(started).toBeGreaterThan(0);
      first.unmount();

      const { container } = renderForm();
      expect(container.querySelector('[name="startedAt"]')).toHaveValue(String(started));
    });

    it("forgets the draft once the pass is sent", async () => {
      send.mockResolvedValue({ status: "sent" });
      const { submit } = setup();
      await fillIn();
      expect(sessionStorage.getItem(DRAFT_KEY)).not.toBeNull();
      await submit();
      await waitFor(() => expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull());
    });
  });
});
