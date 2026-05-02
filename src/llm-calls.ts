/**
 * Call each default council member with the same prompt (used by CLI and dev server).
 */

import { ANTHROPIC_MAX_TOKENS, MAX_PROMPT_CHARS } from "./config.js";
import type { CouncilMember } from "./index.js";
import { DEFAULT_COUNCIL } from "./index.js";

const ANTHROPIC_VERSION = "2023-06-01";

/** Throws if the prompt exceeds configured limits. */
export function assertPromptLength(prompt: string): void {
  if (prompt.length > MAX_PROMPT_CHARS) {
    throw new RangeError(
      `Prompt length ${prompt.length} exceeds maximum of ${MAX_PROMPT_CHARS} characters`,
    );
  }
}

function getGoogleKey(): string | undefined {
  return process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
}

async function callAnthropic(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: ANTHROPIC_MAX_TOKENS,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = (await res.json()) as {
    content?: { type: string; text: string }[];
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(data.error?.message ?? res.statusText);
  }
  const text = data.content?.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("No text in Anthropic response");
  return text;
}

async function callOpenAIChat(
  apiKey: string,
  model: string,
  prompt: string,
  baseUrl: string,
): Promise<string> {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(data.error?.message ?? res.statusText);
  }
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("No text in chat completion");
  return text;
}

async function callGemini(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(data.error?.message ?? res.statusText);
  }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No text in Gemini response");
  return text;
}

export type MemberResult =
  | {
      memberId: string;
      name: string;
      provider: CouncilMember["provider"];
      model: string;
      ok: true;
      text: string;
      ms: number;
    }
  | {
      memberId: string;
      name: string;
      provider: CouncilMember["provider"];
      model: string;
      ok: false;
      error: string;
    };

async function callMember(
  member: CouncilMember,
  prompt: string,
): Promise<MemberResult> {
  const base = {
    memberId: member.id,
    name: member.name,
    provider: member.provider,
    model: member.model,
  };
  const start = Date.now();
  try {
    let text: string;
    switch (member.provider) {
      case "anthropic": {
        const key = process.env.ANTHROPIC_API_KEY;
        if (!key) throw new Error("Missing ANTHROPIC_API_KEY");
        text = await callAnthropic(key, member.model, prompt);
        break;
      }
      case "openai": {
        const key = process.env.OPENAI_API_KEY;
        if (!key) throw new Error("Missing OPENAI_API_KEY");
        text = await callOpenAIChat(key, member.model, prompt, "https://api.openai.com/v1");
        break;
      }
      case "google": {
        const key = getGoogleKey();
        if (!key) throw new Error("Missing GOOGLE_API_KEY or GEMINI_API_KEY");
        text = await callGemini(key, member.model, prompt);
        break;
      }
      case "groq": {
        const key = process.env.GROQ_API_KEY;
        if (!key) throw new Error("Missing GROQ_API_KEY");
        text = await callOpenAIChat(key, member.model, prompt, "https://api.groq.com/openai/v1");
        break;
      }
      default: {
        const _exhaustive: never = member.provider;
        throw new Error(`Unknown provider: ${_exhaustive}`);
      }
    }
    return { ...base, ok: true, text, ms: Date.now() - start };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ...base, ok: false, error: message };
  }
}

/**
 * Query a subset of council members with the same prompt in parallel.
 */
export async function queryMembers(
  members: CouncilMember[],
  prompt: string,
): Promise<MemberResult[]> {
  assertPromptLength(prompt);
  const jobs = members.map((member) => callMember(member, prompt));
  return Promise.all(jobs);
}

/**
 * Query every member of DEFAULT_COUNCIL with the same prompt in parallel.
 */
export async function queryAllMembers(prompt: string): Promise<MemberResult[]> {
  return queryMembers(DEFAULT_COUNCIL, prompt);
}
