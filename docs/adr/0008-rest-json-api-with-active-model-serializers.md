---
status: accepted
date: 2026-07-24
decision-makers: Bruno Martins
---

# REST + JSON:API response format via active_model_serializers

The Rails↔React contract is REST, with responses shaped to the JSON:API spec (`data`/`attributes`/`relationships`/`included`), produced by one `active_model_serializers` class per model using its `:json_api` adapter — not Jbuilder templates, not the `jsonapi-serializer` gem, and not GraphQL. This closes the gap [ADR-0004](0004-polyglot-stack-rails-react-split-monorepo.md) flagged: with no shared TS types between the two ecosystems, a spec'd envelope format gives the frontend a consistent shape to hand-write matching TS interfaces against, rather than each endpoint returning its own ad-hoc shape. Ruby-class serializers (over Jbuilder's view-template DSL) were specifically wanted so serialization logic reads as plain Ruby objects rather than templates; `active_model_serializers` was picked over `jsonapi-serializer` because its adapter is swappable (`:json_api` now, without rewriting the serializer classes if the format ever needs to change) — the same pattern GoRails' "JSON:API Format and Active Model Serializers" episode teaches.

## Considered Options
* Plain/ad-hoc JSON (no spec, `as_json` or Jbuilder per endpoint) — the community-common choice for an internal-only API with no external consumers (surfaced via r/rails discussion), but rejected here in favor of a consistent envelope to anchor hand-written frontend TS types against.
* `jsonapi-serializer` — actively maintained and JSON:API-native, but rejected: adapter-locked to JSON:API only, whereas `active_model_serializers` keeps the format swappable via its adapter layer.
* Jbuilder — Rails' own default and the most common choice for internal APIs, but rejected: view-template DSL, not the Ruby-class shape wanted for serializers.
* GraphQL — not pursued; REST was the explicit preference once the frontend/backend split was confirmed as fully separate apps.

## Consequences
`active_model_serializers` is in maintenance mode (latest release Dec 2024, most original maintainers no longer active) — stable but not actively developed; a future migration to `jsonapi-serializer` or another gem is possible later since the adapter boundary keeps the model-facing serializer classes similar. JSON:API's `included`/relationship-following is prone to N+1 queries if the frontend requests arbitrary nested includes — association eager-loading needs to be deliberate per endpoint, not automatic.
