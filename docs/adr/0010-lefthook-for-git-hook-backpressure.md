---
status: accepted
date: 2026-07-24
decision-makers: Bruno Martins
---

# Lefthook for git-hook backpressure across the split monorepo

Pre-commit/pre-push enforcement (lint, unit tests, etc.) runs via Lefthook rather than Husky. Lefthook is a single Go binary with no ecosystem lock-in, so one config gates both `apps/api` (RSpec, RuboCop via Bundler) and `apps/web` (Vitest, ESLint via pnpm) commands. Husky is JS/npm-native (installs via `package.json`'s `prepare` script) and doesn't reach the Ruby side without a hand-wired shell script shelling out to Bundler commands — the two ecosystems don't share hook config through it. This is consistent with the stack's minimal-infra pattern already set by [ADR-0002](0002-github-actions-as-evaluator-sandbox.md) (GitHub Actions over self-hosted sandboxing) and [ADR-0005](0005-solid-queue-for-background-jobs.md) (Solid Queue over Sidekiq+Redis): one tool covering both ecosystems, not ecosystem-specific glue.

## Considered Options
Husky — rejected: JS/npm-native only; reaching the Rails side requires a hand-wired shell script rather than native config, unlike Lefthook which gates both ecosystems from one file.

## Consequences
One more dev-environment dependency (Lefthook binary) needs installing in `.devcontainer/` alongside Ruby/Node so hooks work inside the container, not just on a host machine that happens to have it. Hook config (`lefthook.yml`) lives at the monorepo root and must be kept in sync as new lint/test commands are added to either `apps/api` or `apps/web`.
