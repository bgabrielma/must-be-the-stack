# Contributing

Code-level standards for this repo. For process (issue tracking, triage, the feature workflow), see [AGENTS.md](AGENTS.md).

## Principles

**DRY** (Don't Repeat Yourself): don't duplicate the same *decision* in two places. Anti-pattern this rules out: copy-pasting a validation rule or an API shape into both `apps/api` and `apps/web` instead of deriving one from the other (e.g. generated types) — the two ecosystems already can't share code directly (ADR-0004), so duplicated decisions drift silently.

**SOLID**: classes/modules should have one reason to change, and depend on abstractions where the concrete implementation genuinely varies. Anti-pattern this rules out: a single service object or React hook that both fetches data and decides how a Lesson gets graded — decompose along those two reasons to change, not preemptively into any other shape.

**KISS** (Keep It Simple): prefer the boring, direct implementation over a clever one. Anti-pattern this rules out: building a generic rules engine for Exercise gating when a straightforward conditional covers every case the domain currently has.

**YAGNI** (You Aren't Gonna Need It): don't build for a requirement that doesn't exist yet. Anti-pattern this rules out: adding a strategy pattern for "future" Exercise types before a second type actually exists, or a config flag for a second LLM provider before ADR-0006's Gemini choice is revisited.

## Testing (apps/api)

RSpec files under `spec/` mirror the path of the `app/` file they cover, e.g. `app/models/ping.rb` -> `spec/models/ping_spec.rb`, `app/jobs/foo_job.rb` -> `spec/jobs/foo_job_spec.rb`. **Exception**: controllers are covered by request specs, not controller specs — `app/controllers/pings_controller.rb` is tested via `spec/requests/pings_spec.rb`, matching Rails' own convention rather than a literal path mirror.

Test data is built with [FactoryBot](https://github.com/thoughtbot/factory_bot) + [Faker](https://github.com/faker-ruby/faker), not hand-rolled fixtures. Factories live in a flat `spec/factories/*.rb` (one file per model, FactoryBot's default autoload path) — they are not mirrored into `app/`'s subfolders. See `spec/factories/pings.rb` and `spec/models/ping_spec.rb` for the reference example.

This convention is enforced by code review, not CI.

## Testing (apps/web)

`*.test.tsx` files sit next to the implementation they cover (`src/routes/home.tsx` -> `src/routes/home.test.tsx`), not in a separate `__tests__` tree — there's nothing gained by relocating tests away from the code they exercise. Test-only utilities genuinely shared across multiple test files (not tied to one component/route) live in `src/test/` (e.g. `src/test/renderRoute.tsx`), which is exempt from the TypeScript file-structure/lib-vs-helpers rules above since it holds test infrastructure, not app code.

Within a test file, the `describe` block(s) come first; any local helper/mock function they call goes below the last `describe`, not above the first one — the reader wants the actual test cases before the plumbing that supports them. Function declarations (not arrow-function consts) are hoisted, so this ordering doesn't affect execution.

This convention is enforced by code review, not CI.

## Controllers (apps/api)

Never read `params[...]` directly inside an action body. Extract every param a controller uses through a private method at the bottom of the class — `params.require(:id)` for a required route param, `params.permit(...)` for a request body — even when the value isn't used for mass assignment. `SignupsController#user_params` is the reference example; `JourneysController#journey_id`/`#pagination_params` and `SessionsController#login_params` follow the same shape. This keeps what a controller accepts legible from one place and testable in isolation, and matches Rails' own strong-parameters convention rather than special-casing "just an id."

`ApplicationController` rescues `ActionController::ParameterMissing` (400) alongside `ActiveRecord::RecordNotFound` (404) — a required param is a client error, not a 500.

API responses use `Content-Type: application/json`, not `application/vnd.api+json` — see [ADR-0008](docs/adr/0008-rest-json-api-with-active-model-serializers.md)'s Consequences section. The JSON:API contract is the response body shape, not the content-type header.

This convention is enforced by code review, not CI.

## Models (apps/api)

Prefer a guard clause over combining conditions with `&&`/`||` in a boolean-returning method, e.g. `return false if children.none?` followed by the real check, rather than `children.any? && children.all? { ... }` on one line. See `Journey#completed_for?`/`Subject#completed_for?` for the reference shape.

Where a per-record predicate can be expressed as a query, back it with an ActiveRecord `scope` instead of only computing it in Ruby — the scope is then reusable for future collection-level queries (e.g. "every lesson a user has passed"), not just the single-record check. See `Lesson.passed_by`/`Lesson#passed_by?`. This doesn't apply to predicates that are inherently a computation over an ordered sibling collection per user (e.g. lock-state derivation) — those stay as plain Ruby methods on the association.

This convention is enforced by code review, not CI.

## Migrations (apps/api)

New migrations define explicit `up`/`down` methods, not `change` — even for migrations `change` could auto-reverse (like a plain `create_table`) — so a revert never depends on Rails successfully inferring the inverse. See `db/migrate/20260726180001_create_journeys.rb` for the reference shape. Pre-existing migrations already on `main` are not retrofitted.

This convention is enforced by code review, not CI.

## TypeScript file structure (apps/web)

Within a file, order type/interface declarations before the functions/consts that use them — not interspersed, and not after. See `src/lib/curriculum.ts` (all `interface`/`type` declarations up top, implementation below) or `src/helpers/jsonApi.ts` for the reference shape. A single component's own props `interface` immediately above that component (`Badge.tsx`, `Field.tsx`, etc.) already satisfies this — the rule is about not letting a type declaration trail behind code that doesn't need it yet, not about hoisting every type to the literal first line.

`src/lib/` holds modules with real behavior or state (the API client, auth actions, the curriculum domain layer) — one exported concern per file, not a grab-bag (`accessToken.ts`, `ApiError.ts`, `httpClient.ts`, `auth.ts` are four files, not one `api.ts`). `src/helpers/` holds pure, stateless utility functions with no module-level state and no side effects (e.g. `jsonApi.ts`'s envelope parsing). If a file doesn't hold onto anything and doesn't call `fetch`, it's a helper, not a lib.

This convention is enforced by code review, not CI.

## Components (apps/web)

Every component in `src/components/` accepts an optional `testId?: string` prop, applied as `data-testid={testId}` on the component's root DOM node, defaulting to a kebab-case name for that component (e.g. `Badge` defaults to `"badge"`) so it's always identifiable for future e2e tests even when the caller doesn't pass one explicitly. See `Badge.tsx`/`UnitCard.tsx` for the reference shape. A component with no single root element it controls (e.g. one that returns a bare `Fragment`) should get a wrapping element specifically so it has somewhere to put the test id, rather than skipping the prop.

Icon components (`src/components/icons/`) are exempt — they're leaf visual elements referenced by their parent's `testId`, not targeted directly in e2e tests.

This convention is enforced by code review, not CI.

## Route components (apps/web)

A route's component stays a thin renderer: data fetching, mutations, and derived-state decisions (which view to show, filtered lists, etc.) live in a colocated hook, not inline `if`s scattered through the component body. This uses composition (folder-per-route), not a naming trick: once a route needs a hook, it moves from a flat `src/routes/<name>.tsx` file into `src/routes/<name>/index.tsx`, with the hook alongside it — `useFile.ts` for a single hook, a `hooks/` subfolder for multiple. `vite.config.ts`'s `routeFileIgnorePattern` excludes both colocated tests (`*.test.tsx`) and colocated hooks (`use*.ts`) from TanStack Router's route generation, so no special filename prefix is needed. See `src/routes/home/` (`index.tsx` + `useHome.ts` + `index.test.tsx`) for the reference shape. A route with no extracted hook (nothing to colocate) stays a flat file — see `login.tsx`/`signup.tsx`/`onboarding.tsx`.

The hook returns a small discriminated union describing what the screen should render (e.g. `{ status: "loading" }` / `{ status: "not_started", journeys, onStart, ... }`); the component does a single `switch` over `status` purely to pick JSX, with no business logic of its own.

**Note**: moving a route from `<name>.tsx` to `<name>/index.tsx` changes its canonical path to have a trailing slash (e.g. `/home` -> `/home/`) — TanStack Router still resolves the no-slash form to the same route, but be aware of this when adding a hook to a previously-flat route.

This convention is enforced by code review, not CI.

## i18n (apps/web)

Every user-facing string outside `.stories.tsx` files (Storybook's component gallery renders fixed English on purpose) goes through [react-i18next](https://react.i18next.com/), not a hardcoded literal in JSX. Add the string to `src/locales/en.json` under a section named after the route/component it belongs to (e.g. `home.*`, `login.*`), then reference it via `useTranslation()`'s `t()` in a component, or the `i18n` singleton exported from `src/i18n.ts` in a plain (non-component) function that can't call hooks — see `components/lockStatus.tsx` for that shape. Use `{{placeholder}}` interpolation for dynamic values (`t("home.inProgressMeta", { completed, total })`) rather than string-concatenating a translated fragment with a raw value.

This convention is enforced by code review, not CI.

## Styling (apps/web)

Styling uses [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config via `@tailwindcss/vite`) — see [ADR-0012](docs/adr/0012-tailwind-css-for-apps-web.md). Components style via inline utility classes in JSX, not `@apply`; the React component (`src/components/`) is the reuse boundary, not a CSS class. The current design tokens (colors, spacing, DM Sans) live in a `@theme` block in `src/index.css` — reuse those (`bg-accent`, `text-danger`, etc.) instead of hardcoding hex values or arbitrary Tailwind values. `flows.html`/`foundations.html` (the Claude Design mockups) are exempt — they stay hand-rolled CSS.

This convention is enforced by code review, not CI.

## Parallel agent work

Every ticket — solo or parallel — is implemented in its own git worktree, not in the main checkout. This applies even when only one agent is working: it keeps the main checkout clean and means running a second ticket in parallel later needs no special-casing.

**Location and naming**: worktrees live at `.worktrees/<branch-name>` inside the repo root (gitignored), named identically to the ticket's branch — `<issue-number>-<kebab-case-issue-title>`, the same name GitHub's "Create a branch for this issue" button generates and AGENTS.md's branch convention already uses. They can't live outside the repo: `.devcontainer/docker-compose.yml` only mounts the repo root (`..:/workspace`), so anything outside it is invisible inside the devcontainer.

```
git worktree add .worktrees/42-add-jwt-refresh-tokens 42-add-jwt-refresh-tokens
```

**Setup**: a fresh worktree checkout has no `vendor/bundle` or `node_modules` — git worktrees share `.git` but not the working directory contents — and no `config/master.key` or `.env*`, since those are gitignored per-machine files that only exist in the main checkout. Setup runs automatically via a Lefthook `post-checkout` hook ([ADR-0011](docs/adr/0011-lefthook-post-checkout-hook-for-worktree-setup.md), extending [ADR-0010](docs/adr/0010-lefthook-for-git-hook-backpressure.md)'s existing tool, rather than a separate manual script agents have to remember): when a checkout lands in a worktree missing `vendor/bundle` or `node_modules`, the hook runs `bundle install` and `pnpm install`, and copies `config/master.key`/`.env*` from the main worktree if they're missing. Git worktrees share hook config (`.git/hooks` is common across all of them), so this fires without per-worktree setup.

**No per-worktree database isolation**: parallel worktrees share the one Postgres container (`.devcontainer/docker-compose.yml`). Test runs across worktrees are serialized rather than given isolated database names — simpler setup, at the cost of agents needing to avoid running tests in two worktrees at the exact same moment.
