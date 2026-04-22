<p align="center">
  <h1 align="center">LLM Council</h1>
  <h3 align="center"><em>5 AI models debate every decision. The best answer wins.<br>Better than any single model. Open-source. Pluggable.</em></h3>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache--2.0-blue.svg" alt="License"></a>
  <img src="https://img.shields.io/badge/models-5_members-8b5cf6" alt="5 Members">
  <img src="https://img.shields.io/badge/modes-3_(full/fast/single)-06b6d4" alt="3 Modes">
  <a href="https://mama.oliwoods.ai"><img src="https://img.shields.io/badge/Built_with-MAMA-8b5cf6" alt="Built with MAMA"></a>
  <a href="https://cofounder.software"><img src="https://img.shields.io/badge/Powered_by-CoFounder-06b6d4" alt="Powered by CoFounder"></a>
</p>

---

> **No single AI model is right about everything.** Claude is careful but sometimes overly cautious. GPT-4o is creative but sometimes halluccinates. Gemini is fast but sometimes shallow. Llama is free but sometimes wrong. **What if they all debated and peer-reviewed each other?**

## How It Works

```
┌─────────────────────────────────────────────────────┐
│                  YOUR QUESTION                       │
└────────────────────────┬────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐    ┌──────────┐
    │  Claude  │    │  GPT-4o  │    │  Gemini  │    + Llama, Sonnet
    │  Opus    │    │          │    │  Flash   │
    └────┬────┘    └────┬─────┘    └────┬─────┘
         │              │               │
         ▼              ▼               ▼
    ┌─────────────────────────────────────────┐
    │     STAGE 1: Independent Opinions       │
    │     Each model answers separately       │
    └────────────────────┬────────────────────┘
                         │
    ┌────────────────────┴────────────────────┐
    │    STAGE 2: Anonymized Peer Review      │
    │    Each model scores the others' plans  │
    │    against a rubric (blind review)      │
    └────────────────────┬────────────────────┘
                         │
    ┌────────────────────┴────────────────────┐
    │    STAGE 3: Chairman Synthesis          │
    │    Opus merges ranked plans into one    │
    │    final answer with confidence score   │
    └────────────────────┬────────────────────┘
                         │
    ┌────────────────────┴────────────────────┐
    │           FINAL ANSWER                   │
    │    Confidence: 92% (4/5 agreement)      │
    │    Dissent: Llama disagreed on X        │
    └─────────────────────────────────────────┘
```

## Three Modes

| Mode | When | Cost | Speed | Quality |
|------|------|------|-------|---------|
| **Full Council** | Architecture, security, migrations | ~$2-5 | 30-60s | Highest |
| **Fast Council** | Medium decisions, quick polls | ~$0.10 | 5-10s | Good |
| **Single Model** | Simple tasks, bulk operations | ~$0.01 | 1-3s | Baseline |

## The 5 Council Members

| Member | Provider | Role | Strength |
|--------|----------|------|----------|
| **Claude Opus** | Anthropic | Chairman | Careful reasoning, safety, synthesis |
| **Claude Sonnet** | Anthropic | Member | Fast + accurate, good code |
| **GPT-4o** | OpenAI | Member | Creative, broad knowledge |
| **Gemini Flash** | Google | Member | Speed, multimodal, large context |
| **Llama 3 70B** | Groq (free) | Member | Open-source perspective, zero cost |

## Why This Works

Research shows multi-model deliberation outperforms any single model:

- **Blind spots eliminated** — what Claude misses, GPT-4o catches (and vice versa)
- **Hallucination reduced** — if 4/5 models agree, the answer is more likely correct
- **Bias diversified** — each model was trained differently, on different data
- **Confidence calibrated** — unanimous agreement = high confidence, split vote = flag for human
- **Cost optimized** — simple tasks use the cheapest model, complex tasks justify the full council

## Auto-Routing by Complexity

The system scores task complexity (1-10) and routes automatically:

```
Score 1-3 → Single Model (Groq Llama, free)
Score 4-6 → Fast Council (all 5 vote, majority wins)
Score 7-10 → Full Council (3-stage deliberation)
```

