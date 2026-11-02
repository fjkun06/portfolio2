import { lang } from "next/root-params";

import { NotFoundView } from "@/components/not-found/NotFoundView";
import { defaultLocale, hasLocale } from "@/i18n/config";

/**
 * Shown when a page calls notFound(), e.g. an unknown project in /work/…, inside the normal
 * layout. Addresses that match no route at all get app/global-not-found.tsx instead.
 * Search engines are told not to index either.
 *
 * 404 pages get no `params`, but the language is a root parameter (the root layout sits in
 * [lang]), so `next/root-params` reads it from the address: /fr/… → French. It needs no request
 * header, so the routes around it can still be built ahead of time.
 */
export default async function NotFound() {
  const current = await lang();
  return <NotFoundView lang={hasLocale(current) ? current : defaultLocale} />;
}
