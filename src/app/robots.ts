import type { MetadataRoute } from "next";

import { siteConfig } from "@/utils/site";

/** /robots.txt: everything may be crawled; the sitemap lists every page. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
