---
status: accepted
date: 2026-07-23
decision-makers: Bruno Martins
---

# Solid Queue as the Active Job backend

Background jobs (triggering the Evaluator's GitHub Actions workflow, handling its webhook callback, LLM scoring calls, notification dispatch) run on Solid Queue rather than Sidekiq. Solid Queue is Postgres-backed and reuses the same database already in use, needing no separate Redis instance to run, host, or pay for — consistent with the free/minimal-infra approach taken throughout this stack (GitHub Actions over self-hosted sandboxing, PWA over native). It's also the official Rails 8 Active Job default.

## Considered Options
* Sidekiq — rejected: requires running Redis as a separate service, and its higher throughput ceiling isn't needed at this project's scale.
* Good Job — a comparable Postgres-backed alternative with a built-in dashboard; not chosen since Solid Queue is the first-party Rails default.

## Consequences
No built-in job dashboard — Mission Control Jobs (a separate Rails-core gem) is needed for monitoring/failed-job visibility. Jobs need explicit `retry_on` (no automatic retries), and jobs enqueued inside a DB transaction need `enqueue_after_transaction_commit` to avoid being picked up before the transaction commits.
