# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, etc.) working in this repo.

`CLAUDE.md` is a symlink to this file, per the [agents.md](https://agents.md/) convention — edit this file, both tools read it.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues, managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical triage labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Dev environment

All development, including Claude Code itself, runs inside the project's dev container (`.devcontainer/`) — never on the host directly. Open/rebuild via "Dev Containers: Reopen in Container," then run `claude` from the container's integrated terminal. Services: `app` (Ruby, Node, gh CLI, Claude Code via the official [devcontainer feature](https://github.com/anthropics/devcontainer-features)) and `postgres`, orchestrated by `.devcontainer/docker-compose.yml`.

## Feature workflow

For any new feature or idea, always run the Matt Pocock skills main flow, in order:

1. `/grill-with-docs` — sharpen the idea by interview, retaining decisions in `CONTEXT.md` / ADRs.
2. `/to-spec` — collapse the grilled thread into a buildable spec.
3. `/to-tickets` — split the spec into tracer-bullet tickets with blocking edges.
4. `/implement` — build each ticket (drives `/tdd` internally, then `/code-review` before committing).
5. `/code-review` — review the diff (Standards + Spec) before merging, if not already run by `/implement`.

Keep steps 1–3 in one unbroken context window (don't compact/clear until after `/to-tickets`); `/implement` starts fresh per ticket.

Each ticket is implemented on its own branch and merged via its own PR — never bundle multiple tickets into one PR. Branch name: `<issue-number>-<kebab-case-issue-title>` (e.g. `42-add-jwt-refresh-tokens`), matching the ticket's GitHub issue.

Every ticket is implemented in its own git worktree, not the main checkout — see [CONTRIBUTING.md's "Parallel agent work"](CONTRIBUTING.md#parallel-agent-work) for the worktree location/naming and setup convention.

## Commit style

All commits follow [Commitizen](https://commitizen-tools.github.io/commitizen/)/[Conventional Commits](https://www.conventionalcommits.org/): `<type>(<optional scope>): <description>`, imperative mood, description lowercase and no trailing period. Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`. Add a body when the *why* isn't obvious from the subject alone.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- The post-commit hook rebuilds `graphify-out/` in the background. Check `git status --short` after committing (wait on `~/.cache/graphify-rebuild.log` if the rebuild is still running) and commit/push the result as its own `chore: rebuild graphify graph after <change>` commit — don't leave it dangling.
