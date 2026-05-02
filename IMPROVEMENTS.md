# LLM Council — improvement backlog

This document tracks enhancements for the library, dev server, and MAMA integration. Items marked **Done** were implemented in-repo; others are planned.

---

## Done (recent)

- **Centralized limits** — `src/config.ts`: max prompt length, JSON body size, Anthropic `max_tokens`.
- **HTTP hardening** — `POST /api/ask` rejects oversized bodies (413), validates prompt length (400), `GET /api/health` for uptime checks.
- **Public API** — `queryAllMembers`, `queryCouncilVariant`, `queryMembers`, `MemberResult` exported from package entry.
- **Council presets** — `standard`, `vc`, `humanitarian` in `src/councils/` + `src/council-registry.ts` (one repo instead of multiple council repos).
- **HTTP discovery** — `GET /api/councils` lists presets; `POST /api/ask` accepts `{ variant }`.
- **Unit tests** — Vitest for scoring (`council.test.ts`) and registry (`council-registry.test.ts`).
- **Developer UX** — `.env.example`, `.gitignore` includes `.env`, npm `test` script.
- **UI** — Character count; dev UI preset dropdown for council variant.

---

## Short term (next PRs)

1. **Wire `runCouncil` to live opinions** — Optional `liveOpinions` flag calling `queryMembers` / `queryAllMembers`; map results to `Opinion[]`; avoid circular imports via thin `members` module.
2. **Stage 2–3 deliberation** — Peer-review prompts (anonymized responses), chairman synthesis using Opus with structured output.
3. **Streaming** — SSE or NDJSON for `/api/ask` so the UI shows tokens per model as they arrive.
4. **Cost & telemetry** — Rough USD estimates per provider/model; optional `x-request-id` logging.
5. **Model registry** — YAML or JSON for council membership (swap models without code edits).
6. **CLI improvements** — `--json` output, `--member id` subset, exit codes by consensus.

---

## Medium term

7. **Authentication** — API keys or session for `/api/ask` when exposed beyond localhost.
8. **Rate limiting** — Per-IP or per-token bucket for public deployments.
9. **Caching** — Hash prompt + model set; TTL for repeated evaluations in CI.
10. **Consensus from text** — Embedding similarity or lightweight classifier to estimate agreement between opinions.
11. **GitHub Action** — Publish package on tag; run tests on PR.
12. **Docker** — Image for dev server with documented env vars.

---

## Long term / research

13. **Weighted voting** — Chairman tie-break, provider reliability weights from historical accuracy.
14. **Tool use** — Council members call allowed tools (read file, web) under sandbox policy.
15. **Human-in-the-loop** — Escalation when `consensusLevel` is `no-consensus` or confidence low.
16. **Multi-tenant MAMA** — Per-org council configs and billing hooks.

---

## MAMA integration (see Desktop task outline)

17. **Embeddable service** — Run council as a MAMA microservice or agent step with shared secrets.
18. **Unified tracing** — Propagate MAMA trace IDs through provider calls.
19. **Product UX** — “Ask council” from MAMA UI with mode picker (full / fast / single).

---

## Polish & housekeeping

20. **ESLint + Prettier** — Align with OliWoods Foundation defaults.
21. **API versioning** — `/v1/ask` prefix before stabilizing JSON schema.
22. **i18n** — Dev UI strings for non-English operators.
23. **Accessibility audit** — Focus order, live regions for async results.

---

_Add new ideas at the bottom with a short title and one-line rationale._
