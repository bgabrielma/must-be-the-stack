# must-be-the-stack

A gamified developer-learning app: delivers one concept at a time toward a study goal (e.g. system design), evaluates the learner's understanding, and gates progress until they demonstrate it.

## Domain

Users pursue a **Journey** (e.g. "Software Design"), made up of **Subjects** (e.g. "Cache"), each broken into **Lessons** that end in a graded **Exercise** (a **Quiz** or a **Project**). See [CONTEXT.md](CONTEXT.md) for the full domain model.

## Stack

- **Backend**: Ruby on Rails
- **Frontend**: React (Vite, TanStack Query, TanStack Router, Vitest)
- **Monorepo**: pnpm-managed, `apps/api` (Bundler) + `apps/web` (pnpm) as a split-ecosystem monorepo
- **Background jobs**: Solid Queue (Postgres-backed)
- **Project grading**: GitHub Actions as the Evaluator's execution sandbox
- **Delivery**: PWA (not native)

Architectural decisions and their rationale live in [docs/adr](docs/adr).

## Dev environment

All development runs inside the project's dev container (`.devcontainer/`) — never on the host directly. Open/rebuild via "Dev Containers: Reopen in Container," then run `claude` from the container's integrated terminal. Services: `app` (Ruby, Node, gh CLI) and `postgres`, orchestrated by `.devcontainer/docker-compose.yml`.

## Working with this repo

See [AGENTS.md](AGENTS.md) for the agent/contributor workflow: issue tracking, triage labels, domain docs, and the feature workflow (`/grill-with-docs` → `/to-spec` → `/to-tickets` → `/implement` → `/code-review`).
