import type { MetadataRoute } from "next";

import { siteConfig } from "@/utils/site";

/**
 * /manifest.webmanifest: name, colours and icons when the site is added to a phone's home
 * screen (Android). iPhones use app/apple-icon.png instead.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} · Frontend developer`,
    short_name: siteConfig.name,
    start_url: "/",
    display: "browser",
    background_color: "#141517",
    theme_color: "#141517",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
