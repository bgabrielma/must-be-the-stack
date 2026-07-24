---
status: accepted
date: 2026-07-24
decision-makers: Bruno Martins
---

# JWT access tokens + opaque refresh tokens, hand-rolled on Rails 8's built-in auth

Users authenticate via Rails 8's built-in `has_secure_password` generator for credential storage; login issues a short-lived signed JWT access token (sent as `Authorization: Bearer` on every request, verified by signature with no DB hit) plus a longer-lived opaque refresh token stored in Postgres (exchanged for a new access token when it expires, and deleted to revoke a session). This is hand-rolled rather than via Devise/`devise-jwt`/`devise-api`, keeping one fewer dependency and full control, consistent with this stack's minimal-infra pattern ([ADR-0005](0005-solid-queue-for-background-jobs.md)). Token-based auth (not cookie-based sessions) was chosen because the Rails backend and React frontend are fully separate apps, not a single Rails app serving views — cookies would require `SameSite=None`/CORS-credentials handling and get awkward with the PWA's service worker.

## Considered Options
* Cookie-based Rails sessions — rejected: awkward across two fully separate apps/origins (CORS + SameSite config, PWA service worker edge cases).
* Devise + `devise-jwt` + `devise-api` — rejected: adds a dependency for functionality (`has_secure_password` + a refresh-token table) that's straightforward to hand-roll.
* Bare JWT with no refresh token — rejected: forces users to re-enter credentials on every access-token expiry, poor UX for a study app used across a day.

## Consequences
Revoking a session only stops new access tokens from being minted (refresh token deleted) — an already-issued access token remains valid until its own short expiry elapses. Refresh tokens should be rotated on each use (old one invalidated, new one issued) to limit replay if stolen, and stored client-side in an `httpOnly` cookie rather than JS-accessible storage to reduce XSS exposure.
