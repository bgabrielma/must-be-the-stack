# Graph Report - 5-curriculum-browse-gating  (2026-07-27)

## Corpus Check
- 174 files · ~38,140 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 620 nodes · 782 edges · 104 communities (76 shown, 28 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.69)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `27bb0445`
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
- setup
- api/README.md
- __root.tsx
- index.test.tsx
- setup-worktree.sh
- brakeman
- bundler-audit
- ci
- dev
- boot.rb
- ci.rb
- environment.rb
- development.rb
- production.rb
- test.rb
- active_model_serializers.rb
- cors.rb
- inflections.rb
- puma.rb
- Contributing
- ApplicationRecord
- User
- RefreshToken
- SessionsController
- Subject
- main.ts
- preview.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 15 edges
3. `CONTEXT.md (domain glossary)` - 15 edges
4. `react` - 13 edges
5. `/graphify Skill Definition (SKILL.md)` - 13 edges
6. `ApplicationController` - 10 edges
7. `ApplicationRecord` - 10 edges
8. `setAccessToken()` - 9 edges
9. `AGENTS.md (agent instructions)` - 9 edges
10. `scripts` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Dev environment (README section)` --semantically_similar_to--> `Dev environment (AGENTS.md)`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `Domain (README section)` --references--> `CONTEXT.md (domain glossary)`  [EXTRACTED]
  README.md → CONTEXT.md
- `AGENTS.md (agent instructions)` --references--> `CLAUDE.md (symlink to AGENTS.md)`  [EXTRACTED]
  AGENTS.md → CLAUDE.md
- `Decision: Shared curriculum per Subject, not per-user generation` --references--> `Subject`  [EXTRACTED]
  docs/adr/0001-shared-curriculum-per-subject.md → CONTEXT.md
- `Decision: GitHub Actions as the Evaluator's execution sandbox` --references--> `Submission`  [EXTRACTED]
  docs/adr/0002-github-actions-as-evaluator-sandbox.md → CONTEXT.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Feature workflow pipeline (grill → spec → tickets → implement → review)** — agents_grill_with_docs, agents_to_spec, agents_to_tickets, agents_implement, agents_code_review [EXTRACTED 1.00]
- **Split-ecosystem monorepo composition (backend + frontend)** — readme_monorepo, readme_backend, readme_frontend [EXTRACTED 1.00]
- **Journey/Subject/Lesson/Exercise domain model** — readme_journey, readme_subject, readme_lesson, readme_exercise [EXTRACTED 1.00]
- **graphify command family (/query, /path, /explain, /add, --watch, --update, --cluster-only)** — claude_skills_graphify_skill_concept, graphify_query_concept, graphify_path_concept, graphify_explain_concept, graphify_add_concept, graphify_watch_concept, graphify_update_concept, graphify_cluster_only_concept [EXTRACTED 1.00]
- **Project Exercise grading flow (Template Repo, Evaluator, Rubric, Submission)** — context_md_project, context_md_template_repo, context_md_evaluator, context_md_rubric, context_md_submission [EXTRACTED 1.00]
- **Free/minimal-infra architecture principle (GitHub Actions, PWA, Solid Queue)** — docs_adr_0002_decision, docs_adr_0003_decision, docs_adr_0005_decision [EXTRACTED 1.00]

## Communities (104 total, 28 thin omitted)

### Community 0 - "/graphify Skill Definition (SKILL.md)"
Cohesion: 0.08
Nodes (34): graphify Skill Trigger Config (.claude/CLAUDE.md), graphify reference: add-watch.md, graphify reference: exports.md, graphify reference: extraction-spec.md, graphify reference: github-and-merge.md, graphify reference: hooks.md, graphify reference: query.md, graphify reference: transcribe.md (+26 more)

### Community 1 - "CONTEXT.md (domain glossary)"
Cohesion: 0.16
Nodes (25): Discovery phase, CONTEXT.md (domain glossary), Evaluator, Exercise, Gating / Unlock, Journey, Lesson, Project (+17 more)

### Community 2 - "AGENTS.md (agent instructions)"
Cohesion: 0.08
Nodes (32): /code-review step, Commit style, Dev environment (AGENTS.md), Domain docs, Feature workflow (Matt Pocock skills main flow), graphify (AGENTS.md), /grill-with-docs step, /implement step (+24 more)

