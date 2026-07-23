---
status: accepted
date: 2026-07-23
decision-makers: Bruno Martins
---

# PWA over native mobile for v1

We're shipping as a PWA rather than native mobile apps, since Web Push satisfies our hard requirement of closed-app notifications on both Android and iOS (16.4+) without app-store distribution or platform-specific codebases.

## Considered Options
Native mobile app (iOS/Android) — rejected for v1: app-store distribution and platform-specific codebases are a bigger lift, and Web Push already meets the closed-app notification requirement without them.

## Consequences
iOS requires the user to manually add the PWA to their home screen before push works — Apple provides no programmatic install prompt. Onboarding must detect standalone mode (`display-mode: standalone` / `navigator.standalone`) and guide iOS users through that step.
