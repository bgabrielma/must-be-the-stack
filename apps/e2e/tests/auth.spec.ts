import { test, expect } from "@playwright/test";
import { uniqueEmail, fillCredentials, submitForm, E2E_PASSWORD, EXISTING_FIXTURE_EMAIL } from "./helpers";

// Flow: Entry -> Onboarding -> Signup -> Login -> Home. Errors run before the
// happy path (ADR-0013): thin assertions only, screenshot per screen matching
// flows.html's numbering, real stack throughout. Form fields/buttons are
// located by input type / role, not by their copy, so wording changes don't
// break navigation — the copy itself is only ever the thing being asserted on.
test.describe("Auth flow", () => {
  test("login error: invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await fillCredentials(page, uniqueEmail("e2e-no-such-user"), "wrong-password");
    await submitForm(page);

    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("signup error: duplicate email", async ({ page }) => {
    await page.goto("/signup");
    await fillCredentials(page, EXISTING_FIXTURE_EMAIL, E2E_PASSWORD);
    await submitForm(page);

    await expect(page.getByText("Email has already been taken")).toBeVisible();
  });

  test("unauthenticated visitors are redirected to Login", async ({ page }) => {
    await page.goto("/home");

    await expect(page).toHaveURL(/\/login$/);
  });

  test("happy path: Entry -> Onboarding -> Signup -> Login -> Home", async ({ page }) => {
    const email = uniqueEmail("e2e-auth-happy");

    await page.goto("/");
    await expect(page.getByText("Every step, earned.")).toBeVisible();
    await page.screenshot({ path: "screenshots/auth/01-entry.png" });

    await page.getByTestId("entry-start-journey").click();
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByText("One concept at a time")).toBeVisible();
    await page.screenshot({ path: "screenshots/auth/02-onboarding.png" });

    await page.getByTestId("onboarding-continue").click();
    await expect(page).toHaveURL(/\/signup$/);
    await page.screenshot({ path: "screenshots/auth/03-signup.png" });

    await fillCredentials(page, email, E2E_PASSWORD);
    await submitForm(page);

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("Account created")).toBeVisible();
    await page.screenshot({ path: "screenshots/auth/04-login.png" });

    await fillCredentials(page, email, E2E_PASSWORD);
    await submitForm(page);

    await expect(page).toHaveURL(/\/home/);
  });
});
