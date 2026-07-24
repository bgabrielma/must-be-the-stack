---
status: accepted
date: 2026-07-23
decision-makers: Bruno Martins
---

# Shared curriculum per Subject, not per-user generation

Every user of a given Subject gets the same Lessons and Rubrics, generated once and reviewed before launch; personalization is limited to which Lessons a user sees and in what order. We rejected per-user generation because the Evaluator needs one reviewable Rubric per Project — per-user rubrics would make grading consistency and QA unbounded. Generation itself is a manual, developer-authored workflow, not a runtime pipeline: the developer sits with their own Claude subscription (claude.ai / Claude Code) to research and author each Subject's Lessons and Rubrics, then commits the result as static seed data. This is separate from [ADR-0006](0006-gemini-as-llm-provider.md)'s runtime LLM provider, which only handles grading and chat once a Subject is live.

## Considered Options
Per-user generated curriculum — rejected: no single Rubric to review per Project, so grading consistency and QA effort scale with user count instead of Subject count.

## Consequences
"Customizable experience" is limited to which Lessons a user is routed through (via onboarding profile), not unique content. Curriculum content can be pre-seeded and reviewed once before any user sees it.
