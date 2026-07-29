---
status: accepted
date: 2026-07-29
decision-makers: Bruno Martins
---

# Playwright E2E as a PR-review artifact, not a regression gate

Reviewers can't always run the dev servers to eyeball a UI-heavy PR. `apps/e2e` adds Playwright tests, driven against the real `apps/api` + `apps/web` (no network stubbing), that walk the flows in `flows.html` — Auth (Entry → Onboarding → Signup → Login) and Curriculum browse + gating (Home → Subject list → Lesson list → Lesson content, all 3 Home states) — and exist primarily to produce a screenshot per screen plus a full video per flow as CI artifacts. Assertions are deliberately thin (each screen loaded; each error state's message appeared) rather than duplicating lock-state logic already covered by request specs and frontend render-boundary tests. Each flow spec runs its error-state tests before its happy path, real-stack throughout — no `page.route` stubbing anywhere in the suite, so every test stays a true end-to-end path. That includes bad login, duplicate-email signup, and an unauthenticated redirect, each of which does hit a real error response. A locked Subject/Lesson is different: `UnitCard` renders it `disabled` and unclickable in its list, so a real user never reaches the controller's 403 through normal navigation — the E2E test reflects that by asserting the disabled row + its `LockTooltip` render correctly in the list, not by navigating directly to the locked resource's own route. (The 403 response itself — `apps/api/app/controllers/subjects_controller.rb`/`lessons_controller.rb`'s `render_forbidden_if` — is already covered by `apps/web`'s existing mocked render-boundary tests; re-hitting it here would be exactly the regression-suite overlap the "Suite purpose" decision below rejects.) Runs in a new `.github/workflows/e2e.yml`, triggered on `pull_request` only, as a required/blocking check, Chromium-only, desktop viewport (not the mobile viewport `flows.html`'s device frames would suggest — a deliberate simplicity trade-off over 1:1 visual parity with the mockups).

Two flow states currently have no in-app UI path to reach them at all: Home's in-progress/completed states and the `is-completed`/`is-active` Subject and Lesson cards all depend on passing `Submission` rows, and Exercise/grading (issue #6) isn't built yet — a real user cannot pass a Lesson through the browser today. A new `curriculum:seed_e2e` rake task (extracting the shared curriculum-building logic from the existing dev-only `curriculum:seed`), runnable under `RAILS_ENV=test`, seeds the same curriculum plus a fixture user with real `Submission` rows and a separate existing-email fixture user for the duplicate-signup error test. Creating rows via ActiveRecord before Playwright drives the browser is ordinary E2E arrange-phase seeding, not stubbing — the browser still only ever sees the real, live backend.

## Considered Options

**Suite purpose** — thin-assertion visual-review suite (chosen) vs. a full regression suite duplicating request-spec/render-boundary assertions in the browser: rejected as overlap with tests that already exist and pass, and more test code to maintain per screen/state for no new coverage.

**Error-state coverage** — real-stack errors only (chosen) vs. also stubbing network failures (`"Could not reach the API."` on Home/Journey) via `page.route(...).abort()`: rejected because it introduces a mocking layer into a suite whose entire premise is "the real thing, rendered," for one extra error string.

**Blocking behavior** — required/blocking check (chosen) vs. non-blocking/informational-only: blocking accepted despite the suite being new and unproven (real browser, real servers, real network timing all add flakiness risk), in exchange for a stronger guarantee the flows actually work end-to-end.

**Package location** — new `apps/e2e` workspace package (chosen) vs. nested in `apps/web/e2e`: `apps/e2e` matches this repo's existing split-by-concern convention ([ADR-0004](0004-polyglot-stack-rails-react-split-monorepo.md)) and reflects that these tests genuinely span both apps, not just the frontend.

**Viewport** — desktop (chosen) vs. mobile emulation matching `flows.html`'s iPhone frames: mobile would give 1:1 visual parity with the design mockups and better match the PWA/mobile-first intent ([ADR-0003](0003-pwa-over-native-for-v1.md)), but desktop was chosen for simplicity.

**Missing-state data** — a new test-env rake task creating real `Submission` rows (chosen) vs. skipping the completed/in-progress states until issue #6 ships a real UI path: seeding accepted as the more complete option, at the cost of a temporary fixture-data path that will overlap with issue #6's own eventual seed/factory needs.

## Consequences

`e2e.yml` currently duplicates the small Ruby/db setup block from `.github/actions/test-api` (PR #19) rather than reusing a composite action, since `test-api` bundles that setup together with RuboCop/RSpec with no way to use just the setup half — flagged on PR #19 for a possible `setup-api` split, not blocking. The `curriculum:seed_e2e` task's fixture-user/`Submission` seeding is scaffolding for a gap that issue #6 (Exercise + grading) will eventually close properly via real UI — once that ships, this task's progress-seeding half may become redundant and worth revisiting. Being a required check on every PR, a flaky Playwright run (real browser/server timing) can block merges; if that proves too noisy in practice, revisit the blocking decision above rather than silently disabling the check.

`apps/web`'s `webServer` entry runs a production build (`vite build`) + `vite preview` rather than the dev server (`vite dev`): dev mode's on-demand per-route transform pipeline was adding avoidable latency on CI's constrained CPU (shared with Rails, Postgres, and Chromium), and a built bundle is also more faithful to "the real thing" than a dev server — consistent with this ADR's own premise. Costs a few hundred ms of build time per run; `apps/web/dist` is a build artifact, not committed.
