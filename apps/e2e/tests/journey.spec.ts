import { test, expect } from "@playwright/test";
import { uniqueEmail, signUpAndLogIn } from "./helpers";

// Flow: Home -> Subject list -> Lesson list -> Lesson content, for a
// brand-new user starting their first Journey. No seeding needed beyond the
// curriculum content itself (curriculum:seed_e2e) — a fresh signup's Journey
// is naturally mostly locked, and every user here is created by the test's
// own signup, not a fixture.
//
// This only covers "starting" a Journey, not "completing" one: there's no
// in-app way to pass a Lesson's Exercise yet (issue #6), so a real user
// cannot reach an in-progress/completed state through the browser today —
// see ADR-0013. Faking that via seeded Submission rows would test a state a
// real user can't actually be in, so it's left uncovered until issue #6
// ships a real way to earn it.
//
// Gating checks run before the happy path: a locked Subject/Lesson is only
// ever reachable as a disabled row in its list (UnitCard is unclickable when
// locked), so that's what gets checked — real UI properties, not a
// cross-check of the backend's lock derivation, which is already owned by
// request specs + render-boundary tests.
test.describe("Journey", () => {
  test("a locked Subject renders disabled with its unlock message", async ({ page }) => {
    await signUpAndLogIn(page, uniqueEmail("e2e-locked-subject"));
    await page.getByTestId("unit-card").first().click();
    await expect(page).toHaveURL(/\/journeys\//);

    await expect(page.locator('[data-testid^="subject-"]:disabled').first()).toBeVisible();
    await expect(page.getByTestId("lock-tooltip")).toBeVisible();
    await page.screenshot({ path: "screenshots/journey/locked-subject.png" });
  });

  test("a locked Lesson renders disabled with its unlock message", async ({ page }) => {
    await signUpAndLogIn(page, uniqueEmail("e2e-locked-lesson"));
    await page.getByTestId("unit-card").first().click();
    await page.locator('[data-testid^="subject-"]:not(:disabled)').first().click();
    await expect(page).toHaveURL(/\/subjects\//);

    await expect(page.locator('[data-testid^="lesson-"]:disabled').first()).toBeVisible();
    await expect(page.getByTestId("lock-tooltip")).toBeVisible();
    await page.screenshot({ path: "screenshots/journey/locked-lesson.png" });
  });

  test("happy path: start a Journey -> Home (not-started) -> Subject list -> Lesson list -> Lesson content", async ({
    page,
  }) => {
    await signUpAndLogIn(page, uniqueEmail("e2e-journey-start"));

    await expect(page.getByText("Start your first Journey")).toBeVisible();
    await page.screenshot({ path: "screenshots/journey/01-home.png" });

    await page.getByTestId("unit-card").first().click();
    await expect(page).toHaveURL(/\/journeys\//);
    // Not "Caching Fundamentals": the next locked Subject's LockTooltip names
    // the currently-active one in its unlock message ("Finish all 2 lessons
    // in Caching Fundamentals..."), so that text matches twice on this page.
    await expect(page.getByRole("heading", { name: "Software Design" })).toBeVisible();
    await page.screenshot({ path: "screenshots/journey/02-subject-list.png" });

    await page.locator('[data-testid^="subject-"]:not(:disabled)').first().click();
    await expect(page).toHaveURL(/\/subjects\//);
    await expect(page.getByText("Retakes allowed")).toBeVisible();
    await page.screenshot({ path: "screenshots/journey/03-lesson-list.png" });

    await page.locator('[data-testid^="lesson-"]:not(:disabled)').first().click();
    await expect(page).toHaveURL(/\/lessons\//);
    await expect(page.getByText("Ask for a hint")).toBeVisible();
    await page.screenshot({ path: "screenshots/journey/04-lesson-content.png" });
  });
});
