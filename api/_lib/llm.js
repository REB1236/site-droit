// Appel au modèle d'IA, en streaming. La clé reste côté serveur (variables d'environnement Vercel).

export function provider() {
  if (process.env.MOCK_LLM === "1") return { name: "mock", model: "mock" };
  if (process.env.ANTHROPIC_API_KEY) return { name: "anthropic", model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5" };
  if (process.env.OPENAI_API_KEY) return { name: "openai", model: process.env.OPENAI_MODEL || "gpt-5-mini" };
  if (process.env.GEMINI_API_KEY) return { name: "gemini", model: process.env.GEMINI_MODEL || "gemini-2.5-flash" };
  return null;
}

async function* sseLines(res) {
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (line.startsWith("data:")) yield line.slice(5).trim();
    }
  }
}

async function failure(res, who) {
  let detail = "";
  try {
    const j = await res.json();
    detail = j?.error?.message || j?.error?.type || JSON.stringify(j).slice(0, 200);
  } catch {
    detail = res.statusText;
  }
  const err = new Error(`${who} ${res.status} : ${detail}`);
  err.status = res.status;
  return err;
}

/**
 * @param {{system:string, messages:{role:"user"|"assistant",content:string}[], signal?:AbortSignal}} p
 * @returns {AsyncGenerator<string>}
 */
export async function* streamAnswer({ system, messages, signal }) {
  const p = provider();
  if (!p) throw Object.assign(new Error("NO_KEY"), { code: "NO_KEY" });

  if (p.name === "mock") {
    const words = `Réponse de test. ${messages[messages.length - 1].content.slice(0, 200)}`.split(" ");
    for (const w of words) yield w + " ";
    return;
  }

  if (p.name === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: p.model, max_tokens: 1600, system, messages, stream: true }),
    });
    if (!res.ok) throw await failure(res, "Anthropic");
    for await (const data of sseLines(res)) {
      let ev;
      try {
        ev = JSON.parse(data);
      } catch {
        continue;
      }
      if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") yield ev.delta.text;
      if (ev.type === "error") throw new Error(ev.error?.message || "Erreur Anthropic");
    }
    return;
  }

  // OpenAI et Gemini (API compatible OpenAI)
  const isGemini = p.name === "gemini";
  const url = isGemini
    ? "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const key = isGemini ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY;
  const res = await fetch(url, {
    method: "POST",
    signal,
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: p.model,
      stream: true,
      ...(isGemini ? { max_tokens: 1600 } : { max_completion_tokens: 4000 }),
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!res.ok) throw await failure(res, isGemini ? "Gemini" : "OpenAI");
  for await (const data of sseLines(res)) {
    if (data === "[DONE]") break;
    let ev;
    try {
      ev = JSON.parse(data);
    } catch {
      continue;
    }
    const t = ev.choices?.[0]?.delta?.content;
    if (t) yield t;
  }
}
