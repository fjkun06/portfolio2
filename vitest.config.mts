import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Unit tests run in a simulated browser (jsdom) with React Testing Library.
 * Async Server Components (layouts, pages) can't run here; they are covered by the build
 * and, later, by end-to-end tests.
 */
export default defineConfig({
  plugins: [react()],
  // Lets tests import with the same "@/…" paths as the app (from tsconfig.json).
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
