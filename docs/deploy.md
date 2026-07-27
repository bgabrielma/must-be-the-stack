# Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: `deploy-backend` (test,
build the Rails image, push to GHCR, SSH into the VPS, `docker compose up
-d`) then `deploy-frontend` (`needs: deploy-backend`, builds the React app
and pushes it to Cloudflare Pages via `cloudflare/pages-action`). See
[ADR-0009](adr/0009-vps-hosting-with-split-frontend-deploy.md) for why this
split exists.

This doc covers the one-time setup neither workflow can do for you (VPS and
Cloudflare account configuration) and how the backend-then-frontend gating
was verified.

## Required GitHub Actions secrets

| Secret | Used by | Purpose |
| --- | --- | --- |
| `VPS_HOST` | `deploy-backend` | SSH host for the VPS |
| `VPS_USER` | `deploy-backend` | SSH user for the VPS |
| `VPS_SSH_KEY` | `deploy-backend` | Private key for the deploy user (public half installed on the VPS) |
| `GHCR_DEPLOY_USER` | `deploy-backend` | GitHub username that owns `GHCR_DEPLOY_TOKEN` — kept as its own secret rather than reused from `github.actor`, since `github.actor` is whoever triggered the push and won't generally be the PAT's owner |
| `GHCR_DEPLOY_TOKEN` | `deploy-backend` | PAT with `read:packages`, used by the VPS to `docker login ghcr.io` and pull the image |
| `CLOUDFLARE_API_TOKEN` | `deploy-frontend` | Cloudflare API token scoped to Pages edit on the `must-be-the-stack` project |
| `CLOUDFLARE_ACCOUNT_ID` | `deploy-frontend` | Cloudflare account ID |

`GITHUB_TOKEN` (pushing the built image to GHCR, and `cloudflare/pages-action`'s
deployment-status comment) is provided automatically by Actions and needs no
setup.

## One-time VPS setup

1. Install Docker + the Compose plugin on the VPS.
2. Create `/opt/must-be-the-stack` and copy the repo's root `docker-compose.yml` into it (this is the only file the VPS needs — it pulls the `app` image from GHCR rather than building from source).
3. In that directory, create a `.env` file (gitignored, VPS-local only) with:
   ```
   RAILS_MASTER_KEY=<contents of apps/api/config/master.key>
   FRONTEND_ORIGIN=https://<cloudflare-pages-project>.pages.dev
   API_IMAGE=ghcr.io/bgabrielma/must-be-the-stack/api:latest
   ```
   `docker compose` reads `.env` automatically; these values populate the `app`
   service's `RAILS_MASTER_KEY`, `FRONTEND_ORIGIN`, and `image:` (see
   `apps/api/config/initializers/cors.rb`, which already reads
   `FRONTEND_ORIGIN` and defaults to `http://localhost:5173` for local dev —
   this is what makes CORS "explicitly allow only the deployed frontend
   origin" in production). `API_IMAGE` here is only the bootstrap value for a
   manual first-time `docker compose up -d`; every subsequent deploy is
   driven by `deploy-backend`, whose SSH step exports `API_IMAGE` for that
   specific `docker compose pull`/`up -d` invocation with the just-pushed
   commit SHA, rather than the two files hardcoding the same GHCR path twice.
   `image:` has no fallback (`${API_IMAGE:?...}`), so `docker compose up` fails
   loudly instead of silently deploying a stale default if `API_IMAGE` is
   ever unset.
4. Add the deploy public key to the deploy user's `~/.ssh/authorized_keys`.
5. Point the Cloudflare DNS-proxied API subdomain at the VPS (TLS termination happens at Cloudflare's edge, per ADR-0009).

## One-time Cloudflare Pages setup

1. Create a Pages project named `must-be-the-stack` (matches `projectName` in the workflow).
2. **Disable the project's automatic Git-integration deploys** (Settings → Builds & deployments) — this is what makes `deploy-frontend`'s `needs: deploy-backend` gating meaningful; without disabling it, Cloudflare would deploy on every push independent of the backend's state.
3. Generate an API token (Account → API Tokens) scoped to `Cloudflare Pages: Edit` for this account, store as `CLOUDFLARE_API_TOKEN`.
4. Store the account ID (visible on any Cloudflare dashboard page's right sidebar) as `CLOUDFLARE_ACCOUNT_ID`.

## Verifying the backend-then-frontend gating

GitHub Actions' default `needs:` behavior is to skip a job entirely if any
job it depends on fails (equivalent to an implicit `if: success()`), so
`deploy-frontend` never runs when `deploy-backend` fails — no extra `if:`
guard needed in the workflow itself.

Two ways to re-check this whenever the workflow's shape changes, cheapest
first:

1. **Locally with [`act`](https://github.com/nektos/act)** (a local GitHub
   Actions runner): run `deploy.yml` with a step in `deploy-backend`
   temporarily forced to fail (e.g. `run: exit 1`), and confirm `act`'s
   output never reaches a "Set up job" line for `deploy-frontend` and exits
   non-zero overall. Then remove the forced failure and confirm both jobs
   report success and `deploy-frontend` actually runs. This doesn't need
   real secrets — the SSH/Cloudflare steps can be stubbed or the run only
   needs to get as far as the `needs:` check.
2. **Against the real workflow**, once secrets are configured: push a commit
   that breaks `deploy-backend` (e.g. a failing RSpec example) to `main` and
   confirm in the Actions run summary that `deploy-frontend` shows as
   **Skipped**, then revert and confirm a clean push runs both jobs to
   completion.

Prefer (2) before trusting a production deploy on a new VPS/Cloudflare
setup — (1) only proves GitHub Actions' generic `needs:` semantics, not that
this specific workflow's secrets and steps are wired correctly end to end.
