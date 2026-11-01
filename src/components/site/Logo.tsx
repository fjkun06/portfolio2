import Link from "next/link";

import { Led } from "@/components/Led";

/** The FJ in LED dots. The header is already the board, so there is no frame. */
export function Logo({ href, label, pitch = 6 }: { href: string; label: string; pitch?: number }) {
  return (
    <Link href={href} aria-label={label} className="inline-flex no-underline">
      <Led text="FJ" pitch={pitch} />
    </Link>
  );
}
