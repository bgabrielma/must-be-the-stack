# Graph Report - 3-background-jobs-infra  (2026-07-24)

## Corpus Check
- 88 files · ~26,417 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 321 nodes · 320 edges · 61 communities (51 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3e70bf77`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- /graphify Skill Definition (SKILL.md)
- CONTEXT.md (domain glossary)
- AGENTS.md (agent instructions)
- graphify (knowledge graph tool)
- docs/adr (Architecture Decision Records)
- Stack (README section)
- Domain (README section)
- graphify reference: update.md
- graphify reference: exports.md
- devcontainer app service
- graphify reference: add-watch.md
- Lefthook for git-hook backpressure across the split monorepo
- JWT access tokens + opaque refresh tokens, hand-rolled on Rails 8's built-in auth
- index.tsx
- Contributing
- graphify-post-checkout.sh
- Gemini 3.6 Flash as the runtime LLM provider
- REST + JSON:API response format via active_model_serializers
- ApplicationMailer
- PingSerializer
- Application
- CreatePings
- tsconfig.json
- docker-entrypoint
- api/README.md
- __root.tsx
- setup-worktree.sh

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 15 edges
3. `CONTEXT.md (domain glossary)` - 15 edges
4. `/graphify Skill Definition (SKILL.md)` - 13 edges
5. `AGENTS.md (agent instructions)` - 9 edges
6. `graphify (knowledge graph tool)` - 8 edges
7. `Stack (README section)` - 8 edges
8. `Evaluator` - 7 edges
9. `Feature workflow (Matt Pocock skills main flow)` - 7 edges
10. `scripts` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Dev environment (README section)` --semantically_similar_to--> `Dev environment (AGENTS.md)`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Domain (README section)` --references--> `CONTEXT.md (domain glossary)`  [EXTRACTED]
  README.md → CONTEXT.md
- `AGENTS.md (agent instructions)` --references--> `CLAUDE.md (symlink to AGENTS.md)`  [EXTRACTED]
  AGENTS.md → CLAUDE.md
- `Working with this repo (README section)` --references--> `Domain docs`  [EXTRACTED]
  README.md → AGENTS.md
- `Decision: Shared curriculum per Subject, not per-user generation` --references--> `Subject`  [EXTRACTED]
  docs/adr/0001-shared-curriculum-per-subject.md → CONTEXT.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Feature workflow pipeline (grill → spec → tickets → implement → review)** — agents_grill_with_docs, agents_to_spec, agents_to_tickets, agents_implement, agents_code_review [EXTRACTED 1.00]
- **Split-ecosystem monorepo composition (backend + frontend)** — readme_monorepo, readme_backend, readme_frontend [EXTRACTED 1.00]
- **Journey/Subject/Lesson/Exercise domain model** — readme_journey, readme_subject, readme_lesson, readme_exercise [EXTRACTED 1.00]
- **graphify command family (/query, /path, /explain, /add, --watch, --update, --cluster-only)** — claude_skills_graphify_skill_concept, graphify_query_concept, graphify_path_concept, graphify_explain_concept, graphify_add_concept, graphify_watch_concept, graphify_update_concept, graphify_cluster_only_concept [EXTRACTED 1.00]
- **Project Exercise grading flow (Template Repo, Evaluator, Rubric, Submission)** — context_md_project, context_md_template_repo, context_md_evaluator, context_md_rubric, context_md_submission [EXTRACTED 1.00]
- **Free/minimal-infra architecture principle (GitHub Actions, PWA, Solid Queue)** — docs_adr_0002_decision, docs_adr_0003_decision, docs_adr_0005_decision [EXTRACTED 1.00]

## Communities (61 total, 10 thin omitted)

### Community 0 - "/graphify Skill Definition (SKILL.md)"
Cohesion: 0.08
Nodes (34): graphify Skill Trigger Config (.claude/CLAUDE.md), graphify reference: add-watch.md, graphify reference: exports.md, graphify reference: extraction-spec.md, graphify reference: github-and-merge.md, graphify reference: hooks.md, graphify reference: query.md, graphify reference: transcribe.md (+26 more)

### Community 1 - "CONTEXT.md (domain glossary)"
Cohesion: 0.16
Nodes (26): Domain docs, Discovery phase, CONTEXT.md (domain glossary), Evaluator, Exercise, Gating / Unlock, Journey, Lesson (+18 more)

### Community 2 - "AGENTS.md (agent instructions)"
Cohesion: 0.10
Nodes (24): /code-review step, Commit style, Dev environment (AGENTS.md), Feature workflow (Matt Pocock skills main flow), graphify (AGENTS.md), /grill-with-docs step, /implement step, Issue tracker (+16 more)

### Community 3 - "graphify (knowledge graph tool)"
Cohesion: 0.07
Nodes (27): devDependencies, jsdom, oxlint, @tanstack/router-plugin, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event, @types/node (+19 more)

### Community 4 - "docs/adr (Architecture Decision Records)"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 5 - "Stack (README section)"
Cohesion: 0.10
Nodes (19): dependencies, react, react-dom, @tanstack/react-query, @tanstack/react-router, name, private, scripts (+11 more)

### Community 6 - "Domain (README section)"
Cohesion: 0.43
Nodes (7): Domain (README section), Exercise, Journey, Lesson, Project (Exercise type), Quiz (Exercise type), Subject

### Community 7 - "graphify reference: update.md"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 8 - "graphify reference: exports.md"
Cohesion: 0.12
Nodes (9): API, ApplicationController, PingsController, ApplicationJob, Base, PingNotificationJob, ApplicationRecord, Base (+1 more)

### Community 10 - "graphify reference: add-watch.md"
Cohesion: 0.13
Nodes (13): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, queryClient, Register, router (+5 more)

### Community 11 - "Lefthook for git-hook backpressure across the split monorepo"
Cohesion: 0.18
Nodes (9): Contributing, Parallel agent work, Principles, Consequences, Considered Options, Lefthook for git-hook backpressure across the split monorepo, Consequences, Considered Options (+1 more)

### Community 12 - "JWT access tokens + opaque refresh tokens, hand-rolled on Rails 8's built-in auth"
Cohesion: 0.25
Nodes (6): Consequences, Considered Options, JWT access tokens + opaque refresh tokens, hand-rolled on Rails 8's built-in auth, Consequences, Considered Options, Self-hosted VPS for Rails + Postgres, Cloudflare Pages for the frontend, GitHub Actions CI/CD with ordered deploy

### Community 13 - "index.tsx"
Cohesion: 0.50
Nodes (4): fetchPings(), Index(), PingsResponse, Route

### Community 14 - "Contributing"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 15 - "graphify-post-checkout.sh"
Cohesion: 0.50
Nodes (3): GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED, graphify-post-checkout.sh script

### Community 16 - "Gemini 3.6 Flash as the runtime LLM provider"
Cohesion: 0.50
Nodes (3): Consequences, Considered Options, Gemini 3.6 Flash as the runtime LLM provider

### Community 17 - "REST + JSON:API response format via active_model_serializers"
Cohesion: 0.50
Nodes (3): Consequences, Considered Options, REST + JSON:API response format via active_model_serializers

## Knowledge Gaps
- **118 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+113 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `graphify (knowledge graph tool)` to `Stack (README section)`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `CONTEXT.md (domain glossary)` connect `CONTEXT.md (domain glossary)` to `Domain (README section)`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Domain (README section)` connect `Domain (README section)` to `CONTEXT.md (domain glossary)`, `AGENTS.md (agent instructions)`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _118 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `/graphify Skill Definition (SKILL.md)` be split into smaller, more focused modules?**
  _Cohesion score 0.0766488413547237 - nodes in this community are weakly interconnected._
- **Should `AGENTS.md (agent instructions)` be split into smaller, more focused modules?**
  _Cohesion score 0.09846153846153846 - nodes in this community are weakly interconnected._
- **Should `graphify (knowledge graph tool)` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._