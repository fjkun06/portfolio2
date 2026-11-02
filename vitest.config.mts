import { tmpdir } from "node:os";
import { join } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Test caches live in the system temp folder, not in node_modules: `next dev` (Turbopack)
 * watches the whole project, and a test run writing hundreds of cache files there made it
 * wait for "the filesystem to settle" and miss real edits (CSS changes not showing up).
 */
const cache = join(tmpdir(), "portfolio2-test-cache");

/**
 * Unit tests run in a simulated browser (jsdom) with React Testing Library.
 * Async Server Components (layouts, pages) can't run here; they are covered by the build
 * and, later, by end-to-end tests.
 */
export default defineConfig({
  plugins: [react()],
  cacheDir: join(cache, "vite"),
  // Lets tests import with the same "@/…" paths as the app (from tsconfig.json).
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
    fsModuleCachePath: join(cache, "vitest"),
  },
});
