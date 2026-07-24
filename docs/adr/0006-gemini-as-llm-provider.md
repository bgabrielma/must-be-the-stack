---
status: accepted
date: 2026-07-24
decision-makers: Bruno Martins
---

# Gemini 3.6 Flash as the runtime LLM provider

Runtime LLM calls (Quiz grading, Project/Evaluator scoring, Socratic-guide chat, voice input) use Gemini 3.6 Flash on the free API tier, called directly from the Rails backend. Anthropic and OpenAI were ruled out because both explicitly prohibit using a personal chat subscription (Claude Pro/Max, ChatGPT Plus/Pro) to power a separate app's backend — that auth is reserved for their own first-party surfaces, and neither offers a free API tier as an alternative. Gemini is the only major provider with a real, ongoing free API tier, and 3.6 Flash specifically was picked over 3.1 Pro because it benchmarks higher on coding/SWE-bench-style tasks — the kind of judgment the Evaluator actually does — while Pro's edge (abstract reasoning, long-context retrieval) isn't relevant here. Flash also accepts audio natively, so voice input is one call (record → Flash → clean text) with no separate STT service.

## Considered Options
* Anthropic / OpenAI API — rejected: no free tier, and subscription-based auth (Claude Pro/Max, ChatGPT Plus/Pro) is contractually barred from powering a third-party app's backend.
* Kimi/Moonshot — has a real free API tier (~1,000 req/day) and is cheaper than Anthropic/OpenAI paid tiers, but Gemini's free tier is more generous and covers audio input natively.
* Gemini 3.1 Pro over 3.6 Flash — rejected: Pro only leads on abstract reasoning and long-context benchmarks, neither central to this app's grading tasks; Flash is faster, cheaper, and benchmarks better on coding-adjacent tasks.

## Consequences
Free-tier usage means request/response content is used by Google to improve their models ("content used to improve our products") — accepted as reasonable for a v1 personal project with no sensitive user data yet. This can be revisited by switching to the paid tier (still cheap: Flash-Lite paid is $0.10/$0.40 per 1M tokens) if that trade-off stops being acceptable. Free-tier rate limits are account-specific and only visible in the AI Studio dashboard (no published fixed RPM/RPD table), so usage should be monitored there rather than assumed from third-party estimates.
