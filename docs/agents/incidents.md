# Incident Write-ups

Every bug investigation produces a write-up in `docs/incident/`, committed alongside the fix.

Bugs are diagnosed with the `diagnosing-bugs` skill (one of the Matt Pocock skills; invoked by asking to "diagnose"). This document covers what it leaves behind, not how to run it.

## Why

The skill's Phase 6 post-mortem puts the winning hypothesis in the commit message and then asks "what would have prevented this?". Neither answer survives in a findable place. A commit message is only found by someone who already knows which commit to look at, and the discarded hypotheses — often the most expensive part of the investigation — are lost entirely.

The write-up exists so the next person hitting the same symptom finds the previous investigation instead of repeating it, including the paths that turned out to be wrong.

## When

Any investigation that took real diagnostic work: a reproduction loop, instrumentation, more than one hypothesis, or a symptom that pointed somewhere other than the actual cause.

Not for every fix. A typo, an obvious off-by-one, or a bug whose cause was evident from the stack trace needs a commit message, not a document. The test is whether someone else could plausibly waste time re-deriving what you found.

## Naming

`docs/incident/<issue-number>-<kebab-case-issue-title>.md` — the same name as the branch and the ticket the work happened under, so the incident, the branch, the issue and the PR all share one identifier.

One file per issue. If a second incident comes up under the same ticket, append a new dated section to the existing file rather than creating a second one.

## Required sections

- **Symptom** — what was actually observed, verbatim where possible (error text, status codes, console output). No interpretation.
- **Investigation** — what was checked, and what each check proved or ruled out. Include the evidence, not just the conclusion.
- **Root cause** — what was actually wrong. If the symptom had more than one cause stacked, separate them; a single symptom is frequently two unrelated faults.
- **Options considered** — every option weighed, including the ones not taken, each with why. An option rejected for a bad reason is worth recording as much as the one chosen.
- **Outcome** — what changed, what didn't, and anything deliberately left alone.
- **Prevention** — what would have caught this earlier, or an honest "nothing reasonable would have". Do not invent a process fix for a one-off.

## Honesty requirements

Record what actually happened, including wrong turns and time lost on them. A write-up that presents the investigation as a straight line to the answer is worse than none — it teaches a false model of how the bug was found.

If the root cause turned out to be outside this repo (environment, another service, a host-level collision), say so plainly rather than finding something in-repo to blame.
