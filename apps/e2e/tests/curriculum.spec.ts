import { test, expect } from "@playwright/test";
import {
  uniqueEmail,
  signUpAndLogIn,
  logIn,
  IN_PROGRESS_FIXTURE_EMAIL,
  COMPLETED_FIXTURE_EMAIL,
} from "./helpers";

// Flow: Home -> Subject list -> Lesson list -> Lesson content, plus all 3 Home
// states (flows.html section 2 + 2a). Errors run before the happy path
// (ADR-0013): a locked Subject/Lesson is only ever reachable as a disabled
// row in its list (UnitCard is unclickable when locked), so that's what gets
// checked here — real UI properties, not a cross-check of the backend's lock
// derivation, which is already owned by request specs + render-boundary
// tests.
test.describe("Curriculum browse + gating", () => {
  test("a locked Subject renders disabled with its unlock message", async ({ page }) => {
    await signUpAndLogIn(page, uniqueEmail("e2e-locked-subject"));
    await page.getByTestId("unit-card").first().click();
    await expect(page).toHaveURL(/\/journeys\//);

    await expect(page.locator('[data-testid^="subject-"]:disabled').first()).toBeVisible();
    await expect(page.getByTestId("lock-tooltip")).toBeVisible();
    await page.screenshot({ path: "screenshots/curriculum/locked-subject.png" });
  });

  test("a locked Lesson renders disabled with its unlock message", async ({ page }) => {
    await signUpAndLogIn(page, uniqueEmail("e2e-locked-lesson"));
    await page.getByTestId("unit-card").first().click();
    await page.locator('[data-testid^="subject-"]:not(:disabled)').first().click();
    await expect(page).toHaveURL(/\/subjects\//);

    await expect(page.locator('[data-testid^="lesson-"]:disabled').first()).toBeVisible();
    await expect(page.getByTestId("lock-tooltip")).toBeVisible();
    await page.screenshot({ path: "screenshots/curriculum/locked-lesson.png" });
  });

  test("Home: not-started state for a brand-new user", async ({ page }) => {
    await signUpAndLogIn(page, uniqueEmail("e2e-not-started"));

    await expect(page.getByText("Start your first Journey")).toBeVisible();
    await page.screenshot({ path: "screenshots/curriculum/home-not-started.png" });
  });

  test("Home: completed state for a fully finished Journey", async ({ page }) => {
    await logIn(page, COMPLETED_FIXTURE_EMAIL);

    await expect(page.getByText("Software Design complete")).toBeVisible();
    await page.screenshot({ path: "screenshots/curriculum/home-completed.png" });
  });

  test("happy path: Home (in-progress) -> Subject list -> Lesson list -> Lesson content", async ({ page }) => {
    await logIn(page, IN_PROGRESS_FIXTURE_EMAIL);
    await expect(page.getByText("Continue your Journey")).toBeVisible();
    await page.screenshot({ path: "screenshots/curriculum/01-home.png" });

    await page.getByTestId("unit-card").first().click();
    await expect(page).toHaveURL(/\/journeys\//);
    await page.screenshot({ path: "screenshots/curriculum/02-subject-list.png" });

    await page.locator('[data-testid^="subject-"]:not(:disabled)').first().click();
    await expect(page).toHaveURL(/\/subjects\//);
    await page.screenshot({ path: "screenshots/curriculum/03-lesson-list.png" });

    await page.locator('[data-testid^="lesson-"]:not(:disabled)').first().click();
    await expect(page).toHaveURL(/\/lessons\//);
    await page.screenshot({ path: "screenshots/curriculum/04-lesson-content.png" });
  });
});
