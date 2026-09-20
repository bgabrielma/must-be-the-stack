---
status: accepted
date: 2026-09-20
decision-makers: Bruno Martins
---

# Gate the app on Profile completeness

An authenticated user whose Profile is incomplete cannot reach any product screen. `requireCompleteProfile` (`apps/web/src/lib/routeGuards.ts`) runs as the `beforeLoad` guard on Home, a Journey, a Subject and a Lesson; it stacks on `requireAuth`, reads the signed-in user through `lib/currentUser.ts`, and redirects to `/profile` — the capture screen — whenever `profileComplete` is false. A Profile counts as complete when first name, last name and Job role are all present; the about line is excluded by definition, since it is optional and therefore can never gate anything (`User::PROFILE_FIELDS` in `packages/api`, and `CONTEXT.md` under **Profile**).

The gate is one mechanism serving two populations. A user who has just signed up has no Profile and meets it on their first log in, which is where the capture step belongs — sign up itself stays email, password and confirmation, so the authentication endpoints and their specs are untouched. The 14 users who predate Profiles have no Profile either and meet exactly the same screen on their next log in. That is the intended path for them, not an edge case worked around; there is no migration backfilling placeholder names, and no second "please complete your details" flow to maintain.

"Required" therefore lives in two places and deliberately not in a third. It is enforced at capture — `User` validates first name, last name and Job role in the `:profile` context, which only `UsersController#update` saves under — and by this route gate. It is *not* enforced by a database constraint: `first_name`, `last_name`, `job_role` and `about` are all nullable, because a `NOT NULL` column would make every pre-existing row retroactively invalid and would make `User` unsaveable for the very users the gate exists to catch. A validation context rather than a plain `presence: true` for the same reason — signing up, issuing a refresh token and every other save must keep working on a User with no Profile.

`/profile` itself is guarded by `requireAuth` alone. Gating the capture screen on a complete Profile would redirect it to itself, so that exception is structural, not an oversight, and a route test holds it in place.

## Considered Options

- **A skippable profile step** ("Skip for now", shown again later) — rejected. It is the obvious kinder-looking option, and it is why this ADR exists. The Profile is not decoration: the Account capsule (#27) shows the name and Job role on every browsing screen, and Home greets the user by first name. A skippable step means every one of those surfaces needs a designed empty state, and the app has to decide when to nag. Three required text fields with no wrong answers is a smaller ask than the permanent half-populated product a skip button creates. The cost we accept is that a user cannot look around before filling them in.
- **Gating on the API instead of the route** (403 from `/journeys`, `/subjects`, `/lessons` until the Profile is complete) — rejected. It turns a navigation concern into an error state on four endpoints, and the frontend would still need the redirect to turn that 403 into the profile screen, so the guard gets written either way. The API's job here is to validate what is saved, not to decide which screen a user should be on.
- **A database `NOT NULL` constraint with a backfill** (placeholder names for the existing 14) — rejected. Writing "Unknown" into a user's first name to satisfy a constraint invents data, and the app would then have to detect the placeholder to know the Profile is still incomplete — the same check, with a fabricated row behind it.
- **Capturing the Profile during sign up** (one form: email, password, name, Job role, about) — rejected. It lengthens the first screen a stranger sees, and it would mean changing `POST /signup`, its request specs and the existing registration E2E flow to carry Profile fields. Keeping capture after the first log in leaves the authentication surface exactly as it is.
- **Caching the Profile state alongside the access token, set by the login/refresh response** — rejected, even though it would make the guard synchronous and free. It requires `POST /login` and `POST /refresh` to return Profile state, which is the change to the authentication endpoints this work set out not to make. The guard instead reads `GET /user` once per session through `lib/currentUser.ts` and holds it in memory, the same shape (and lifetime) as `accessToken.ts`.

## Consequences

Every screen added behind the gate has to opt into it — `beforeLoad: requireCompleteProfile` rather than `requireAuth` — and forgetting leaves a hole the type system cannot catch, so the route test for each gated screen asserts the redirect.

The guard fails open. When `GET /user` cannot be reached, or returns something malformed, `loadCurrentUser` returns null and navigation proceeds. An unknown Profile state is not an incomplete one, and the alternative — treating a network blip as "incomplete" — would strand a user on the profile screen whose save request is equally unable to reach the API. This means a total API outage does not enforce the gate, which is acceptable: nothing behind it works during an outage anyway.

The cached user is session-scoped module state, so it has to be invalidated deliberately. `login()` and `logout()` both clear it (a second user in the same tab must never inherit the first one's Profile) and the capture screen sets it from the save response (otherwise the redirect to Home would bounce straight back to `/profile`). Route tests get this for free: `renderRouteTree` clears it on every render, since each rendered tree is a fresh session.

Because the capture step now sits between log in and Home, every E2E flow that signs a user in passes through it — `signUpAndLogIn` fills the Profile as part of logging in, rather than each spec repeating the step.
