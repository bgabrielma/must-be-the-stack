---
status: accepted
date: 2026-07-23
decision-makers: Bruno Martins
---

# Shared curriculum per Subject, not per-user generation

Every user of a given Subject gets the same Lessons and Rubrics, generated once and reviewed before launch; personalization is limited to which Lessons a user sees and in what order. We rejected per-user generation because the Evaluator needs one reviewable Rubric per Project — per-user rubrics would make grading consistency and QA unbounded.

## Considered Options
Per-user generated curriculum — rejected: no single Rubric to review per Project, so grading consistency and QA effort scale with user count instead of Subject count.

## Consequences
"Customizable experience" is limited to which Lessons a user is routed through (via onboarding profile), not unique content. Curriculum content can be pre-seeded and reviewed once before any user sees it.
