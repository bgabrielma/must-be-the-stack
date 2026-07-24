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

## Parallel agent work

Every ticket — solo or parallel — is implemented in its own git worktree, not in the main checkout. This applies even when only one agent is working: it keeps the main checkout clean and means running a second ticket in parallel later needs no special-casing.

**Location and naming**: worktrees live at `.worktrees/<branch-name>` inside the repo root (gitignored), named identically to the ticket's branch — `<issue-number>-<kebab-case-issue-title>`, the same name GitHub's "Create a branch for this issue" button generates and AGENTS.md's branch convention already uses. They can't live outside the repo: `.devcontainer/docker-compose.yml` only mounts the repo root (`..:/workspace`), so anything outside it is invisible inside the devcontainer.

```
git worktree add .worktrees/42-add-jwt-refresh-tokens 42-add-jwt-refresh-tokens
```

**Setup**: a fresh worktree checkout has no `vendor/bundle` or `node_modules` — git worktrees share `.git` but not the working directory contents — and no `config/master.key` or `.env*`, since those are gitignored per-machine files that only exist in the main checkout. Setup runs automatically via a Lefthook `post-checkout` hook ([ADR-0011](docs/adr/0011-lefthook-post-checkout-hook-for-worktree-setup.md), extending [ADR-0010](docs/adr/0010-lefthook-for-git-hook-backpressure.md)'s existing tool, rather than a separate manual script agents have to remember): when a checkout lands in a worktree missing `vendor/bundle` or `node_modules`, the hook runs `bundle install` and `pnpm install`, and copies `config/master.key`/`.env*` from the main worktree if they're missing. Git worktrees share hook config (`.git/hooks` is common across all of them), so this fires without per-worktree setup.

**No per-worktree database isolation**: parallel worktrees share the one Postgres container (`.devcontainer/docker-compose.yml`). Test runs across worktrees are serialized rather than given isolated database names — simpler setup, at the cost of agents needing to avoid running tests in two worktrees at the exact same moment.
