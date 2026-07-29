import type { Page } from "@playwright/test";

// Fixture users seeded by `bin/rails curriculum:seed_e2e` (apps/api) — see
// ADR-0013. Their progress state (completed/in-progress) can't be reached via
// the UI yet since Exercise/grading (issue #6) isn't built.
export const FIXTURE_PASSWORD = "e2e-fixture-password";
export const IN_PROGRESS_FIXTURE_EMAIL = "e2e-in-progress@example.com";
export const COMPLETED_FIXTURE_EMAIL = "e2e-completed@example.com";
export const EXISTING_FIXTURE_EMAIL = "e2e-existing@example.com";

export const E2E_PASSWORD = "e2e-test-password-123";

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
}

export async function fillCredentials(page: Page, email: string, password: string): Promise<void> {
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
}

export async function submitForm(page: Page): Promise<void> {
  await page.locator('button[type="submit"]').click();
}

export async function signUpAndLogIn(page: Page, email: string, password = E2E_PASSWORD): Promise<void> {
  await page.goto("/signup");
  await fillCredentials(page, email, password);
  await submitForm(page);
  await page.waitForURL(/\/login/);

  await fillCredentials(page, email, password);
  await submitForm(page);
  await page.waitForURL(/\/home/);
}

export async function logIn(page: Page, email: string, password = FIXTURE_PASSWORD): Promise<void> {
  await page.goto("/login");
  await fillCredentials(page, email, password);
  await submitForm(page);
  await page.waitForURL(/\/home/);
}
