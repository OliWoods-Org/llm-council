/**
 * LLM Council — Multi-model Deliberation Engine
 *
 * Core logic: complexity scoring, auto-routing, 3-stage deliberation
 * (independent opinions, anonymized peer review, chairman synthesis).
 */

import type {
  CouncilMode,
  ConsensusLevel,
  ComplexityScore,
  Deliberation,
  Opinion,
  Vote,
  Dissent,
} from "./index.js";
import { DEFAULT_COUNCIL } from "./index.js";

// ============================================================================
// Complexity Scoring & Auto-Routing
// ============================================================================

const KEYWORD_SCORES: Record<string, number> = {
  architecture: 8,
  migration: 9,
  security: 8,
  database: 7,
  refactor: 6,
  api: 5,
  ui: 3,
  style: 2,
  typo: 1,
};

/**
 * Score task complexity (1-10) and recommend a council mode.
 *
 * Score 1-3  -> Single Model (free, Groq Llama)
 * Score 4-6  -> Fast Council (all 5 vote, majority wins)
 * Score 7-10 -> Full Council (3-stage deliberation)
 */
export function scoreComplexity(task: string): ComplexityScore {
  const lower = task.toLowerCase();
  const factors: Record<string, number> = {};
  let total = 0;
  let count = 0;

  for (const [keyword, weight] of Object.entries(KEYWORD_SCORES)) {
    if (lower.includes(keyword)) {
      factors[keyword] = weight;
      total += weight;
      count++;
    }
  }

  const score = count > 0 ? Math.min(10, Math.round(total / count)) : 5;

  let recommendedMode: CouncilMode;
  if (score <= 3) recommendedMode = "single";
  else if (score <= 6) recommendedMode = "fast";
  else recommendedMode = "full";

  return { score, factors, recommendedMode };
}

// ============================================================================
// Consensus Calculation
// ============================================================================

/**
 * Determine consensus level from agreement count (out of 5 members).
 */
export function getConsensusLevel(agreementCount: number): ConsensusLevel {
  if (agreementCount >= 5) return "unanimous";
  if (agreementCount >= 4) return "strong-majority";
  if (agreementCount >= 3) return "majority";
  return "no-consensus";
}

function confidenceFromConsensus(level: ConsensusLevel): number {
  switch (level) {
    case "unanimous":
      return 0.95;
    case "strong-majority":
      return 0.8;
    case "majority":
      return 0.6;
    case "no-consensus":
      return 0.4;
  }
}

// ============================================================================
// Council Deliberation Engine (Skeleton)
// ============================================================================

/**
 * Run a council deliberation session.
 *
 * This is the skeleton — each stage will be filled in with actual LLM API
 * calls when connected to MAMA's autonomy engine.
 *
 * Stages:
 * 1. Independent Opinions — each model answers separately
 * 2. Anonymized Peer Review — each model scores others' plans (blind)
 * 3. Chairman Synthesis — Opus merges ranked plans into final answer
 */
export async function runCouncil(
  task: string,
  mode?: CouncilMode,
): Promise<Deliberation> {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Auto-route if no mode specified
  const complexity = scoreComplexity(task);
  const effectiveMode = mode ?? complexity.recommendedMode;

  const members = effectiveMode === "single"
    ? [DEFAULT_COUNCIL[4]] // Llama (free tier)
    : DEFAULT_COUNCIL;

  // Stage 1: Independent opinions
  const opinions: Opinion[] = members.map((member) => ({
    memberId: member.id,
    response: `[Pending LLM call to ${member.provider}/${member.model}]`,
    confidence: 0,
    timestamp,
  }));

  // Stage 2: Peer review (skip for single mode)
  const votes: Vote[] = [];

  // Stage 3: Chairman synthesis
  const dissents: Dissent[] = [];
  const consensusLevel = getConsensusLevel(0);
  const confidence = confidenceFromConsensus(consensusLevel);

  const durationMs = Date.now() - start;

  return {
    id: `council-${Date.now()}`,
    task,
    mode: effectiveMode,
    members,
    opinions,
    votes,
    dissents,
    recommendation: "[Pending deliberation — connect to MAMA autonomy engine]",
    confidence,
    consensusLevel,
    timestamp,
    durationMs,
    costUsd: 0,
  };
}
