/**
 * Tunable limits for prompts, HTTP bodies, and provider parameters.
 * Override via environment where noted.
 */

/** Maximum characters accepted for a single prompt (dev API + query helpers). */
export const MAX_PROMPT_CHARS = Number(process.env.COUNCIL_MAX_PROMPT_CHARS ?? 32_000);

/** Maximum raw JSON body size for POST /api/ask (bytes). */
export const MAX_JSON_BODY_BYTES = Number(process.env.COUNCIL_MAX_BODY_BYTES ?? 524_288);

/** Anthropic Messages API max_tokens. */
export const ANTHROPIC_MAX_TOKENS = Number(process.env.COUNCIL_ANTHROPIC_MAX_TOKENS ?? 4096);
