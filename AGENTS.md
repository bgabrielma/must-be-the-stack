# AGENTS.md

**must-be-the-stack** — a mastery-gated developer-learning PWA: it delivers one concept at a time toward a study goal (e.g. Software Design), grades the learner's understanding, and keeps the next Lesson locked until they pass. Not gamified — there are no points, badges, levels or scoreboards; the unlock *is* the reward.

Rails API + React (Vite) in a split-ecosystem pnpm monorepo. Domain language lives in [CONTEXT.md](CONTEXT.md), decisions in [docs/adr/](docs/adr/), code-level standards in [CONTRIBUTING.md](CONTRIBUTING.md).

`CLAUDE.md` is a symlink to this file, per the [agents.md](https://agents.md/) convention — edit this file, both tools read it.

## Project map

- `packages/api/` — Rails API (Bundler), Postgres, Solid Queue jobs, Gemini as LLM provider
- `apps/web/` — React SPA (pnpm): TanStack Query/Router, Tailwind v4, zod, i18next, Vitest, Storybook
- `packages/e2e/` — Playwright suite (pnpm), a PR-review artifact rather than a regression gate
- `docs/adr/` — architecture decisions · `docs/agents/` — agent workflow docs · `docs/incident/` — bug post-mortems
- `graphify-out/` — knowledge graph of this repo

<important if="you need to run, build, test, lint, or seed anything">

All development runs **inside the dev container** (`.devcontainer/`), never on the host: "Dev Containers: Reopen in Container," then run `claude` from the container's integrated terminal.

`packages/api` (port 3000) and `apps/web` (port 5173) start automatically on container start/attach. Logs: `/tmp/dev-services/{api,web}.log`. To restart one: `kill $(cat /tmp/dev-services/api.pid)` then re-run `.devcontainer/start-services.sh`.

| Command | What it does | Where |
|---|---|---|
| `bin/dev` | Start the Rails API by hand | `packages/api` |
| `bin/setup --skip-server` | Bundle install + `db:prepare` | `packages/api` |
| `bin/rails` / `bin/rake` | Rails and Rake entrypoints | `packages/api` |
| `bundle exec rspec` | Run the API test suite | `packages/api` |
| `bin/ci` | Full local CI: setup, RuboCop, gem audit, Brakeman | `packages/api` |
| `bin/rubocop` | Ruby style | `packages/api` |
| `bin/brakeman` / `bin/bundler-audit` | Security scans | `packages/api` |
| `bin/rails curriculum:seed` | Seed static curriculum (development only) | `packages/api` |
| `bin/rails curriculum:seed_e2e` | Seed curriculum + fixture progress for Playwright (test only) | `packages/api` |
| `pnpm dev` | Vite dev server | `apps/web` |
| `pnpm build` | `vite build && tsc -b` | `apps/web` |
| `pnpm test` | Vitest | `apps/web` |
| `pnpm lint` | oxlint | `apps/web` |
| `pnpm storybook` / `pnpm build-storybook` | Component gallery | `apps/web` |
| `pnpm preview` | Preview a production build | `apps/web` |
| `pnpm test` | Playwright E2E (reuses the running dev servers) | `packages/e2e` |
| `pnpm exec playwright install --with-deps chromium` | One-off browser install if the container predates it | `packages/e2e` |
</important>

<important if="you are answering a question about this codebase, its architecture, or how files relate">

Query the knowledge graph before grepping or broad file reading: `graphify query "<question>"`, `graphify path "<A>" "<B>"`, `graphify explain "<concept>"`. Use `graphify-out/wiki/index.md` for broad navigation and `graphify-out/GRAPH_REPORT.md` only when those don't surface enough.
</important>

<important if="you have just modified code or just committed">

Run `graphify update .` after modifying code (AST-only, no API cost). The post-commit hook rebuilds `graphify-out/` in the background — after committing, check `git status --short` (waiting on `~/.cache/graphify-rebuild.log` if the rebuild is still running) and commit the result as its own `chore: rebuild graphify graph after <change>` commit rather than leaving it dangling.

Only `graph.json`, `graph.html`, `GRAPH_REPORT.md`, `manifest.json`, `.graphify_labels.json(.sig)` and `cache/semantic/` are tracked; everything else under `graphify-out/` is gitignored — never `git add -f` it back.
</important>

<important if="a graph.json merge conflict appears, or you are setting up a fresh clone">

The `merge=graphify` driver in `.gitattributes` only works once that clone has run `graphify hook install` — git does not clone `.git/config`. Without it, `graph.json` conflicts resolve as a plain 3-way merge with conflict markers.
</important>

<important if="you are starting work on a new feature or idea">

Run the main flow in order, keeping steps 1–3 in one unbroken context window (don't compact or clear until after `/to-tickets`):

1. `/grill-with-docs` — sharpen the idea by interview, retaining decisions in `CONTEXT.md` / ADRs
2. `/to-spec` — collapse the grilled thread into a buildable spec, **rewriting the original issue in place** (retitled `Spec: <feature>`, labelled `spec`) rather than opening a second issue for the same feature
3. `/to-tickets` — split the spec into tracer-bullet tickets with blocking edges, each created as a GitHub sub-issue of that spec and labelled `ticket`
4. **Design** — any ticket with user-facing UI is designed in Claude Design (`/design-sync`) before implementing
5. `/implement` — build each ticket (drives `/tdd`, then `/code-review`); starts fresh per ticket
6. `/code-review` — review the diff (Standards + Spec) before merging, if `/implement` didn't already
</important>

<important if="you are implementing a ticket, branching, or opening a PR">

One ticket per branch per PR — never bundle tickets. Branch name: `<issue-number>-<kebab-case-issue-title>` (e.g. `42-add-jwt-refresh-tokens`), matching the ticket's GitHub issue.

Every ticket is implemented in its own git worktree, not the main checkout — see [CONTRIBUTING.md's "Parallel agent work"](CONTRIBUTING.md#parallel-agent-work).

Issues live in this repo's GitHub Issues, managed via `gh` — see `docs/agents/issue-tracker.md` for the spec-vs-ticket title/label convention, and `docs/agents/triage-labels.md` for the five canonical triage labels.
</important>

<important if="you are writing code in packages/api or apps/web">

Code-level conventions live in [CONTRIBUTING.md](CONTRIBUTING.md) — read the section for the area you're touching before writing: testing layout per package, controller param extraction, model guard clauses and scopes, explicit `up`/`down` migrations, TypeScript file structure, component `testId` props, route-component hooks, i18n, Tailwind tokens, and zod response parsing. Domain terms (Journey, Subject, Lesson, Exercise, …) come from [CONTEXT.md](CONTEXT.md) — use them, and their _Avoid_ synonyms never.
</important>

<important if="you are designing or changing user-facing UI">

UI is designed in the **Claude Design** system project (`must-be-the-stack`, via `/design-sync`/`DesignSync`) before `/implement` starts.

- Deliverables are **visual canvas files, never prose** — real rendered HTML/SVG in the iPhone-mockup/Figma-board style of `flows.html` (device-frame screens) and `foundations.html` (component gallery). Rationale goes in a short caption inside the canvas, not a separate markdown spec.
- Any new component or state introduced in a flow screen is added to `foundations.html`'s gallery in the same pass.
- `DesignSync` ordering: `list_files`/`get_file` → `finalize_plan` → `write_files`. `finalize_plan` only reserves the write; always follow through with `write_files` and confirm via `list_files` before reporting design work as done.
</important>

<important if="something is broken, throwing, failing, or slow">

Diagnose with the `diagnosing-bugs` skill, never by guessing at a fix. Its phases are mandatory: reproduction loop first, minimise, hypothesise, instrument, then fix with a regression test.

Every investigation that took real diagnostic work then produces `docs/incident/<issue-number>-<kebab-case-issue-title>.md`, committed with the fix — symptom, what was ruled out, root cause, **every option considered including the rejected ones and why**, outcome, and what would have prevented it. See `docs/agents/incidents.md`; `docs/incident/5-curriculum-browse-gating.md` is the reference example.
</important>

<important if="you are resolving PR review comments">

Don't stop at the flagged instance. If a comment names a *pattern* (a naming convention, a structural rule, a "do this everywhere" ask):

1. Fix the flagged instance.
2. Sweep the rest of the touched app for the same violation (scoped to what the ticket/PR touches — don't rewrite unrelated pre-existing code beyond a small, safe, same-convention fix).
3. Encode the rule in `CONTRIBUTING.md` (code-level) or here in `AGENTS.md` (process), whichever already hosts that kind of rule.

Skip step 3 for genuinely one-off feedback (a typo, a single wrong value).
</important>

<important if="you are writing a commit message">

[Conventional Commits](https://www.conventionalcommits.org/): `<type>(<optional scope>): <description>`, imperative mood, description lowercase and no trailing period. Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`. Add a body when the *why* isn't obvious from the subject.
</important>
