# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

This repo's remote is `bgabrielma/must-be-the-stack`; `gh` infers it automatically from `git remote -v` when run inside the clone.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically when run inside a clone.

## Specs and tickets

Two kinds of issue, and the title says which:

| Kind | Title | Label | What it is |
| --- | --- | --- | --- |
| Spec | `Spec: <feature>` | `spec` | A grilled, buildable feature. The parent of its tickets — there is no separate "epic". |
| Ticket | an imperative phrase, no prefix | `ticket` | One tracer bullet: one branch, one PR. |

**The hierarchy lives in GitHub's sub-issue links, never in the titles.** Titles carry no index, no `[S2.1]`, no parent issue number. An index typed into a title is a second copy of a structure GitHub already stores, and a second copy is a thing that can disagree with the first — which is how this repo briefly ended up with `[S1.8] [S1.8] Socratic Guide chat`. GitHub's own guidance is the same: group with sub-issues, and treat a title convention as decoration rather than as the relationship.

The spec's own issue page is where you read that structure back: it lists its sub-issues with a progress bar, and each ticket shows its parent in the sidebar. From the CLI, `gh issue view <n> --json parent,subIssues,subIssuesSummary`.

Branch names are unchanged: `<issue-number>-<kebab-case-title>`, e.g. #26 → `26-capture-a-profile-after-first-log-in`.

Label names are flat and unprefixed, matching `needs-triage` / `ready-for-agent` / `bug` — never `type:spec` or any other namespaced form.

`spec`/`ticket` say what an issue **is**; the triage labels say what **state** it's in, and the two are orthogonal. A freshly raised feature carries `needs-triage` and no kind label at all, because it isn't a spec until it's been grilled.

**Grilling converts an issue in place.** `/grill-with-docs` → `/to-spec` rewrites the issue it started from — retitle to `[S<n>] <feature>` with the next free index, swap `needs-triage` for `ready-for-agent`, add `spec`, replace the body with the spec. It never opens a second issue for the same feature. One feature keeps one number for its whole life, so every inbound reference stays valid.

**Each ticket lists the spec's user stories it closes**, by the spec's own numbering, so the ticket is readable without the spec open and every story is accounted for exactly once across the set.

**`/to-tickets` creates each ticket as a real GitHub sub-issue of that spec**, not as a `Parent:` sentence in the body. The link belongs in GitHub's own hierarchy so it shows in the UI and in `gh issue view`'s `parent`/`sub-issues` fields:

```
gh api --method POST repos/<owner>/<repo>/issues/<spec>/sub_issues -F sub_issue_id=<ticket-db-id>
```

`<ticket-db-id>` is the numeric **database id** (`gh api repos/<owner>/<repo>/issues/<n> --jq .id`), not the `#number`.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

When set to `yes`, PRs run through the same labels and states as issues, using the `gh pr` equivalents:

- **Read a PR**: `gh pr view <number> --comments` and `gh pr diff <number>` for the diff.
- **List external PRs for triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments` then keep only `authorAssociation` of `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE` (drop `OWNER`/`MEMBER`/`COLLABORATOR`).
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`.

GitHub shares one number space across issues and PRs, so a bare `#42` may be either — resolve with `gh pr view 42` and fall back to `gh issue view 42`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: a single issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body. `gh issue create --label wayfinder:map`.
- **Child ticket**: an issue linked to the map as a GitHub sub-issue (`gh api` on the sub-issues endpoint). Where sub-issues aren't enabled, add the child to a task list in the map body and put `Part of #<map>` at the top of the child body. Labels: `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Once claimed, the ticket is assigned to the driving dev.
- **Blocking**: GitHub's **native issue dependencies** — the canonical, UI-visible representation. Add an edge with `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, where `<blocker-db-id>` is the blocker's numeric **database id** (`gh api repos/<owner>/<repo>/issues/<n> --jq .id`, _not_ the `#number` or `node_id`). GitHub reports `issue_dependencies_summary.blocked_by` (open blockers only — the live gate). Where dependencies aren't available, fall back to a `Blocked by: #<n>, #<n>` line at the top of the child body. A ticket is unblocked when every blocker is closed.
- **Frontier query**: list the map's open children (`gh issue list --state open`, scoped to the map's sub-issues / task list), drop any with an open blocker (`issue_dependencies_summary.blocked_by > 0`, or an open issue in the `Blocked by` line) or an assignee; first in map order wins.
- **Claim**: `gh issue edit <n> --add-assignee @me` — the session's first write.
- **Resolve**: `gh issue comment <n> --body "<answer>"`, then `gh issue close <n>`, then append a context pointer (gist + link) to the map's Decisions-so-far.
