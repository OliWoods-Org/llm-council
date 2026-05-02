/**
 * Local dev server: serves a small UI and POST /api/ask to run all council LLMs.
 *
 *   npm run dev:server
 *
 * Loads .env from the repo root. Port: PORT or 3847.
 */

import { config } from "dotenv";
import { createServer, type IncomingMessage } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { MAX_JSON_BODY_BYTES, MAX_PROMPT_CHARS } from "./config.js";
import { queryAllMembers } from "./llm-calls.js";

/** Run `npm run dev:server` from the repo root so `.env` and `public/` resolve. */
const root = process.cwd();

config({ path: join(root, ".env") });

const PORT = Number(process.env.PORT ?? 3847);

async function handleAsk(body: string): Promise<Response> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  const prompt =
    typeof parsed === "object" &&
    parsed !== null &&
    "prompt" in parsed &&
    typeof (parsed as { prompt: unknown }).prompt === "string"
      ? (parsed as { prompt: string }).prompt.trim()
      : "";
  if (!prompt) {
    return new Response(JSON.stringify({ error: "Missing or empty \"prompt\"" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (prompt.length > MAX_PROMPT_CHARS) {
    return new Response(
      JSON.stringify({
        error: `Prompt exceeds ${MAX_PROMPT_CHARS} characters`,
      }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const results = await queryAllMembers(prompt);
  return new Response(
    JSON.stringify({ prompt, results }, null, 2),
    { headers: { "content-type": "application/json; charset=utf-8" } },
  );
}

function readBodyLimited(
  req: IncomingMessage,
  maxBytes: number,
): Promise<{ ok: true; body: string } | { ok: false; status: number; message: string }> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    let settled = false;
    req.on("data", (chunk: Buffer) => {
      if (settled) return;
      total += chunk.length;
      if (total > maxBytes) {
        settled = true;
        resolve({
          ok: false,
          status: 413,
          message: `Request body exceeds ${maxBytes} bytes`,
        });
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (settled) return;
      settled = true;
      resolve({ ok: true, body: Buffer.concat(chunks).toString("utf-8") });
    });
    req.on("error", (err) => {
      if (!settled) reject(err);
    });
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);

  if (req.method === "GET" && url.pathname === "/api/health") {
    res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        ok: true,
        service: "llm-council",
        port: PORT,
        maxPromptChars: MAX_PROMPT_CHARS,
        maxJsonBodyBytes: MAX_JSON_BODY_BYTES,
      }),
    );
    return;
  }

  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    try {
      const html = await readFile(join(root, "public", "index.html"), "utf-8");
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(html);
    } catch {
      res.writeHead(500, { "content-type": "text/plain" });
      res.end("Missing public/index.html");
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/ask") {
    const limited = await readBodyLimited(req, MAX_JSON_BODY_BYTES);
    if (!limited.ok) {
      res.writeHead(limited.status, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: limited.message }));
      return;
    }
    try {
      const out = await handleAsk(limited.body);
      res.writeHead(out.status, Object.fromEntries(out.headers.entries()));
      res.end(await out.text());
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: message }));
    }
    return;
  }

  res.writeHead(404, { "content-type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`LLM Council dev server: http://127.0.0.1:${PORT}/`);
});
