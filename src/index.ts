/**
 * LLM Council — Multi-model AI deliberation.
 *
 * 5 LLMs debate every decision. The best answer wins.
 * Better than any single model. Open-source. Pluggable.
 *
 * An OliWoods Foundation project.
 * https://github.com/OliWoods-Org/llm-council
 */

import { z } from "zod";

// ============================================================================
// Council Member Types
// ============================================================================

export const ModelProvider = z.enum([
  "anthropic",
  "openai",
  "google",
  "groq",
]);
export type ModelProvider = z.infer<typeof ModelProvider>;

export const CouncilRole = z.enum([
  "chairman",
  "member",
]);
export type CouncilRole = z.infer<typeof CouncilRole>;

export const CouncilMember = z.object({
  id: z.string(),
  name: z.string(),
  provider: ModelProvider,
  model: z.string(),
  role: CouncilRole,
  strength: z.string(),
});
export type CouncilMember = z.infer<typeof CouncilMember>;

// ============================================================================
// Default Council Members (and other variants)
// ============================================================================

export { DEFAULT_COUNCIL } from "./councils/standard.js";
export { VC_DEALS_COUNCIL } from "./councils/vc-deals.js";
export { HUMANITARIAN_COUNCIL } from "./councils/humanitarian.js";
export {
  COUNCIL_VARIANT_IDS,
  COUNCIL_REGISTRY,
  getCouncilMembers,
  listCouncilVariants,
  parseCouncilVariantId,
  type CouncilVariantId,
  type CouncilVariantMeta,
} from "./council-registry.js";

// ============================================================================
// Deliberation Mode
// ============================================================================

export const CouncilMode = z.enum([
  "full",    // Architecture, security, migrations — $2-5, 30-60s
  "fast",    // Medium decisions, quick polls — $0.10, 5-10s
  "single",  // Simple tasks, bulk operations — $0.01, 1-3s
]);
export type CouncilMode = z.infer<typeof CouncilMode>;

// ============================================================================
// Scoring & Voting
// ============================================================================

export const RubricCategory = z.enum([
  "correctness",
  "completeness",
  "security",
  "performance",
  "maintainability",
]);
export type RubricCategory = z.infer<typeof RubricCategory>;

export const Score = z.object({
  category: RubricCategory,
  value: z.number().min(0).max(10),
  reasoning: z.string(),
});
export type Score = z.infer<typeof Score>;

export const Vote = z.object({
  memberId: z.string(),
  targetMemberId: z.string(),
  scores: z.array(Score),
  totalScore: z.number(),
  comments: z.string().optional(),
});
export type Vote = z.infer<typeof Vote>;

export const Opinion = z.object({
  memberId: z.string(),
  response: z.string(),
  confidence: z.number().min(0).max(1),
  timestamp: z.string().datetime(),
});
export type Opinion = z.infer<typeof Opinion>;

export const Dissent = z.object({
  memberId: z.string(),
  position: z.string(),
  reasoning: z.string(),
});
export type Dissent = z.infer<typeof Dissent>;

// ============================================================================
// Deliberation Session
// ============================================================================

export const ConsensusLevel = z.enum([
  "unanimous",       // 5/5 — 95%+ confidence
  "strong-majority", // 4/5 — 80% confidence
  "majority",        // 3/5 — 60% confidence
  "no-consensus",    // <3/5 — <50% confidence, escalate
]);
export type ConsensusLevel = z.infer<typeof ConsensusLevel>;

export const Deliberation = z.object({
  id: z.string(),
  task: z.string(),
  mode: CouncilMode,
  members: z.array(CouncilMember),
  opinions: z.array(Opinion),
  votes: z.array(Vote),
  dissents: z.array(Dissent),
  recommendation: z.string(),
  confidence: z.number().min(0).max(1),
  consensusLevel: ConsensusLevel,
  timestamp: z.string().datetime(),
  durationMs: z.number(),
  costUsd: z.number(),
});
export type Deliberation = z.infer<typeof Deliberation>;

// ============================================================================
// Complexity Scoring
// ============================================================================

export const ComplexityScore = z.object({
  score: z.number().min(1).max(10),
  factors: z.record(z.string(), z.number()),
  recommendedMode: CouncilMode,
});
export type ComplexityScore = z.infer<typeof ComplexityScore>;

// ============================================================================
// Re-exports
// ============================================================================

export { runCouncil, scoreComplexity, getConsensusLevel } from "./council.js";
export {
  queryAllMembers,
  queryCouncilVariant,
  queryMembers,
  assertPromptLength,
  type MemberResult,
} from "./llm-calls.js";
export {
  MAX_PROMPT_CHARS,
  MAX_JSON_BODY_BYTES,
  ANTHROPIC_MAX_TOKENS,
} from "./config.js";
