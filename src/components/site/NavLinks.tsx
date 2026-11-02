"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

type NavLinksProps = {
  /** The links, already in the current language (from the dictionary and `routes()`). */
  items: Item[];
  /** Accessible name of the <nav>, e.g. "Main". */
  label: string;
};

/**
 * Desktop navigation (Work, Services, Process, About, Contact).
 *
 * It's a client component only because it needs the current address (`usePathname`) to mark
 * the active section: that link gets `aria-current="page"`, which screen readers announce and
 * which globals.css uses to show the accent underline. A link also counts as active on its
 * sub-pages, so "Work" stays underlined on a single project page.
 */
export function NavLinks({ items, label }: NavLinksProps) {
  const pathname = usePathname() ?? "";
  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-center gap-x-[34px]">
      {items.map(({ href, label: text }) => {
        const current = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            prefetch
            aria-current={current ? "page" : undefined}
            className="nav-item font-stencil text-[19px] font-extrabold tracking-[0.08em] text-on-board uppercase"
          >
            {text}
          </Link>
        );
      })}
    </nav>
  );
}
