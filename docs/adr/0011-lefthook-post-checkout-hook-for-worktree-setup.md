---
status: accepted
date: 2026-07-24
decision-makers: Bruno Martins
---

# Lefthook post-checkout hook for git worktree environment setup

Every ticket is implemented in its own git worktree at `.worktrees/<branch-name>` (see [CONTRIBUTING.md](../../CONTRIBUTING.md#parallel-agent-work)), not the main checkout. Worktrees share `.git` — including hook config — but not the working directory, so a freshly created worktree has none of the gitignored, per-machine files the app needs to run: no `vendor/bundle`, no `node_modules`, no `config/master.key`/`.env*`. Rather than a standalone setup script agents must remember to run by hand after `git worktree add`, a Lefthook `post-checkout` hook extends [ADR-0010](0010-lefthook-for-git-hook-backpressure.md)'s existing tool: when a checkout lands in a worktree missing `vendor/bundle` or `node_modules`, it runs `bundle install` and `pnpm install`, and copies `config/master.key`/`.env*` from the main worktree if they're missing. Because git worktrees share hook config, this fires with no per-worktree setup step.

## Considered Options

Manual setup script, invoked by hand after `git worktree add` — rejected: relies on the agent remembering an extra step every time a worktree is created, with no enforcement if skipped, unlike a hook that fires automatically on checkout.

## Consequences

Parallel worktrees still share the one Postgres container from `.devcontainer/docker-compose.yml` — no per-worktree database isolation. Test runs across worktrees must be serialized rather than given isolated database names; this is a deliberate simplicity trade-off, not an oversight.
