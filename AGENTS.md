<!-- config-reviewed: 2026-07-19 @ a1f7c5b -->

# AGENTS.md — LLM Council

Governing ruleset: `~/Documents/OliwoodsHQ/Rules/GLOBAL-LLM-RULES.md`.

## What this is

**Intended** as a multi-model deliberation engine: five LLMs answer independently, peer-review each other blind, and a chairman synthesizes one answer with a confidence score. An OliWoods Foundation project — public repo, so assume outside readers.

🔴 **The deliberation engine is a STUB. Do not describe it as working.** (Verified 2026-07-19.) `runCouncil()` in `src/council.ts` makes **no provider calls at all** — it returns `` `[Pending LLM call to ${provider}/${model}]` `` for every member, empty `votes`/`dissents`, `costUsd: 0`, and `recommendation: "[Pending deliberation — connect to MAMA autonomy engine]"`. Stages 2 and 3 do not exist. `getConsensusLevel` is called exactly once, with a hardcoded `0`.

**What actually works** is `queryMembers` / `queryAllMembers` / `queryCouncilVariant` in `src/llm-calls.ts`: a parallel ask-all-five that returns each answer with latency. No voting, no consensus, no synthesis. `scoreComplexity` and `getConsensusLevel` are real, tested, and wired to nothing.

Trust `IMPROVEMENTS.md` and `docs/CLAUDE-TASKS-MAMA.md` over `README.md` — the README describes the finished product, including Supabase persistence, daily caps, a budget governor, `/api/council/run` and `/council` Slack commands. **None of those exist in this repo.**

## Architecture

`src/council.ts` holds complexity scoring (1-10) and the *intended* route to `single` / `fast` / `full` — plus the stubbed `runCouncil` described above. `src/llm-calls.ts` is the only place that talks to providers (Anthropic, OpenAI, Google, Groq — Groq and OpenAI share one OpenAI-compatible caller). `src/councils/{standard,vc-deals,humanitarian}.ts` are **presets over the same five models**, selected by `variant` — they change member labels and role descriptions only, which is why one `.env` drives all three. `src/index.ts` is the public surface and defines every type as a zod schema. `src/dev-server.ts` is a stdlib-`http` local UI + API.

## Stack

TypeScript (`module: NodeNext`, no `"type": "module"` in package.json — so tsc emits CJS), `tsc` build to `dist/`, vitest, zod 3, tsx for the dev server. **One runtime dependency (zod) — keep it that way.** No framework in the dev server; it is deliberately plain `node:http`.

## Rules an agent will otherwise get wrong

- **Relative imports carry the `.js` extension** (`./council.js`, `./councils/standard.js`) even though the sources are `.ts`. That is NodeNext convention and the codebase is consistent about it — match it rather than "correcting" it.
- **Presets are not separate products.** Do not fork a preset into its own repo or give it its own provider config — that consolidation already happened once. Add a file under `src/councils/` and register it.
- Provider keys are read from the environment inside `llm-calls.ts` and each throws a named error when missing (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_API_KEY` **or** `GEMINI_API_KEY`, `GROQ_API_KEY`). Do not thread keys through call sites.
- Dev server binds `127.0.0.1:3847` (override `PORT`) — localhost only, on purpose. Body and prompt caps live in `src/config.ts`, not inline.
- **Dissent is a feature** — a design principle for when deliberation is built, **not current behaviour**. Low consensus must surface and escalate, never be averaged into a confident-looking answer; below majority = do not execute. Today nothing computes consensus, so do not wire any caller to trust it yet.
- **Every `/api/ask` or `test:llms` run fires five real paid API calls in parallel** (two Anthropic, including Opus). There is no caching, rate limiting, retry, timeout, or cost accounting, despite the README's "daily caps, caching, budget governor". There is no `AbortController` anywhere — a hung provider hangs the request indefinitely.
- **HTTP 200 does not mean success.** Per-member failures are swallowed into `{ ok: false, error }`, so a response where all five models failed still returns 200. Missing keys surface as per-member errors, not startup failures — a partial-key run silently returns fewer answers.
- The Google key is passed as a **URL query parameter**, so it can leak into logs and proxies.
- `runCouncil`'s `"single"` mode indexes `DEFAULT_COUNCIL[4]` positionally (Llama). Reordering that array silently changes routing.
- Model ids are pinned to mid-2025 snapshot strings across three near-duplicate preset files, with no registry — swapping a model means editing all three. Adding a provider requires the `ModelProvider` zod enum in `src/index.ts`, a `callX` function, **and** a `switch` case in `callMember` (which has a `never` exhaustiveness check that fails the build if you miss it).
- ⚠️ **License is inconsistent in-repo and unresolved:** `LICENSE` is Apache-2.0, the README badge says Apache-2.0, but `package.json` declares `GPL-3.0`. Do not "fix" this by picking one — it needs Matt's call before publish.

## Checks

```bash
npm test                # vitest — council.test.ts, council-registry.test.ts
npm run build           # tsc
npm run dev:server      # http://127.0.0.1:3847/
npm run test:llms -- --variant=vc "question"   # live CLI, costs real money
```

No CI workflows — there is no `.github/` directory at all. `test:llms` hits real
providers and costs money; it is not part of `npm test` and should not be added.

`npm test` covers only the two pure-function files (`scoreComplexity`,
`getConsensusLevel`). There is **zero coverage of `llm-calls.ts` or
`dev-server.ts`** and no network mocking. Nothing runs until `npm install` —
`node_modules/` is not present by default. Run `dev:server` from the repo root
only; it resolves `.env` and `public/` via `process.cwd()`.
