---
status: accepted
date: 2026-07-24
decision-makers: Bruno Martins
---

# Self-hosted VPS for Rails + Postgres, Cloudflare Pages for the frontend, GitHub Actions CI/CD with ordered deploy

Rails and Postgres run in Docker Compose on an already-owned Ubuntu VPS (mirroring the `.devcontainer/docker-compose.yml` shape — an `app` and a `postgres` service — just standalone instead of inside a devcontainer). The React build deploys separately to Cloudflare Pages, a free static-hosting CDN. As of mid-2026 none of the managed PaaS alternatives (Render, Fly.io, Railway, Heroku) have a real ongoing free tier for a backend+Postgres workload — Fly.io and Heroku dropped theirs entirely, Render's free Postgres auto-deletes after 30 days, Railway's free credit ($1/mo) is too tight for continuous use — so paying for a second provider on top of an already-owned VPS made no sense. Splitting the frontend onto Cloudflare Pages instead of serving it from the VPS was chosen anyway (despite the VPS being capable of serving both) because it's genuinely free, gives CDN-edge delivery of static assets, and doesn't add real coupling: [ADR-0004](0004-polyglot-stack-rails-react-split-monorepo.md) and [ADR-0007](0007-jwt-auth-with-refresh-tokens.md) already decoupled the two apps at the code level (no shared types, bearer-token auth chosen specifically to avoid cross-origin cookie issues), so splitting the hosting doesn't introduce new complexity beyond CORS configuration. Cloudflare's free DNS/CDN proxy (separate from Pages) also fronts the VPS's API subdomain for TLS termination and DDoS mitigation, without moving the backend anywhere.

CI/CD runs on GitHub Actions (consistent with [ADR-0002](0002-github-actions-as-evaluator-sandbox.md)'s existing use of GitHub Actions), as a single workflow with two sequential jobs: `deploy-backend` (test, build the Rails Docker image, push to GitHub Container Registry, SSH into the VPS, `docker compose up -d`) and `deploy-frontend` (`needs: deploy-backend`; builds the React app and pushes it via the official `cloudflare/pages-action`). Cloudflare Pages' own automatic Git-integration builds are deliberately left disabled — deploying via the Actions job instead of Cloudflare's native webhook is what makes the ordering enforceable at all.

## Considered Options
* Render / Fly.io / Railway / Heroku for the backend — rejected: no viable free tier as of 2026, and redundant with an already-paid-for VPS.
* Serving the React build from the same VPS (Nginx/Caddy alongside Rails) — considered and initially recommended, but reversed: Cloudflare Pages is free, gives CDN delivery, and the stack was already fully decoupled, so there was no real cost to splitting.
* Cloudflare Pages' native Git-integration auto-deploy — rejected: it deploys independently of the backend on every push, with no way to guarantee the frontend only ships after a successful backend deploy.

## Consequences
Two deploy targets instead of one — the VPS (SSH + Docker) and Cloudflare Pages (via Actions) — with CORS on the Rails side needing to explicitly allow the Pages origin. The `deploy-frontend` job only runs if `deploy-backend` succeeds (default `needs` behavior skips downstream jobs on failure), so a failed backend deploy leaves both the backend and frontend on their last-known-good versions — never a frontend deployed ahead of the backend it depends on.
