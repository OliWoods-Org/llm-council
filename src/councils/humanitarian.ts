/**
 * Humanitarian & social-impact council — same five providers, labels tuned for ethics and field reality.
 * (Consolidated from the humanitarian-council concept into this repo.)
 */

import type { CouncilMember } from "../index.js";

export const HUMANITARIAN_COUNCIL: CouncilMember[] = [
  {
    id: "hum-claude-opus",
    name: "Claude Opus (ethics lead)",
    provider: "anthropic",
    model: "claude-opus-4-0-20250514",
    role: "chairman",
    strength: "Harm reduction, stakeholder trade-offs, careful synthesis",
  },
  {
    id: "hum-claude-sonnet",
    name: "Claude Sonnet (implementation)",
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
    role: "member",
    strength: "Operational feasibility, partner constraints, practical sequencing",
  },
  {
    id: "hum-gpt-4o",
    name: "GPT-4o (narrative & policy)",
    provider: "openai",
    model: "gpt-4o",
    role: "member",
    strength: "Community voice, advocacy framing, policy and rights context",
  },
  {
    id: "hum-gemini-flash",
    name: "Gemini Flash (scale & evidence)",
    provider: "google",
    model: "gemini-2.0-flash",
    role: "member",
    strength: "Large evidence bases, multilingual + multimodal field inputs",
  },
  {
    id: "hum-llama-3-70b",
    name: "Llama 3 70B (accessibility)",
    provider: "groq",
    model: "llama3-70b-8192",
    role: "member",
    strength: "Low-resource angles, open models, broad accessibility",
  },
];
