# 5 — Curriculum browse + gating

Branch: `5-curriculum-browse-gating` · PR #18

## 2026-09-06 — CORS block and 404 on `POST /refresh`

## Symptom

Loading the app at `http://localhost:5173` (signup screen), the browser console showed:

```
Access to fetch at 'http://localhost:3000/refresh' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
on the requested resource.

POST http://localhost:3000/refresh net::ERR_FAILED 404 (Not Found)   httpClient.ts:13

Uncaught (in promise) TypeError: Failed to fetch
    at refreshAccessToken (httpClient.ts:13:26)
    at main.tsx:23:1
```

Three symptoms stacked: a 404, absent CORS headers, and an uncaught rejection.

## Investigation

The obvious reading — the API is missing a route and its CORS config — was wrong on both counts.

- `bin/rails routes` inside the container: `POST /refresh` → `sessions#refresh` **exists**.
- `apps/api/config/initializers/cors.rb` **already existed** and was already correct per ADR-0009: `origins ENV.fetch("FRONTEND_ORIGIN", "http://localhost:5173")` with `credentials: true` and no wildcard. `rack-cors` was in the `Gemfile` and installed.
- Curling Rails directly inside the container proved the API behaves correctly:
  ```
  curl -i -X POST http://127.0.0.1:3000/refresh -H "Origin: http://localhost:5173"
  → 401, access-control-allow-origin: http://localhost:5173
       access-control-allow-credentials: true
  ```
  A 401 is the correct response for a request with no refresh cookie.

So the API was right and the browser was still wrong. The discrepancy was the request never reaching this API:

- `docker ps --filter publish=3000` → `got-it-api-1  0.0.0.0:3000->3000/tcp` — an unrelated project's Express container owns host port 3000.
- This devcontainer publishes **no** host ports at all (`docker inspect` → `NetworkSettings.Ports` is `{}`); Rails is reachable only via VS Code's dev-container forwarding, bound to `127.0.0.1`.
- `curl` to `localhost:3000` returns `404` with `x-powered-by: Express` — confirming the wrong service answers.
- `localhost` resolves to `::1` first on this machine, landing on the Express container's dual-stack listener rather than the forwarded port.

An Express 404 naturally carries no `Access-Control-Allow-Origin` header, which produced the CORS message too. One environmental fault presented as two application faults.

## Root cause

Two independent causes:

1. **Host port collision (outside this repo).** Another project's container held `0.0.0.0:3000`, so the browser's requests never reached this project's Rails.
2. **Unhandled rejection at boot (real bug in this repo).** `main.tsx:23` called `refreshAccessToken().finally(...)` with no `.catch`, and `refreshAccessToken` let a `fetch`-level failure propagate. Any network failure at boot — not just this collision — produced an uncaught `TypeError` for a logged-out visitor. A failed refresh with no session is a normal state and should never throw.

## Options considered

- **Change the CORS config to fix the missing header** — rejected. The config was already correct; the header was absent because a different server answered. Changing it would have "fixed" nothing while making a correct file wrong.
- **Publish port 3000 from `.devcontainer/docker-compose.yml`** — rejected. The port is already bound on the host by the other container, so the bind would simply fail. It would also duplicate what VS Code's forwarding already does.
- **Move this project's API off port 3000** — not taken, but viable. 3000 is Rails' default and is assumed in `apps/web/.env.example`, `httpClient.ts`'s fallback, the root `docker-compose.yml`, and ADR-0009. Changing it means changing all of them, to work around a collision that only exists on one machine. Left open in case the collision proves permanent.
- **Stop the conflicting container on the host** — chosen. The collision is local to one developer's machine and belongs there, not in the repo's configuration.
- **Catch the rejection in `main.tsx` at the call site** — rejected in favour of handling it inside `refreshAccessToken`, so every caller benefits rather than only this one.

## Outcome

- `apps/web/src/lib/httpClient.ts` — `refreshAccessToken` wraps its `fetch` in `try/catch`; a failed request clears the access token and resolves `false`, matching the existing non-`ok` path instead of throwing.
- `apps/web/src/lib/httpClient.test.ts` — new; covers network failure, non-ok response, and success. The first test reproduced the exact reported rejection before the fix.
- Nothing in `apps/api` changed. No gem added; `Gemfile.lock` untouched.
- The port collision is not fixed in this repo and cannot be — it is resolved by stopping `got-it-api-1` or moving one project to another port.

## Prevention

The costly part was assuming a browser-reported 404 came from the expected server. `x-powered-by: Express` on a Rails project's endpoint was the tell, and it was visible in the very first response.

When a symptom points at a service, confirm the request reaches that service before investigating its code — `docker ps --filter publish=<port>` and one `curl -i` would have located this in under a minute.

No repo-level change would have prevented the collision. The unhandled rejection, by contrast, was a genuine gap: `httpClient.ts` had no test file at all, so the boot path's failure mode was never exercised.
