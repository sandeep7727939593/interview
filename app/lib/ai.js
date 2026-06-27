/**
 * Provider-agnostic chat completion for any OpenAI-compatible API.
 *
 * Auto-detects the provider from the API key prefix:
 *   - "gsk_..."  → Groq   (https://api.groq.com)         default model: llama-3.3-70b-versatile
 *   - "xai-..."  → xAI Grok (https://api.x.ai)            default model: grok-3
 *
 * Override anything via env:
 *   AI_API_KEY    (falls back to GROK_API_KEY)
 *   AI_BASE_URL   full chat-completions URL
 *   AI_MODEL      model id
 */

const KEY = (process.env.AI_API_KEY || process.env.GROK_API_KEY || "").trim();

function resolve() {
  const isXai = KEY.startsWith("xai-");
  const provider = isXai ? "xai" : "groq";

  let url = isXai
    ? "https://api.x.ai/v1/chat/completions"
    : "https://api.groq.com/openai/v1/chat/completions";

  let model =
    process.env.AI_MODEL ||
    (isXai ? process.env.GROK_MODEL || "grok-3" : "llama-3.3-70b-versatile");

  if (process.env.AI_BASE_URL) url = process.env.AI_BASE_URL;
  return { provider, url, model };
}

export function aiConfigured() {
  return Boolean(KEY);
}

/**
 * @param {Array<{role:string, content:string}>} messages
 * @param {{ json?: boolean, temperature?: number, timeoutMs?: number }} opts
 * @returns {Promise<{ content: string, model: string }>}
 */
export async function aiChat(messages, opts = {}) {
  const { json = false, temperature = 0.4, timeoutMs = 30000 } = opts;

  if (!KEY) {
    const e = new Error("AI not configured");
    e.code = "NO_KEY";
    throw e;
  }

  const { url, model } = resolve();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        ...(json ? { response_format: { type: "json_object" } } : {}),
        messages,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      const e = new Error(`Provider error ${res.status}`);
      e.code = "PROVIDER";
      e.status = res.status;
      e.detail = detail;
      throw e;
    }

    const data = await res.json();
    return { content: data?.choices?.[0]?.message?.content?.trim() || "", model };
  } finally {
    clearTimeout(timer);
  }
}