Scoring factors: keywords (architecture=8, migration=9, UI=3), file count, priority label, department.

## Confidence & Consensus

| Agreement | Confidence | Action |
|-----------|-----------|--------|
| 5/5 agree | 95%+ | Auto-execute |
| 4/5 agree | 80% | Execute + log dissent |
| 3/5 agree | 60% | Flag for human review |
| No majority | <50% | Escalate, do not execute |

**Dissent is valuable.** When one model disagrees, we log why. Sometimes the dissenter is right.

## Rubric System

Default scoring categories (each 0-10):

| Category | What It Measures |
|----------|-----------------|
| **Correctness** | Is the answer factually right? |
| **Completeness** | Does it cover all aspects? |
| **Security** | Any vulnerabilities introduced? |
| **Performance** | Is it efficient? |
| **Maintainability** | Can someone else understand it? |

Per-product rubric overrides available (e.g., trading accuracy matters more for Grail, UX matters more for LT).

## MAMA Integration

In MAMA, the council is available via:

```
/council [task]           → auto-routed by complexity
/council fast [question]  → force fast mode
/council full [task]      → force full deliberation
/council status           → recent sessions
```

API:
```
POST /api/council/run     → { task, mode?, product? }
GET  /api/council/sessions → list recent sessions
```

## Improvements Over Karpathy's Original

| Feature | Karpathy's llm-council | Our LLM Council |
|---------|----------------------|-----------------|
| Modes | Single mode | 3 modes (full/fast/single) |
| Auto-routing | Manual | Complexity-scored auto-routing |
| Confidence | None | Quantified consensus scoring |
| Persistence | None | Supabase session logging |
| Integration | Standalone | MAMA Slack + API + autonomy engine |
| Cost control | None | Daily caps, caching, budget governor |
| Rubrics | Fixed | Per-product customizable |
| Dissent tracking | None | Logged with reasoning |

## Use Cases Beyond Code

- **VC Deal Analysis** — 5 models each grade a deal, peer-review, synthesize (used on WHOOP + Dyme)
- **Content Moderation** — multi-model consensus on whether content is appropriate
- **Medical Triage** — cross-reference symptom analysis across models (with human oversight)
- **Legal Review** — multiple perspectives on contract clauses
- **Architecture Decisions** — debate tradeoffs before committing

## Quick Start

```bash
git clone https://github.com/OliWoods-Org/llm-council.git
cd llm-council

# Set API keys
export ANTHROPIC_API_KEY=...
export OPENAI_API_KEY=...
export GOOGLE_AI_API_KEY=...
export GROQ_API_KEY=...

# Run a council session
npm start -- --task "Design a database schema for a marketplace" --mode full
```

Or use via [MAMA](https://mama.oliwoods.ai): `/council Design a database schema for a marketplace`

## Contributing

We need developers, ML researchers, and people who care about AI decision quality. PRs welcome.

## Related Projects

| Project | Description |
|---------|-------------|
| [Humanitarian Council](https://github.com/OliWoods-Org/humanitarian-council) | Multi-perspective deliberation for social impact decisions |
| [MAMA](https://mama.oliwoods.ai) | AI Chief of Staff — 85+ agent teams |
| [Karpathy's llm-council](https://github.com/karpathy/llm-council) | Original inspiration |

---

<p align="center">
  <strong>An <a href="https://oliwoodsfoundation.org">OliWoods Foundation</a> Project</strong>
  <br><em>Better decisions through multi-model deliberation</em>
  <br><br>
  <sub>
    Built with <a href="https://mama.oliwoods.ai">MAMA</a> · Powered by <a href="https://cofounder.software">CoFounder</a>
    <br><br>
    <strong>"The test of a first-rate intelligence is the ability to hold two opposing ideas in mind at the same time and still retain the ability to function."</strong>
    <br>— F. Scott Fitzgerald
    <br><br>
    Apache 2.0 — Fork it. Debate it. Build better AI.
  </sub>
</p>
