import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import en from "@/locales/en";

import { BoardingPassForm } from "./BoardingPassForm";

const send = vi.hoisted(() => vi.fn());
vi.mock("@/lib/contact/send-boarding-pass", () => ({ sendBoardingPass: send }));

function setup() {
  render(
    <BoardingPassForm
      lang="en"
      text={en.form}
      privacyHref="/en/legal#privacy"
      email="hello@frankjordan.dev"
    />,
  );
  const submit = () =>
    userEvent.click(screen.getByRole("button", { name: en.form.send.toUpperCase() }));
  return { submit };
}

async function fillIn() {
  await userEvent.type(screen.getByLabelText(en.form.name.toUpperCase()), "Ada");
  await userEvent.type(screen.getByLabelText(en.form.email.toUpperCase()), "ada@example.com");
  await userEvent.type(
    screen.getByLabelText(en.form.message.toUpperCase()),
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
});
