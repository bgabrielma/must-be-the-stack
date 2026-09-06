import type { Page } from "@playwright/test";

export const E2E_PASSWORD = "e2e-test-password-123";

export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
}

export async function fillCredentials(page: Page, email: string, password: string): Promise<void> {
  await page.locator("#signup-email, #login-email").fill(email);
  await page.locator("#signup-password, #login-password").fill(password);

  const confirmPassword = page.locator("#signup-confirm-password");
  if ((await confirmPassword.count()) > 0) {
    await confirmPassword.fill(password);
  }
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
