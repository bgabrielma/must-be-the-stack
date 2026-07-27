/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      // Excludes colocated test files and colocated route-local hooks
      // (useHome.ts, etc.) from route generation — both live inside
      // src/routes/ but aren't route files themselves.
      routeFileIgnorePattern: "\\.test\\.tsx?$|/use[A-Z][^/]*\\.tsx?$",
    }),
    react(),
    tailwindcss(),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
  },
});