### Community 3 - "graphify (knowledge graph tool)"
Cohesion: 0.06
Nodes (31): devDependencies, jsdom, oxlint, storybook, @storybook/react-vite, @tanstack/router-plugin, @testing-library/jest-dom, @testing-library/react (+23 more)

### Community 4 - "docs/adr (Architecture Decision Records)"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 5 - "Stack (README section)"
Cohesion: 0.09
Nodes (21): dependencies, react, react-dom, @tanstack/react-query, @tanstack/react-router, name, private, scripts (+13 more)

### Community 6 - "Domain (README section)"
Cohesion: 0.28
Nodes (3): API, ApplicationController, SignupsController

### Community 7 - "graphify reference: update.md"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 8 - "graphify reference: exports.md"
Cohesion: 0.19
Nodes (4): Authenticatable, Lockable, LessonsController, SubjectsController

### Community 10 - "graphify reference: add-watch.md"
Cohesion: 0.06
Nodes (37): plugins, Banner(), BannerProps, Danger, Info, Story, Success, Field() (+29 more)

### Community 11 - "Lefthook for git-hook backpressure across the split monorepo"
Cohesion: 0.08
Nodes (39): Button(), ButtonProps, Block, Disabled, Primary, Secondary, Small, Story (+31 more)

### Community 12 - "JWT access tokens + opaque refresh tokens, hand-rolled on Rails 8's built-in auth"
Cohesion: 0.21
Nodes (3): JourneysController, Journey, UserJourney

### Community 13 - "index.tsx"
Cohesion: 0.05
Nodes (47): Badge(), BadgeProps, Default, Story, WithoutIcon, CheckIcon(), ChevronRightIcon(), CompassIcon() (+39 more)

### Community 14 - "Contributing"
Cohesion: 0.18
Nodes (5): PingsController, ApplicationJob, Base, PingNotificationJob, Ping

### Community 15 - "graphify-post-checkout.sh"
Cohesion: 0.22
Nodes (8): Code review: done, findings applied, Environment (already set up — verify still running, don't recreate blindly), Final steps (not yet done), Ground truth / non-negotiables from the user this session, Handoff: implementing issue #5 (Curriculum browse + gating), Known gotchas hit this session, What was built (full detail in earlier conversation — this is the summary), Where the work lives

### Community 16 - "Gemini 3.6 Flash as the runtime LLM provider"
Cohesion: 0.33
Nodes (5): rules, react/only-export-components, react/rules-of-hooks, $schema, warn

### Community 17 - "REST + JSON:API response format via active_model_serializers"
Cohesion: 0.25
Nodes (6): Consequences, Considered Options, JWT access tokens + opaque refresh tokens, hand-rolled on Rails 8's built-in auth, Consequences, Considered Options, Self-hosted VPS for Rails + Postgres, Cloudflare Pages for the frontend, GitHub Actions CI/CD with ordered deploy

### Community 27 - "index.test.tsx"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 28 - "setup-worktree.sh"
Cohesion: 0.50
Nodes (3): Consequences, Considered Options, Gemini 3.6 Flash as the runtime LLM provider

### Community 29 - "brakeman"
Cohesion: 0.50
Nodes (3): Consequences, Considered Options, REST + JSON:API response format via active_model_serializers

### Community 30 - "bundler-audit"
Cohesion: 0.50
Nodes (3): GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED, graphify-post-checkout.sh script

### Community 74 - "Contributing"
Cohesion: 0.17
Nodes (10): Contributing, Parallel agent work, Principles, Testing (apps/api), Consequences, Considered Options, Lefthook for git-hook backpressure across the split monorepo, Consequences (+2 more)

### Community 95 - "ApplicationRecord"
Cohesion: 0.25
Nodes (4): ApplicationRecord, Base, Lesson, Submission

## Knowledge Gaps
- **187 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+182 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `graphify reference: add-watch.md` to `Lefthook for git-hook backpressure across the split monorepo`, `index.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `plugins` connect `graphify reference: add-watch.md` to `Gemini 3.6 Flash as the runtime LLM provider`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `ApplicationRecord` connect `ApplicationRecord` to `User`, `RefreshToken`, `Subject`, `JWT access tokens + opaque refresh tokens, hand-rolled on Rails 8's built-in auth`, `Contributing`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _187 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `/graphify Skill Definition (SKILL.md)` be split into smaller, more focused modules?**
  _Cohesion score 0.0766488413547237 - nodes in this community are weakly interconnected._
- **Should `AGENTS.md (agent instructions)` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._
- **Should `graphify (knowledge graph tool)` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._