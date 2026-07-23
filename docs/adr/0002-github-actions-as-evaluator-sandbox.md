---
status: accepted
date: 2026-07-23
decision-makers: Bruno Martins
---

# GitHub Actions as the Evaluator's execution sandbox

Project Submissions are executed via a workflow baked into a generated Template Repo, using GitHub Actions as the sandbox rather than self-hosting execution (Docker/gVisor/Firecracker). This avoids building and hardening our own untrusted-code sandbox while staying free at our scale.

## Considered Options
Self-hosted Docker or gVisor sandbox — rejected for now: real infra to build, secure, and pay for, with no benefit until we outgrow GitHub Actions' free tier.

## Consequences
The Evaluator must verify a Submission's workflow file matches the Template Repo's before triggering a run — a user could otherwise edit the workflow to fake a pass. Mismatch or absence is rejected without evaluation.
