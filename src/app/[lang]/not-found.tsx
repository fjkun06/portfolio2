import { headers } from "next/headers";
import { Suspense } from "react";

import { NotFoundView } from "@/components/not-found/NotFoundView";
import { localeFromPath, PATH_HEADER } from "@/i18n/config";

/**
 * Shown when a page calls notFound(), e.g. an unknown project in /work/…, inside the normal
 * layout. Addresses that match no route at all get app/global-not-found.tsx instead.
 * Search engines are told not to index either.
 *
 * Next.js gives 404 pages no route parameters, so the language comes from the visited path,
 * which the proxy passes on in a request header (/fr/… → French).
 */
export default function NotFound() {
  return (
    <Suspense>
      <LocalizedNotFound />
    </Suspense>
  );
}

async function LocalizedNotFound() {
  const lang = localeFromPath((await headers()).get(PATH_HEADER));
  return <NotFoundView lang={lang} />;
}
