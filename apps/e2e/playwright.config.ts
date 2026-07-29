import { defineConfig, devices } from "@playwright/test";

// These specs exist to produce a screenshot-per-screen + video-per-flow CI
// artifact for reviewing PR UI without running the servers locally — see
// ADR-0013. Chromium-only, desktop viewport: this is a PR-review aid, not
// cross-browser regression coverage.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:5173",
    video: "on",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "bin/rails server -p 3000",
      cwd: "../api",
      url: "http://localhost:3000/up",
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        RAILS_ENV: "test",
        POSTGRES_HOST: process.env.POSTGRES_HOST ?? "localhost",
      },
    },
    {
      command: "pnpm dev",
      cwd: "../web",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        VITE_API_URL: "http://localhost:3000",
      },
    },
  ],
});
