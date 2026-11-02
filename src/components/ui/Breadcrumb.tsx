import Link from "next/link";

type Crumb = { label: string; href?: string };

/**
 * "Home / Work" trail at the top of inner pages, on the dark board.
 * The last item is the current page (`aria-current="page"`, not a link).
 */
export function Breadcrumb({ items, label = "Breadcrumb" }: { items: Crumb[]; label?: string }) {
  return (
    <nav aria-label={label} className="text-[13px] text-muted-board lg:text-sm">
      <ol className="m-0 flex list-none flex-wrap p-0">
        {items.map((item, i) => (
          <li key={item.label} className="inline-flex">
            {i > 0 && (
              <span aria-hidden="true" className="mx-2 lg:mx-2.5">
                /
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className="text-on-board-2">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
