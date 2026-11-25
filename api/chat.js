import { search } from "./_lib/search.js";
import { streamAnswer, provider } from "./_lib/llm.js";
import { SYSTEM, buildUserMessage } from "./_lib/prompt.js";

// Limite simple par adresse IP (par instance) pour protéger tes crédits API
const HITS = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = Number(process.env.RATE_LIMIT || 25);

function rateLimited(ip) {
  const now = Date.now();
  const list = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  HITS.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

const SCOPES = new Set(["all", "constitution", "19-14", "35-96", "42-12", "45-12", "24-01", "43-12", "44-12", "26-03", "rg-bourse", "rg-sgmat", "decret-icmat"]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const access = process.env.ACCESS_CODE;
  if (access && req.headers["x-access-code"] !== access) {
    res.status(401).json({ error: "ACCESS_CODE" });
    return;
  }
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "local";
  if (rateLimited(ip)) {
    res.status(429).json({ error: "Trop de questions d’affilée. Réessaie dans quelques minutes." });
    return;
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  const messages = raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || last.content.trim().length < 2) {
    res.status(400).json({ error: "Question vide." });
    return;
  }
  const question = last.content.trim().slice(0, 1200);
  const scope = SCOPES.has(body.scope) ? body.scope : "all";

  // Pour les questions de suivi (« et pour les CIF ? »), on enrichit la recherche avec la question précédente
  const prevUser = [...messages].reverse().find((m, i) => i > 0 && m.role === "user");
  let hits = search(question, { scope, limit: 8 });
  if (prevUser && question.split(/\s+/).length < 8) {
    const extra = search(prevUser.content + " " + question, { scope, limit: 4 });
    for (const h of extra) if (!hits.some((x) => x.label === h.label)) hits.push(h);
    hits = hits.slice(0, 9);
  }

  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Accel-Buffering", "no");
  const send = (obj) => res.write(JSON.stringify(obj) + "\n");

  send({
    t: "sources",
    items: hits.map((h) => ({
      label: h.label,
      docId: h.docId,
      docTitle: h.docTitle,
      level: h.level,
      url: h.url,
      num: h.num,
      ctx: h.ctx,
      text: h.text.length > 1800 ? h.text.slice(0, 1780) + " (...)" : h.text,
    })),
  });

  if (!provider()) {
    send({ t: "error", v: "NO_KEY" });
    res.end();
    return;
  }

  const history = messages.slice(0, -1);
  const llmMessages = [...history, { role: "user", content: buildUserMessage(question, hits) }];
  // L'API Anthropic exige que la conversation commence par un message utilisateur
  while (llmMessages.length && llmMessages[0].role !== "user") llmMessages.shift();
  // Fusionne deux messages consécutifs du même rôle (ex. après une réponse en erreur)
  for (let i = llmMessages.length - 1; i > 0; i--) {
    if (llmMessages[i].role === llmMessages[i - 1].role) {
      llmMessages[i - 1] = { role: llmMessages[i].role, content: llmMessages[i - 1].content + "\n\n" + llmMessages[i].content };
      llmMessages.splice(i, 1);
    }
  }

  const controller = new AbortController();
  req.on?.("close", () => controller.abort());
  try {
    for await (const piece of streamAnswer({ system: SYSTEM, messages: llmMessages, signal: controller.signal })) {
      send({ t: "delta", v: piece });
    }
    send({ t: "done" });
  } catch (e) {
    if (!controller.signal.aborted) {
      const status = e && e.status;
      const msg =
        status === 401 || status === 403
          ? "La clé API est refusée par le fournisseur. Vérifie la variable d’environnement dans Vercel."
          : status === 404
            ? "Le modèle demandé n’existe pas chez ce fournisseur. Change la variable *_MODEL dans Vercel."
            : status === 429
              ? "Le fournisseur d’IA limite les requêtes (quota ou crédits). Réessaie plus tard."
              : "Le service d’IA n’a pas répondu. Réessaie dans un instant.";
      console.error("[chat]", e && e.message);
      send({ t: "error", v: msg });
    }
  }
  res.end();
}
