/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true, routeFileIgnorePattern: "\\.test\\.tsx?$" }),
    react(),
    tailwindcss(),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
  },
});
