/**
 * Standard council — general engineering / product / MAMA routing.
 */

import type { CouncilMember } from "../index.js";

export const DEFAULT_COUNCIL: CouncilMember[] = [
  {
    id: "claude-opus",
    name: "Claude Opus",
    provider: "anthropic",
    model: "claude-opus-4-0-20250514",
    role: "chairman",
    strength: "Careful reasoning, safety, synthesis",
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
    role: "member",
    strength: "Fast + accurate, good code",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    model: "gpt-4o",
    role: "member",
    strength: "Creative, broad knowledge",
  },
  {
    id: "gemini-flash",
    name: "Gemini Flash",
    provider: "google",
    model: "gemini-2.0-flash",
    role: "member",
    strength: "Speed, multimodal, large context",
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    provider: "groq",
    model: "llama3-70b-8192",
    role: "member",
    strength: "Open-source perspective, zero cost",
  },
];
