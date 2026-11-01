"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Led } from "@/components/Led";
import { Arrow } from "@/components/site/Arrow";

type Gate = { code: string; label: string; href: string };

type Props = {
  gates: Gate[];
  bookHref: string;
  text: {
    open: string;
    close: string;
    gates: string;
    language: string;
    book: string;
    reply: string;
  };
  /** The language switch, rendered by the server and passed in. */
  language: React.ReactNode;
};

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

/** Burger button and the full-height "Gates" menu for phones and tablets. */
export function MobileMenu({ gates, bookHref, text, language }: Props) {
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
