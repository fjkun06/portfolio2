import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  allowedDevOrigins: ["192.168.178.89"],
  // app/global-not-found.tsx: the 404 page for addresses that match no route
  experimental: { globalNotFound: true },
  partialPrefetching: true,
  // 75 is Next.js' default; 90 is for project screenshots (SHOT_QUALITY), where text must stay sharp.
  images: { qualities: [75, 90] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
