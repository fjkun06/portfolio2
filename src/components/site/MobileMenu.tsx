"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Led } from "@/components/Led";
import { Arrow } from "@/components/site/Arrow";
import type { Dictionary } from "@/locales/en";

/** One row of the menu: a three-letter LED code (WRK, SRV…), the page name and its address. */
export type Gate = { code: string; label: string; href: string };

type MobileMenuProps = {
  gates: Gate[];
  /** Address of the contact page, for the big button. */
  bookHref: string;
  /** Menu texts in the current language. */
  text: Dictionary["menu"];
  /**
   * The language switch, passed in ready-made so this component doesn't need to know
   * the current language itself.
   */
  language: React.ReactNode;
};

/** Three rows of LED dots (the last one shorter): the "open menu" icon. */
function BurgerIcon() {
  const dots: React.ReactNode[] = [];
  for (const y of [6, 12, 18]) {
    const count = y === 18 ? 3 : 5;
    for (let c = 0; c < count; c++)
      dots.push(<circle key={`${y}-${c}`} cx={3 + c * 4.5} cy={y} r={1.5} />);
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      style={{ fill: "var(--led-white)" }}
    >
      {dots}
    </svg>
  );
}

/** An X in the accent colour: the "close menu" icon. */
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M5 5l14 14M19 5L5 19"
        style={{ stroke: "var(--led)" }}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Menu for phones, tablets and small laptops (hidden from 1090 px up, where the desktop nav
 * shows).
 *
 * Behaviour:
 * - The button toggles a full-height "Gates" panel under the header. It's announced with
 *   `aria-expanded` and points at the panel with `aria-controls`.
 * - While open, the page behind can't scroll (body overflow is locked and restored after).
 * - Escape closes it and puts focus back on the button; choosing a link closes it too.
 * - The rows slide in one after another (`.menu-row` animation with a growing delay).
 */
export function MobileMenu({ gates, bookHref, text, language }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? text.close : text.open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-12 cursor-pointer items-center justify-center rounded-md border border-rule-board bg-board p-0"
      >
        {open ? <CloseIcon /> : <BurgerIcon />}
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="board fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 overflow-y-auto"
        >
          <nav aria-label={text.gates} className="mx-auto max-w-[640px] px-4 pt-3.5 pb-7">
            <p className="m-0 mb-2.5 text-[13px] text-muted-board">{text.gates}</p>
            <ul className="m-0 list-none border-b border-rule-board p-0">
              {gates.map((gate, i) => (
                <li key={gate.href} className="menu-row" style={{ animationDelay: `${i * 55}ms` }}>
                  <Link
                    href={gate.href}
                    prefetch
                    onClick={close}
                    className="row-board grid min-h-[68px] grid-cols-[58px_minmax(0,1fr)_24px] items-center gap-3.5 border-t border-rule-board px-1.5 no-underline"
                  >
                    <Led text={gate.code} pitch={3} tone="grey" glow={false} />
                    <span className="font-stencil text-[38px] leading-none font-black tracking-[0.03em] text-on-board uppercase">
                      {gate.label}
                    </span>
                    <span className="row-go inline-flex text-muted-board">
                      <Arrow />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5.5 flex items-center justify-between">
              <span className="text-[13px] text-muted-board">{text.language}</span>
              {language}
            </div>
            <Link
              href={bookHref}
              onClick={close}
              className="btn btn-accent mt-5.5 flex min-h-[58px] text-2xl"
            >
              {text.book.toUpperCase()}
            </Link>
            <p className="mt-4.5 text-sm text-muted-board">{text.reply}</p>
          </nav>
        </div>
      )}
    </>
  );
}
