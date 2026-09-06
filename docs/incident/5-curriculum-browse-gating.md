# 5 — Curriculum browse + gating

Branch: `5-curriculum-browse-gating` · PR #18

## 2026-09-06 — CORS block and 404 on `POST /refresh`

## Symptom

Loading the app at `http://localhost:5173` (signup screen), the browser console showed:

```
Access to fetch at 'http://localhost:3000/refresh' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
on the requested resource.

POST http://localhost:3000/refresh net::ERR_FAILED 404 (Not Found)   httpClient.ts:13

Uncaught (in promise) TypeError: Failed to fetch
    at refreshAccessToken (httpClient.ts:13:26)
    at main.tsx:23:1
```

Three symptoms stacked: a 404, absent CORS headers, and an uncaught rejection.

## Investigation

The obvious reading — the API is missing a route and its CORS config — was wrong on both counts.

- `bin/rails routes` inside the container: `POST /refresh` → `sessions#refresh` **exists**.
- `apps/api/config/initializers/cors.rb` **already existed** and was already correct per ADR-0009: `origins ENV.fetch("FRONTEND_ORIGIN", "http://localhost:5173")` with `credentials: true` and no wildcard. `rack-cors` was in the `Gemfile` and installed.
- Curling Rails directly inside the container proved the API behaves correctly:
  ```
  curl -i -X POST http://127.0.0.1:3000/refresh -H "Origin: http://localhost:5173"
  → 401, access-control-allow-origin: http://localhost:5173
       access-control-allow-credentials: true
  ```
  A 401 is the correct response for a request with no refresh cookie.

So the API was right and the browser was still wrong. The discrepancy was the request never reaching this API:

- `docker ps --filter publish=3000` → `got-it-api-1  0.0.0.0:3000->3000/tcp` — an unrelated project's Express container owns host port 3000.
- This devcontainer publishes **no** host ports at all (`docker inspect` → `NetworkSettings.Ports` is `{}`); Rails is reachable only via VS Code's dev-container forwarding, bound to `127.0.0.1`.
- `curl` to `localhost:3000` returns `404` with `x-powered-by: Express` — confirming the wrong service answers.
- `localhost` resolves to `::1` first on this machine, landing on the Express container's dual-stack listener rather than the forwarded port.

An Express 404 naturally carries no `Access-Control-Allow-Origin` header, which produced the CORS message too. One environmental fault presented as two application faults.

## Root cause

Two independent causes:

1. **Host port collision (outside this repo).** Another project's container held `0.0.0.0:3000`, so the browser's requests never reached this project's Rails.
2. **Unhandled rejection at boot (real bug in this repo).** `main.tsx:23` called `refreshAccessToken().finally(...)` with no `.catch`, and `refreshAccessToken` let a `fetch`-level failure propagate. Any network failure at boot — not just this collision — produced an uncaught `TypeError` for a logged-out visitor. A failed refresh with no session is a normal state and should never throw.

## Options considered

- **Change the CORS config to fix the missing header** — rejected. The config was already correct; the header was absent because a different server answered. Changing it would have "fixed" nothing while making a correct file wrong.
- **Publish port 3000 from `.devcontainer/docker-compose.yml`** — rejected. The port is already bound on the host by the other container, so the bind would simply fail. It would also duplicate what VS Code's forwarding already does.
- **Move this project's API off port 3000** — not taken, but viable. 3000 is Rails' default and is assumed in `apps/web/.env.example`, `httpClient.ts`'s fallback, the root `docker-compose.yml`, and ADR-0009. Changing it means changing all of them, to work around a collision that only exists on one machine. Left open in case the collision proves permanent.
- **Stop the conflicting container on the host** — chosen. The collision is local to one developer's machine and belongs there, not in the repo's configuration.
- **Catch the rejection in `main.tsx` at the call site** — rejected in favour of handling it inside `refreshAccessToken`, so every caller benefits rather than only this one.

## Outcome

- `apps/web/src/lib/httpClient.ts` — `refreshAccessToken` wraps its `fetch` in `try/catch`; a failed request clears the access token and resolves `false`, matching the existing non-`ok` path instead of throwing.
- `apps/web/src/lib/httpClient.test.ts` — new; covers network failure, non-ok response, and success. The first test reproduced the exact reported rejection before the fix.
- Nothing in `apps/api` changed. No gem added; `Gemfile.lock` untouched.
- The port collision is not fixed in this repo and cannot be — it is resolved by stopping `got-it-api-1` or moving one project to another port.

