# Graph Report - must-be-the-stack  (2026-07-24)

## Corpus Check
- 28 files · ~15,655 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 112 nodes · 158 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e04422ce`
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

## God Nodes (most connected - your core abstractions)
1. `CONTEXT.md (domain glossary)` - 15 edges
2. `/graphify Skill Definition (SKILL.md)` - 13 edges
3. `AGENTS.md (agent instructions)` - 9 edges
4. `graphify (knowledge graph tool)` - 8 edges
5. `Stack (README section)` - 8 edges
6. `Evaluator` - 7 edges
7. `Feature workflow (Matt Pocock skills main flow)` - 7 edges
8. `graphify reference: query.md` - 6 edges
9. `Domain (README section)` - 6 edges
10. `Working with this repo (README section)` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Dev environment (README section)` --semantically_similar_to--> `Dev environment (AGENTS.md)`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Domain (README section)` --references--> `CONTEXT.md (domain glossary)`  [EXTRACTED]
  README.md → CONTEXT.md
- `Decision: Solid Queue over Sidekiq for background jobs` --references--> `Evaluator`  [EXTRACTED]
  docs/adr/0005-solid-queue-for-background-jobs.md → CONTEXT.md
- `AGENTS.md (agent instructions)` --references--> `CLAUDE.md (symlink to AGENTS.md)`  [EXTRACTED]
  AGENTS.md → CLAUDE.md
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

## Communities (11 total, 1 thin omitted)

### Community 0 - "/graphify Skill Definition (SKILL.md)"
Cohesion: 0.09
Nodes (24): graphify Skill Trigger Config (.claude/CLAUDE.md), graphify reference: exports.md, graphify reference: extraction-spec.md, graphify reference: github-and-merge.md, graphify reference: hooks.md, graphify reference: transcribe.md, graphify reference: update.md, /graphify Skill Definition (SKILL.md) (+16 more)

### Community 1 - "CONTEXT.md (domain glossary)"
Cohesion: 0.28
Nodes (16): Discovery phase, CONTEXT.md (domain glossary), Evaluator, Exercise, Gating / Unlock, Journey, Lesson, Project (+8 more)

### Community 2 - "AGENTS.md (agent instructions)"
Cohesion: 0.13
Nodes (18): /code-review step, Commit style, Dev environment (AGENTS.md), Domain docs, Feature workflow (Matt Pocock skills main flow), graphify (AGENTS.md), /grill-with-docs step, /implement step (+10 more)

### Community 3 - "graphify (knowledge graph tool)"
Cohesion: 0.27
Nodes (10): graphify reference: add-watch.md, graphify reference: query.md, graphify (knowledge graph tool), /graphify add, /graphify explain, /graphify path, /graphify query, Constrained query vocabulary expansion (+2 more)

### Community 4 - "docs/adr (Architecture Decision Records)"
Cohesion: 0.33
Nodes (9): ADR-0001 doc: Shared curriculum per Subject, ADR-0002 doc: GitHub Actions as Evaluator sandbox, Decision: PWA over native mobile for v1, ADR-0003 doc: PWA over native mobile for v1, Decision: Rails backend + React frontend, split-ecosystem pnpm monorepo, ADR-0004 doc: Polyglot stack, split-ecosystem monorepo, Decision: Solid Queue over Sidekiq for background jobs, ADR-0005 doc: Solid Queue as Active Job backend (+1 more)

### Community 5 - "Stack (README section)"
Cohesion: 0.38
Nodes (7): Backend: Ruby on Rails, Background jobs: Solid Queue (Postgres-backed), Delivery: PWA (not native), Frontend: React (Vite, TanStack Query, TanStack Router, Vitest), Monorepo: pnpm-managed split-ecosystem (apps/api + apps/web), Project grading: GitHub Actions as Evaluator's execution sandbox, Stack (README section)

### Community 6 - "Domain (README section)"
Cohesion: 0.43
Nodes (7): Domain (README section), Exercise, Journey, Lesson, Project (Exercise type), Quiz (Exercise type), Subject

### Community 7 - "graphify reference: update.md"
Cohesion: 0.25
Nodes (6): Consequences, Considered Options, JWT access tokens + opaque refresh tokens, hand-rolled on Rails 8's built-in auth, Consequences, Considered Options, Self-hosted VPS for Rails + Postgres, Cloudflare Pages for the frontend, GitHub Actions CI/CD with ordered deploy

### Community 8 - "graphify reference: exports.md"
Cohesion: 0.50
Nodes (3): Consequences, Considered Options, Gemini 3.6 Flash as the runtime LLM provider

### Community 10 - "graphify reference: add-watch.md"
Cohesion: 0.50
Nodes (3): Consequences, Considered Options, REST + JSON:API response format via active_model_serializers

## Knowledge Gaps
- **31 isolated node(s):** `Considered Options`, `Consequences`, `Considered Options`, `Consequences`, `Considered Options` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CONTEXT.md (domain glossary)` connect `CONTEXT.md (domain glossary)` to `docs/adr (Architecture Decision Records)`, `Domain (README section)`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `Domain (README section)` connect `Domain (README section)` to `CONTEXT.md (domain glossary)`, `AGENTS.md (agent instructions)`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `must-be-the-stack (project overview)` connect `AGENTS.md (agent instructions)` to `Stack (README section)`, `Domain (README section)`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `Considered Options`, `Consequences`, `Considered Options` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `/graphify Skill Definition (SKILL.md)` be split into smaller, more focused modules?**
  _Cohesion score 0.09420289855072464 - nodes in this community are weakly interconnected._
- **Should `AGENTS.md (agent instructions)` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._