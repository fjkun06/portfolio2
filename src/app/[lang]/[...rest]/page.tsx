import { notFound } from "next/navigation";

/**
 * Catch-all for addresses no other page matches (/en/nowhere, /fr/work/x/y…).
 * It only calls notFound(), so they get the site's own 404 page, inside the normal header
 * and footer, in the right language.
 */
export default function CatchAll() {
  notFound();
}
