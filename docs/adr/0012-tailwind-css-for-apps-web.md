---
status: accepted
date: 2026-07-27
decision-makers: Bruno Martins
---

# Tailwind CSS v4 for apps/web styling

`apps/web` adopts Tailwind CSS v4 (CSS-first config via `@tailwindcss/vite`) as its only styling system, fully replacing the hand-rolled `index.css` (CSS custom properties + BEM-style classes like `.btn-primary`/`.unit-card`). The current design tokens (colors, spacing, DM Sans) are preserved via a `@theme` block rather than reset to Tailwind's stock defaults, so the app stays visually identical to the approved Claude Design mockups — three of the four accent colors already coincide exactly with Tailwind's default palette (`accent` = `blue-600`, `danger` = `red-600`, `warning` = `amber-700`), which is a strong signal the mockups were designed against that palette even though the mockup HTML itself doesn't use Tailwind. Components style via inline utility classes in JSX, not `@apply` — the React component (already extracted into `src/components/`) is the reuse boundary, and `@apply` would just rebuild the old custom-property system under a different name while going against Tailwind's own current guidance. `flows.html`/`foundations.html` are left as hand-rolled CSS: they render pixel-identical once tokens match, and converting them would require adding a Tailwind CDN dependency to otherwise self-contained mockup files for no visual benefit.

## Considered Options

- **Coexistence** (Tailwind for new work, old classes stay) — rejected: running two styling languages side by side is the exact inconsistency CONTRIBUTING.md's DRY/KISS principles warn against, and the surface area was still small enough (one shipped feature) to standardize now.
- **Reset to Tailwind's stock theme** — rejected: would drift the `success` color and spacing scale away from the approved mockups for no benefit.
- **Semantic classes via `@apply`** — rejected: reintroduces a CSS file to maintain and contradicts Tailwind's own recommended usage.

## Consequences

The in-flight `5-curriculum-browse-gating` branch — the only frontend code that existed at the time of this decision — was migrated in full before merge rather than left on the old system.
