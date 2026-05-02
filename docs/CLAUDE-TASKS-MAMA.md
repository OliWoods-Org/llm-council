# Claude task list — LLM Council → MAMA

**Last updated:** 2026-05-02  
**Desktop mirror:** `~/Desktop/Claude - MAMA LLM Council task.txt` (keep in sync when this file changes)

## Objective

Expose the LLM Council capability inside MAMA so operators can run full / fast / single deliberation on tasks, reuse MAMA auth and tracing, and optionally route high-complexity work through the council automatically.

## Context (what exists in `llm-council` today)

- Three council presets in one repo (same five provider/model pairs; different member labels): **standard** (MAMA), **vc** (deal diligence), **humanitarian** (impact/ethics).
- Library: `queryAllMembers`, `queryCouncilVariant(variant, prompt)`, `queryMembers`, `scoreComplexity`, `getConsensusLevel`, `runCouncil` (skeleton for stages 2–3).
- Dev server: `npm run dev:server` → http://127.0.0.1:3847/
  - `GET /` — UI with preset dropdown
  - `GET /api/health` — ok, port, limits, `councils[]`
  - `GET /api/councils` — `{ variants: [{ id, label, description }] }`
  - `POST /api/ask` — `{ "prompt": "...", "variant": "standard" | "vc" | "humanitarian" }`
- CLI: `npm run test:llms -- [--variant=vc|humanitarian] "prompt..."`
- Env: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_API_KEY` or `GEMINI_API_KEY`, `GROQ_API_KEY`. Optional `COUNCIL_*` — see `src/config.ts`.
- Tests: `npm test`. Roadmap: [IMPROVEMENTS.md](../IMPROVEMENTS.md).

## Proposed MAMA integration (outline)

1. **Service boundary** — MAMA skill or endpoint calling `queryCouncilVariant` or HTTP bridge matching `POST /api/ask` JSON. Pass `variant` from UI.
2. **Configuration** — Preset defaults in MAMA config; secrets in vault (never browser).
3. **Observability** — Propagate MAMA trace/request ID; per-member latency is already in API results (`ms`).
4. **UX** — “Ask council” + preset picker + results cards; human escalation when consensus signals exist.
5. **Security** — Server-side keys only; auth on any non-localhost council endpoint.
6. **Rollout** — Phase 1: parallel ask-all. Phase 2: live `runCouncil` opinions + chairman synthesis. Phase 3: peer review.

## MAMA deliverables

- [ ] Wire `llm-council` (package) or internal HTTP service into MAMA.
- [ ] Document env vars in MAMA deployment README / vault checklist.
- [ ] E2E: prompt in MAMA → structured results per model + errors if keys missing.
- [ ] Optional: show `scoreComplexity(task)` and suggested mode.

## Remaining work — library and dev server

See [IMPROVEMENTS.md](../IMPROVEMENTS.md) for the full backlog. Summary:

**Short term:** Live `runCouncil` opinions; stages 2–3 deliberation; streaming `/api/ask`; cost/telemetry; external model registry; CLI `--json` / subset members.

**Medium term:** Auth, rate limits, caching, consensus-from-text, CI publish, Docker.

**Long term:** Weighted voting, tool use, human-in-the-loop, multi-tenant MAMA.

**MAMA-specific:** Embeddable service, unified tracing, product UX for council + mode picker.

**Polish:** ESLint/Prettier, API versioning, i18n, a11y audit.

## Next session

- [ ] `git push origin main` if local branch is ahead of origin.
- [ ] When implementing MAMA: choose TS import vs HTTP bridge.
- [ ] Align IMPROVEMENTS “short term” with sprint capacity.