## Prevention

The costly part was assuming a browser-reported 404 came from the expected server. `x-powered-by: Express` on a Rails project's endpoint was the tell, and it was visible in the very first response.

When a symptom points at a service, confirm the request reaches that service before investigating its code — `docker ps --filter publish=<port>` and one `curl -i` would have located this in under a minute.

No repo-level change would have prevented the collision. The unhandled rejection, by contrast, was a genuine gap: `httpClient.ts` had no test file at all, so the boot path's failure mode was never exercised.

## 2026-09-06 — no back navigation, `/login?created=true` reachable while authenticated, lock tooltip always-on

Three separate UI bugs found in review of the Journey/Subject/Lesson browse flow, fixed together on `5-curriculum-browse-gating`.

### Bug 1 — No back navigation out of Journey/Subject/Lesson

#### Symptom

From Home, drilling into a Journey, then a Subject, then a Lesson, left the user stuck: none of those three screens had any control to go back up a level. The only way out was the browser's own back button (not present at all in the installed-PWA chrome this app targets per ADR-0003).

#### Investigation

Grepped every route component (`apps/web/src/routes/**/index.tsx`) and every shared header-ish component (`PageHeading.tsx`, `StatusScreen.tsx`) for any existing back affordance — none exists anywhere in the app; Entry/Onboarding/Login/Signup only ever link forward (`Link to="/onboarding"`, `MutedLink to="/signup"`, etc.) or leave a screen via form submission. There is no Claude Design `flows.html` checked into this repo to consult (design-tool access wasn't available for this task either), so the decision came from the existing markup: `PageHeading` is the one component already shared by every content screen (Home, Journey, Subject, Lesson, Login, Signup, Onboarding), making it the natural place to host a back control conditionally.

Checked whether a parent route id is even derivable to build an explicit `Link` back: `SubjectDetail` (`apps/web/src/lib/curriculum.ts`) carries `journeyTitle` but no `journeyId`, and `LessonDetail` carries `subjectTitle` but no `subjectId`. The API's serializers don't expose the parent id today, so an explicit `Link to="/journeys/$journeyId"` from the Subject screen isn't buildable without an API change.

#### Root cause

No back affordance was ever built for the three nested detail screens — a plain omission, not a regression.

#### Options considered

- **Back button on every screen (Entry, Onboarding, Login, Signup, Home, Journey, Subject, Lesson)** — rejected. Entry has nothing before it; Onboarding/Login/Signup/Home are the linear pre-auth funnel and the authenticated landing screen respectively, each already reachable only by moving forward (or, for Login/Signup, via a `MutedLink` to each other) — none of them has a parent *list* screen to return to. Adding the control everywhere would be UI for a state (a "back" target) that doesn't exist on those screens.
- **Back button only on Journey/Subject/Lesson** — chosen. These are exactly the screens reached by drilling into a row from a parent list (Home → Journey → Subject → Lesson), which is precisely where the reported bug occurs.
- **Explicit `Link` to the parent route (`/journeys/$journeyId` from Subject, etc.)** — rejected for now. Not buildable without adding `journeyId`/`subjectId` to `SubjectSerializer`/`LessonSerializer` and threading them through `curriculum.ts`'s zod schemas — a cross-app API change to solve a problem `router.history.back()` already solves, given every real path into these screens is a forward navigation from the exact parent (YAGNI).
- **Browser-history back (`router.history.back()`, TanStack Router's `useRouter().history`)** — chosen. Every one of these screens is only ever entered by clicking a row on its parent list, so "back" and "history back" are the same operation in practice. Simple, no API change, matches how the rest of the app already treats navigation (no route-level "parent id" concept exists anywhere else in the codebase).
- **New standalone `BackButton` component** — rejected in favour of an `onBack` prop on the existing `PageHeading`, since every one of these three screens already renders a `PageHeading` and the back control's visual position (top-left, above the eyebrow/title) is naturally part of that same header block, not a separate one.

#### Outcome

- `apps/web/src/components/PageHeading.tsx` — new optional `onBack` prop; when passed, renders a `data-testid="back-button"` icon button (a mirrored `ChevronRightIcon`, rotated via `rotate-180` rather than adding a new icon file) above the eyebrow/title.
- `apps/web/src/routes/journeys.$journeyId/index.tsx`, `subjects.$subjectId/index.tsx`, `lessons.$lessonId/index.tsx` — each passes `onBack={() => router.history.back()}` (`useRouter()` from `@tanstack/react-router`).
- `apps/web/src/locales/en.json` — new `pageHeading.back` string ("Back") for the button's `aria-label`.
- `apps/web/src/test/renderRoute.tsx` — `renderRouteTree` now accepts either a single path or an array of paths, so tests can seed multi-entry history and assert the back button actually returns to the previous screen.
- New regression tests in all three routes' `index.test.tsx` files, each rendering with a two-entry history and asserting the back button lands back on the parent screen's heading.
- Entry, Onboarding, Login, Signup, and Home deliberately left without a back control — see rejected options above.

### Bug 2 — `/login?created=true` reachable while authenticated

#### Symptom

An authenticated user hitting `/login` directly (typed URL, bookmark, or fast back/forward navigation) landed on the login form instead of being redirected to `/home`. Same for `/`, `/signup`, `/onboarding`.

#### Investigation

`apps/web/src/lib/routeGuards.ts` had only `requireAuth` (redirects an unauthenticated visitor away from a protected route to `/login`); nothing did the inverse. Checked every route file under `apps/web/src/routes/`: `index.tsx` (Entry), `login.tsx`, `signup.tsx`, `onboarding.tsx` all had no `beforeLoad` at all, while `home/index.tsx`, `journeys.$journeyId/index.tsx`, `subjects.$subjectId/index.tsx`, `lessons.$lessonId/index.tsx` all set `beforeLoad: requireAuth`. The gap was symmetric and total — no auth-route guard existed anywhere.

#### Root cause

Missing guard, not a broken one: `requireAuth` was written and applied everywhere it needed to be; its inverse was simply never built.

#### Options considered

- **Guard `/login` only** — rejected; the ticket explicitly calls out that every auth-ish route (login, signup, entry, onboarding) needs the same treatment, and the investigation above confirms all four are equally reachable while authenticated today.
- **A `useEffect` + `navigate()` inside each page component** — rejected. That still renders the login form for one paint before redirecting (a visible flash), and duplicates the check across four components. `beforeLoad` runs before the route ever renders, matching how `requireAuth` already works for the authenticated side.
- **A single `beforeLoad: requireGuest` function mirroring `requireAuth`, applied to `/`, `/login`, `/signup`, `/onboarding`** — chosen. Same shape as the existing convention, one function, four one-line call sites.

#### Outcome

- `apps/web/src/lib/routeGuards.ts` — new `requireGuest()`: throws `redirect({ to: "/home" })` when `getAccessToken()` is set.
- `apps/web/src/routes/index.tsx`, `login.tsx`, `signup.tsx`, `onboarding.tsx` — each now sets `beforeLoad: requireGuest`.
- `apps/web/src/lib/routeGuards.test.ts` — new; unit-tests both `requireAuth` and `requireGuest` throw/don't-throw in the right token states.
- `apps/web/src/routes/index.test.tsx`, `login.test.tsx`, `signup.test.tsx`, `onboarding.test.tsx` — each gained an integration test asserting an authenticated visitor lands on Home instead of the auth screen.

### Bug 3 — Lock tooltip always rendered, floating over the page heading, not dismissible

#### Symptom

`LockTooltip` (`apps/web/src/components/LockTooltip.tsx`) rendered unconditionally as soon as its parent condition (`lesson.id === nextLockedLessonId && activeLesson`) was true — no hover, focus, or click needed. It was `absolute bottom-[calc(100%+0.5rem)]` off its row's `relative` wrapper, so when the flagged row was the first one in the list, the panel floated up over the "X of Y Subjects completed" heading text above the list. Clicking anywhere did nothing because nothing was listening for it — there was no open/closed state at all.

#### Investigation

Confirmed via `apps/web/src/routes/subjects.$subjectId/index.test.tsx` (pre-fix): the lock message text was asserted present with a plain `getByText`, no interaction — proving the panel was in the DOM unconditionally, matching the reported symptom exactly. Read ADR-0003 (touch-first PWA) to weigh the fix: this app has no hover-capable primary input, so a hover-only fix (CSS `:hover`/`group-hover`) would satisfy "appears on hover" while making the tooltip permanently unreachable on the actual target device, and invisible to keyboard/screen-reader users (no focus state, no semantics).

#### Root cause

Two compounding issues in `LockTooltip`: it had no open/closed state (always rendered, matching the "always-visible and floating" symptom) and it positioned itself off the whole row rather than a fixed trigger point (so it could reach over the row above, including the page heading, depending on which row was flagged).

#### Options considered

- **CSS-only hover reveal (`group-hover:block` etc.), no JS state** — rejected. Cheapest, but touch has no hover at all (ADR-0003) — this is the app's primary input, and a hover-only trigger would be *permanently* unreachable on it, not just less convenient. It also gives keyboard/screen-reader users nothing (no focus-triggered reveal, no `aria-expanded`/`role="tooltip"` semantics), which the ticket explicitly called out as a requirement, not a nice-to-have.
- **Tap-to-toggle only (drop hover entirely)** — rejected. Works for touch and roughly for keyboard, but throws away the hover behavior the ticket asked to keep for desktop mouse users, and loses the instant, no-commitment "just glance at it" feel hover normally gives a mouse user.
- **Keep it always-rendered, just reposition it (e.g. always to the row's right instead of above)** — rejected. Fixes the visual overlap for the common case but does nothing about "clicking outside does nothing" or "appear only when hovered" — the core complaint was that it's *always* showing, not just that it's in the wrong place.
- **Hover + focus + click-to-toggle, trigger anchored to the row's right edge, panel floats above the trigger only (not the whole row), closes on outside pointerdown or blur/Escape** — chosen. Hover keeps the low-friction desktop experience; focus (keyboard tab) and a tap (click toggle) give touch and keyboard users an equivalent, satisfying ADR-0003 without dropping hover for the input that already supports it. Anchoring the panel to a small trigger at the row's right edge (rather than the full-width row) means even when open, it can't reach as far up as the row-spanning version did.

The trade-off: the panel is genuinely transient now — it only exists in the DOM while `open` is true, so a plain `getByText`/`toBeVisible` on the message with no prior interaction (as the pre-fix tests did) will now correctly fail. That's the intended behavior change, not a regression, but it does mean every existing assertion on tooltip content had to be rewritten to hover (or click) the trigger first.

#### Outcome

- `apps/web/src/components/LockTooltip.tsx` — rewritten: a `useState` open flag driven by `onMouseEnter`/`onMouseLeave` (hover), `onFocus`/`onBlur` (keyboard), and `onClick` (tap-to-toggle) on a `LockIcon` trigger button; a `pointerdown` listener on `document` closes it when the pointer lands outside the component's root while open; `Escape` closes it too. The trigger carries `aria-expanded`, `aria-label`, and `aria-describedby` (pointing at the open panel's `useId()`-generated id); the panel itself is `role="tooltip"`. The trigger sits at the row's right edge (`absolute top-1/2 right-3 -translate-y-1/2`) instead of the panel spanning the whole row, so even while open it can't reach as far up as before.
- `apps/web/src/routes/journeys.$journeyId/index.test.tsx`, `subjects.$subjectId/index.test.tsx` — updated to `user.hover()` the trigger (`getByRole("button", { name: "Locked" })`) before asserting the lock message is present, and to assert it's absent beforehand (and, for the Journey test, absent again after `user.unhover()`).
- `apps/e2e/tests/journey.spec.ts` — both locked-state assertions now `.hover()` the `lock-tooltip` trigger before asserting `getByRole("tooltip")` is visible, instead of asserting visibility with no interaction.
- `apps/web/src/helpers/curriculumGating.ts` (`firstLockedId`) and the two route components' `nextLockedLessonId/SubjectId === ... && active... &&` conditionals were reviewed and left unchanged — "only render when applicable" was already correctly gated there; the bug was entirely in `LockTooltip` always showing once rendered, not in when it got rendered.

#### Prevention

For bug 3 specifically: the original component's own comment claimed the always-rendered behavior was intentional ("Always rendered, not hover-triggered: touch has no hover, and this keeps it in reading order for screen readers") — a reasonable-sounding justification for what was actually just a missing interaction model. A comment asserting *why* a component works a given way is only as good as the trade-off it records; this one recorded half the trade-off (touch can't hover) without addressing the other half (an always-visible floating panel isn't dismissible and can overlap unrelated content). Skepticism toward "intentional" comments that don't cite the alternative they were weighed against would have caught this earlier.
