/**
 * Venture / deal-analysis council — same five providers as standard, labels tuned for diligence.
 * (Consolidated from a standalone VC council variant into this repo.)
 */

import type { CouncilMember } from "../index.js";

export const VC_DEALS_COUNCIL: CouncilMember[] = [
  {
    id: "vc-claude-opus",
    name: "Claude Opus (deal chair)",
    provider: "anthropic",
    model: "claude-opus-4-0-20250514",
    role: "chairman",
    strength: "Investment memo synthesis, risk framing, IC-ready narrative",
  },
  {
    id: "vc-claude-sonnet",
    name: "Claude Sonnet (diligence)",
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
    role: "member",
    strength: "Models, metrics, term-sheet mechanics, fast iteration",
  },
  {
    id: "vc-gpt-4o",
    name: "GPT-4o (market & story)",
    provider: "openai",
    model: "gpt-4o",
    role: "member",
    strength: "Market narrative, competitive mapping, creative downside scenarios",
  },
  {
    id: "vc-gemini-flash",
    name: "Gemini Flash (data room)",
    provider: "google",
    model: "gemini-2.0-flash",
    role: "member",
    strength: "Rapid triage, large decks & PDF-scale context",
  },
  {
    id: "vc-llama-3-70b",
    name: "Llama 3 70B (contrarian pass)",
    provider: "groq",
    model: "llama3-70b-8192",
    role: "member",
    strength: "Stress-test assumptions, open-weight transparency, fast checks",
  },
];
