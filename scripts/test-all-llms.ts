/**
 * Send one prompt to every default council model in parallel and print results.
 *
 * Required API keys (set in environment or a .env file in the repo root):
 *   ANTHROPIC_API_KEY  — Claude (Opus + Sonnet)
 *   OPENAI_API_KEY     — GPT-4o
 *   GOOGLE_API_KEY     — Gemini (or GEMINI_API_KEY)
 *   GROQ_API_KEY       — Llama on Groq
 *
 * Usage:
 *   npm run test:llms -- "Your prompt here"
 *   npm run test:llms -- --variant=vc "Grade this seed deck..."
 *   npm run test:llms -- --variant=humanitarian "Aid allocation query..."
 */

import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { parseCouncilVariantId } from "../src/council-registry.js";
import type { CouncilVariantId } from "../src/council-registry.js";
import { queryCouncilVariant } from "../src/llm-calls.js";

config({ path: join(dirname(fileURLToPath(import.meta.url)), "..", ".env") });

function divider(char = "═"): string {
  return char.repeat(72);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  let variant: CouncilVariantId = "standard";
  const words: string[] = [];

  for (const a of argv) {
    const m = /^--variant=(.+)$/i.exec(a);
    if (m) {
      const v = parseCouncilVariantId(m[1].trim());
      if (v) variant = v;
      else {
        console.error('Use --variant=standard|vc|humanitarian');
        process.exit(1);
      }
      continue;
    }
    if (a === "--variant" || a === "-V") {
      console.error("Use --variant=standard (or vc, humanitarian)");
      process.exit(1);
    }
    words.push(a);
  }

  const prompt =
    words.length > 0
      ? words.join(" ")
      : "In one short paragraph, what is 2+2 and why is consensus among calculators usually unanimous?";

  console.log(
    `${divider()}\nVariant: ${variant}\nPrompt (${prompt.length} chars):\n${prompt}\n${divider()}\n`,
  );

  const settled = await queryCouncilVariant(variant, prompt);

  for (const result of settled) {
    const header = `${result.name} (${result.memberId}) — ${result.provider}/${result.model}`;
    console.log(header);
    console.log("-".repeat(Math.min(header.length, 72)));

    if (result.ok) {
      console.log(`Latency: ${result.ms} ms\n`);
      console.log(result.text.trim());
    } else {
      console.log(`Error: ${result.error}`);
    }
    console.log("");
  }

  console.log(divider("─"));
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
