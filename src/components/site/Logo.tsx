import Link from "next/link";

import { Led } from "@/components/Led";

type LogoProps = {
  /** Where the logo links to: the home page in the current language. */
  href: string;
  /** Accessible name of the link, e.g. "Frank Jordan, home". The dots themselves are hidden from screen readers. */
  label: string;
  /** Dot size: 6 in the desktop header, smaller on phones and in the footer. */
  pitch?: number;
};

/**
 * The FJ logo: the two letters in LED dots, linking home.
 * No frame around it: the header is already the board it sits on.
 * `prefetch` loads the home page in advance so clicking it is instant.
 */
export function Logo({ href, label, pitch = 6 }: LogoProps) {
  return (
    <Link href={href} prefetch aria-label={label} className="inline-flex no-underline">
      <Led text="FJ" pitch={pitch} />
    </Link>
  );
}
