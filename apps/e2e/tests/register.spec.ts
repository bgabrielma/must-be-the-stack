import { test, expect } from "@playwright/test";
import { uniqueEmail, fillCredentials, submitForm, E2E_PASSWORD } from "./helpers";

// Flow: Entry -> Onboarding -> Signup -> Login -> Home. Errors run before the
// happy path (ADR-0013): thin assertions only, screenshot per screen matching
// flows.html's numbering, real stack throughout. Form fields/buttons are
// located by input type / role, not by their copy, so wording changes don't
// break navigation — the copy itself is only ever the thing being asserted on.
test.describe("Register", () => {
  test("login error: invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await fillCredentials(page, uniqueEmail("e2e-no-such-user"), "wrong-password");
    await submitForm(page);

    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("signup error: duplicate email", async ({ page }) => {
    const email = uniqueEmail("e2e-duplicate-signup");

    // No fixture needed — the "existing" account is created by this test's
    // own first signup, then reused to provoke the real duplicate-email
    // rejection on the second attempt.
    await page.goto("/signup");
    await fillCredentials(page, email, E2E_PASSWORD);
    await submitForm(page);
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/signup");
    await fillCredentials(page, email, E2E_PASSWORD);
    await submitForm(page);

    await expect(page.getByText("Email has already been taken")).toBeVisible();
  });

  test("unauthenticated visitors are redirected to Login", async ({ page }) => {
    await page.goto("/home");

    await expect(page).toHaveURL(/\/login$/);
  });

  test("happy path: Entry -> Onboarding -> Signup -> Login -> Home", async ({ page }) => {
    const email = uniqueEmail("e2e-register-happy");

    await page.goto("/");
    await expect(page.getByText("Every step, earned.")).toBeVisible();
    await page.screenshot({ path: "screenshots/register/01-entry.png" });

    await page.getByTestId("entry-start-journey").click();
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByText("One concept at a time")).toBeVisible();
    await page.screenshot({ path: "screenshots/register/02-onboarding.png" });

    await page.getByTestId("onboarding-continue").click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByText("Create your account")).toBeVisible();
    await page.screenshot({ path: "screenshots/register/03-signup.png" });

    await fillCredentials(page, email, E2E_PASSWORD);
    await submitForm(page);

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("Account created")).toBeVisible();
    await page.screenshot({ path: "screenshots/register/04-login.png" });

    await fillCredentials(page, email, E2E_PASSWORD);
    await submitForm(page);

    await expect(page).toHaveURL(/\/home/);
  });
});
