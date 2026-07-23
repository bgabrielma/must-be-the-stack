---
status: accepted
date: 2026-07-23
decision-makers: Bruno Martins
---

# Polyglot stack: Rails backend, React frontend, split-ecosystem monorepo

The backend is Ruby on Rails and the frontend is React (Vite, TanStack Query, TanStack Router, Vitest), living in one pnpm-managed monorepo as `apps/api` (Bundler) and `apps/web` (pnpm), rather than a single TypeScript stack end to end. The driver was deliberate: the user wants the Rails experience, not just the fastest path to shipping. pnpm workspaces only manage the JS/TS side — `apps/api` is not a pnpm workspace member and has its own dependency lifecycle.

## Considered Options
Full TypeScript stack (Rails-free, single package manager, single dependency ecosystem) — rejected: doesn't serve the goal of gaining Rails experience, even though it would have been the more uniform monorepo.

## Consequences
Two dependency ecosystems and toolchains to maintain (Bundler + pnpm), two sets of CI setup, no shared types between backend and frontend without an explicit contract (e.g. generated API types) — API contracts must be deliberately kept in sync rather than inferred from shared TS types.
