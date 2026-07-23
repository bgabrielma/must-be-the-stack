# Graph Report - .  (2026-07-23)

## Corpus Check
- Corpus is ~13,839 words - fits in a single context window. You may not need a graph.

## Summary
- 67 nodes · 104 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.8)
- Token cost: 111,855 input · 0 output

## Community Hubs (Navigation)
- App Domain Model
- graphify Query Commands
- Architecture Decision Records
- Repo Workflow Setup
- graphify Export Formats
- graphify Incremental Update
- graphify Extraction Spec
- graphify Skill & Transcription
- graphify Install Integration
- graphify Build Merge

## God Nodes (most connected - your core abstractions)
1. `CONTEXT.md (domain glossary)` - 14 edges
2. `/graphify Skill Definition (SKILL.md)` - 13 edges
3. `graphify (knowledge graph tool)` - 8 edges
4. `Evaluator` - 7 edges
5. `graphify reference: query.md` - 6 edges
6. `AGENTS.md graphify query-first rules` - 6 edges
7. `graphify reference: exports.md` - 5 edges
8. `graphify reference: update.md` - 5 edges
9. `Subject` - 5 edges
10. `Exercise` - 5 edges

## Surprising Connections (you probably didn't know these)
- `graphify Skill Trigger Config (.claude/CLAUDE.md)` --semantically_similar_to--> `AGENTS.md graphify query-first rules`  [INFERRED] [semantically similar]
  .claude/CLAUDE.md → AGENTS.md
- `AGENTS.md graphify query-first rules` --references--> `--update (incremental re-extraction)`  [EXTRACTED]
  AGENTS.md → .claude/skills/graphify/references/update.md
- `Decision: Solid Queue over Sidekiq for background jobs` --references--> `Evaluator`  [EXTRACTED]
  docs/adr/0005-solid-queue-for-background-jobs.md → CONTEXT.md
- `graphify Skill Trigger Config (.claude/CLAUDE.md)` --references--> `/graphify Skill Definition (SKILL.md)`  [EXTRACTED]
  .claude/CLAUDE.md → .claude/skills/graphify/SKILL.md
- `/graphify Skill Definition (SKILL.md)` --references--> `Semantic extraction subagent prompt`  [EXTRACTED]
  .claude/skills/graphify/SKILL.md → .claude/skills/graphify/references/extraction-spec.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **graphify command family (/query, /path, /explain, /add, --watch, --update, --cluster-only)** — claude_skills_graphify_skill_concept, graphify_query_concept, graphify_path_concept, graphify_explain_concept, graphify_add_concept, graphify_watch_concept, graphify_update_concept, graphify_cluster_only_concept [EXTRACTED 1.00]
- **Project Exercise grading flow (Template Repo, Evaluator, Rubric, Submission)** — context_md_project, context_md_template_repo, context_md_evaluator, context_md_rubric, context_md_submission [EXTRACTED 1.00]
- **Free/minimal-infra architecture principle (GitHub Actions, PWA, Solid Queue)** — docs_adr_0002_decision, docs_adr_0003_decision, docs_adr_0005_decision [EXTRACTED 1.00]

## Communities (10 total, 1 thin omitted)

### Community 0 - "App Domain Model"
Cohesion: 0.28
Nodes (16): Discovery phase, CONTEXT.md (domain glossary), Evaluator, Exercise, Gating / Unlock, Journey, Lesson, Project (+8 more)

### Community 1 - "graphify Query Commands"
Cohesion: 0.24
Nodes (12): AGENTS.md graphify query-first rules, graphify Skill Trigger Config (.claude/CLAUDE.md), graphify reference: add-watch.md, graphify reference: query.md, graphify (knowledge graph tool), /graphify add, /graphify explain, /graphify path (+4 more)

### Community 2 - "Architecture Decision Records"
Cohesion: 0.28
Nodes (8): ADR-0001 doc: Shared curriculum per Subject, ADR-0002 doc: GitHub Actions as Evaluator sandbox, Decision: PWA over native mobile for v1, ADR-0003 doc: PWA over native mobile for v1, Decision: Rails backend + React frontend, split-ecosystem pnpm monorepo, ADR-0004 doc: Polyglot stack, split-ecosystem monorepo, Decision: Solid Queue over Sidekiq for background jobs, ADR-0005 doc: Solid Queue as Active Job backend

### Community 3 - "Repo Workflow Setup"
Cohesion: 0.29
Nodes (4): CLAUDE.md (root, symlink to AGENTS.md), devcontainer app service, devcontainer postgres service, Wayfinder map / child-ticket pattern

### Community 4 - "graphify Export Formats"
Cohesion: 0.40
Nodes (5): graphify reference: exports.md, FalkorDB export, graphify MCP stdio server, Neo4j export, Wiki export (--wiki)

### Community 5 - "graphify Incremental Update"
Cohesion: 0.40
Nodes (5): graphify reference: update.md, --cluster-only, Manifest stamping (only-on-output rule), Semantic extraction cache (per-file, prompt-stamped), --update (incremental re-extraction)

### Community 6 - "graphify Extraction Spec"
Cohesion: 0.50
Nodes (4): graphify reference: extraction-spec.md, Confidence-score rubric (discrete values), Semantic extraction subagent prompt, Node ID format spec ({stem}_{entity})

### Community 7 - "graphify Skill & Transcription"
Cohesion: 0.50
Nodes (4): graphify reference: github-and-merge.md, graphify reference: transcribe.md, /graphify Skill Definition (SKILL.md), Whisper video/audio transcription

### Community 8 - "graphify Install Integration"
Cohesion: 0.67
Nodes (3): graphify reference: hooks.md, graphify claude install (native CLAUDE.md integration), graphify post-commit hook

## Knowledge Gaps
- **13 isolated node(s):** `graphify reference: github-and-merge.md`, `devcontainer postgres service`, `CLAUDE.md (root, symlink to AGENTS.md)`, `Discovery phase`, `Streak` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AGENTS.md graphify query-first rules` connect `graphify Query Commands` to `Repo Workflow Setup`, `graphify Incremental Update`?**
  _High betweenness centrality (0.511) - this node is a cross-community bridge._
- **Why does `/graphify Skill Definition (SKILL.md)` connect `graphify Skill & Transcription` to `graphify Query Commands`, `graphify Export Formats`, `graphify Incremental Update`, `graphify Extraction Spec`, `graphify Install Integration`, `graphify Build Merge`?**
  _High betweenness centrality (0.476) - this node is a cross-community bridge._
- **Why does `CONTEXT.md (domain glossary)` connect `App Domain Model` to `Architecture Decision Records`?**
  _High betweenness centrality (0.323) - this node is a cross-community bridge._
- **What connects `graphify reference: github-and-merge.md`, `devcontainer postgres service`, `CLAUDE.md (root, symlink to AGENTS.md)` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._