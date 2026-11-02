"use client";

/**
 * An inline script that runs once, while the browser parses the server HTML.
 * On the client it renders as text/plain, so React doesn't warn about rendering a <script>;
 * suppressHydrationWarning accepts the type mismatch.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
