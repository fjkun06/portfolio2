"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

/** Desktop navigation. The current section gets the accent underline. */
export function NavLinks({ items, label }: { items: Item[]; label: string }) {
  const pathname = usePathname() ?? "";
  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-center gap-x-[34px]">
      {items.map(({ href, label: text }) => {
        const current = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
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
