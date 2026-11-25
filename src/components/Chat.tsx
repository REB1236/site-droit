import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { CHAT_SUGGESTIONS } from "../lib/chat-events";

type Source = { label: string; docId: string; docTitle: string; level: string; url: string; num: string; ctx: string; text: string };
type Msg = { role: "user" | "assistant"; content: string; sources?: Source[]; error?: string; streaming?: boolean };
type Status = { configured: boolean; provider: string | null; accessCode: boolean };

const SCOPES: Array<[string, string]> = [
  ["all", "Tous les textes"],
  ["constitution", "Constitution"],
  ["43-12", "Loi 43-12 · AMMC"],
  ["44-12", "Loi 44-12 · Appel public à l’épargne"],
  ["19-14", "Loi 19-14 · Bourse"],
  ["rg-bourse", "Règlement général de la Bourse"],
  ["35-96", "Loi 35-96 · Dépositaire central"],
  ["42-12", "Loi 42-12 · Marché à terme"],
  ["rg-sgmat", "Règlement général du marché à terme"],
  ["decret-icmat", "Décret ICMAT"],
  ["45-12", "Loi 45-12 · Prêt de titres"],
  ["24-01", "Loi 24-01 · Pension"],
  ["26-03", "Loi 26-03 · Offres publiques"],
];

const NO_KEY =
  "Le chatbot n’est pas encore branché : ajoute ta clé API (ANTHROPIC_API_KEY, OPENAI_API_KEY ou GEMINI_API_KEY) dans Vercel, puis redéploie. En attendant, les extraits trouvés dans les textes s’affichent ci-dessous.";

function readCode(): string {
  try {
    return window.localStorage.getItem("mdc-access-code") || "";
  } catch {
    return "";
  }
}
function saveCode(c: string) {
  try {
    window.localStorage.setItem("mdc-access-code", c);
  } catch {
    /* stockage indisponible */
  }
}

function SourceList({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<number | null>(null);
  if (!sources.length) return null;
  return (
    <div className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs font-medium text-[var(--ink-2)]"
        aria-expanded={open}
      >
        <span>Extraits consultés ({sources.length})</span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open ? (
        <ul className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
          {sources.map((s, i) => (
            <li key={s.label + i} className="px-3.5 py-2.5">
              <div className="flex items-start justify-between gap-3">
                <button onClick={() => setShown(shown === i ? null : i)} className="text-left">
                  <span className="mono block text-[11px] text-[var(--accent-deep)]">{s.label}</span>
                  {s.ctx ? <span className="block text-[11px] text-[var(--muted)]">{s.ctx}</span> : null}
                </button>
                {s.url && s.url.startsWith("https://") ? (
                  <a href={s.url} target="_blank" rel="noreferrer" className="mono shrink-0 text-[11px] text-[var(--muted)] hover:text-[var(--accent)]">
                    Texte ↗
                  </a>
                ) : null}
              </div>
              {shown === i ? <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-[var(--ink-2)]">{s.text}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Answer({ m }: { m: Msg }) {
  return (
    <div className="max-w-full">
      {m.content ? (
        <div className="chat-md text-[0.93rem] leading-relaxed text-[var(--ink)]">
          <ReactMarkdown
            components={{
              a: ({ href, children }) =>
                href && href.startsWith("https://") ? (
                  <a href={href} target="_blank" rel="noreferrer" className="text-[var(--accent-deep)] underline">
                    {children}
                  </a>
                ) : (
                  <span>{children}</span>
                ),
            }}
          >
            {m.content}
          </ReactMarkdown>
        </div>
      ) : m.streaming ? (
        <div className="space-y-2" aria-live="polite">
          <span className="sr-only">L’assistant rédige sa réponse</span>
          <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--paper-2)]" />
          <div className="h-3 w-full animate-pulse rounded bg-[var(--paper-2)]" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-[var(--paper-2)]" />
        </div>
      ) : null}
      {m.error ? <p className="mt-2 rounded-xl bg-[#F8E3E1] px-3.5 py-2.5 text-sm text-[#8C1D18]">{m.error}</p> : null}
      {m.sources ? <SourceList sources={m.sources} /> : null}
    </div>
  );
}

export function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [scope, setScope] = useState("all");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [code, setCode] = useState("");
  const [codeDraft, setCodeDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const msgsRef = useRef<Msg[]>([]);
  msgsRef.current = msgs;

  useEffect(() => {
    setCode(readCode());
  }, []);

  useEffect(() => {
    if (!open || status) return;
    fetch("/api/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((s: Status | null) => setStatus(s ?? { configured: false, provider: null, accessCode: false }))
      .catch(() => setStatus({ configured: false, provider: null, accessCode: false }));
  }, [open, status]);

  const send = useCallback(
    async (text: string, scopeOverride?: string) => {
      const t = text.trim();
      if (t.length < 2 || busy) return;
      const history = msgsRef.current
        .filter((m) => m.content && !m.error)
        .map((m) => ({ role: m.role, content: m.content }));
      const next: Msg[] = [...msgsRef.current, { role: "user", content: t }, { role: "assistant", content: "", streaming: true }];
      setMsgs(next);
      setQ("");
      setBusy(true);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const update = (fn: (m: Msg) => Msg) =>
        setMsgs((all) => {
          const copy = all.slice();
          copy[copy.length - 1] = fn(copy[copy.length - 1]);
          return copy;
        });
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          signal: ctrl.signal,
          headers: { "Content-Type": "application/json", ...(readCode() ? { "x-access-code": readCode() } : {}) },
          body: JSON.stringify({ messages: [...history, { role: "user", content: t }], scope: scopeOverride || scope }),
        });
        if (!res.ok || !res.body) {
          let err = "Le service n’a pas répondu. Réessaie dans un instant.";
          try {
            const j = await res.json();
            if (j.error === "ACCESS_CODE") {
              err = "Code d’accès requis ou incorrect.";
              setStatus((s) => (s ? { ...s, accessCode: true } : s));
              saveCode("");
              setCode("");
            } else if (j.error) err = j.error;
          } catch {
            /* réponse non JSON */
          }
          update((m) => ({ ...m, streaming: false, error: err }));
          return;
        }
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let i: number;
          while ((i = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, i).trim();
            buf = buf.slice(i + 1);
            if (!line) continue;
            let ev: { t: string; v?: string; items?: Source[] };
            try {
              ev = JSON.parse(line);
            } catch {
              continue;
            }
            if (ev.t === "sources") update((m) => ({ ...m, sources: ev.items }));
            else if (ev.t === "delta") update((m) => ({ ...m, content: m.content + (ev.v || "") }));
            else if (ev.t === "error") update((m) => ({ ...m, error: ev.v === "NO_KEY" ? NO_KEY : ev.v }));
          }
        }
        update((m) => ({ ...m, streaming: false }));
      } catch (e) {
        const aborted = e instanceof DOMException && e.name === "AbortError";
        update((m) => ({ ...m, streaming: false, error: aborted ? (m.content ? undefined : "Réponse interrompue.") : "Connexion perdue. Réessaie." }));
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, scope],
  );
  const sendRef = useRef(send);
  sendRef.current = send;

  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      const d = (e as CustomEvent<{ question: string | null; scope: string | null }>).detail;
      if (d?.scope) setScope(d.scope);
      if (d?.question) window.setTimeout(() => void sendRef.current(d.question as string, d.scope || undefined), 0);
    };
    window.addEventListener("open-chat", onOpen);
    return () => window.removeEventListener("open-chat", onOpen);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight });
  }, [msgs]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const needCode = Boolean(status?.accessCode && !code);

  return (
    <>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="assistant-launch fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-[var(--ink)] py-2.5 pl-2.5 pr-5 text-sm font-medium text-[var(--paper)] shadow-[0_10px_30px_-10px_rgba(14,31,27,.55)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
          aria-label="Ouvrir l’assistant IA"
        >
          <span className="zellige grid h-8 w-8 place-items-center rounded-full text-base" aria-hidden="true">
            §
          </span>
          Assistant IA
        </button>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-label="Assistant IA du marché des capitaux"
          className="assistant-panel fixed inset-0 z-50 flex flex-col bg-[var(--paper)] md:inset-auto md:bottom-5 md:right-5 md:h-[min(760px,calc(100dvh-40px))] md:w-[500px] md:overflow-hidden md:rounded-[18px] md:border md:border-[var(--line)] md:shadow-[0_30px_80px_-30px_rgba(14,31,27,.5)]"
        >
          <header className="flex items-start justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
            <div>
              <p className="font-semibold tracking-tight">Assistant IA</p>
              <p className="mt-0.5 text-xs leading-snug text-[var(--muted)]">
                Il lit la Constitution, les lois, décrets et règlements du marché des capitaux, explique et cite les articles.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              {msgs.length ? (
                <button
                  onClick={() => {
                    abortRef.current?.abort();
                    setMsgs([]);
                  }}
                  className="h-9 rounded-full border border-[var(--line)] px-3 text-xs font-medium transition-colors hover:bg-[var(--paper-2)]"
                >
                  Nouvelle discussion
                </button>
              ) : null}
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-lg leading-none transition-colors hover:bg-[var(--paper-2)]"
                aria-label="Fermer l’assistant"
              >
                ×
              </button>
            </div>
          </header>

          <div ref={listRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {status && !status.configured ? (
              <p className="rounded-xl bg-[var(--accent-soft)] px-3.5 py-3 text-xs leading-relaxed text-[var(--accent-deep)]">{NO_KEY}</p>
            ) : null}

            {needCode ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!codeDraft.trim()) return;
                  saveCode(codeDraft.trim());
                  setCode(codeDraft.trim());
                }}
                className="rounded-xl border border-[var(--line)] p-4"
              >
                <label htmlFor="mdc-code" className="block text-sm font-medium">
                  Code d’accès
                </label>
                <p className="mt-1 text-xs text-[var(--muted)]">Ce chatbot est réservé : entre le code donné par l’auteur du site.</p>
                <div className="mt-3 flex gap-2">
                  <input
                    id="mdc-code"
                    value={codeDraft}
                    onChange={(e) => setCodeDraft(e.target.value)}
                    className="flex-1 rounded-lg border border-[var(--line)] px-3 py-2 text-[16px] md:text-sm"
                    autoComplete="off"
                  />
                  <button className="rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-white">Valider</button>
                </div>
              </form>
            ) : null}

            {msgs.length === 0 && !needCode ? (
              <div>
                <p className="text-sm leading-relaxed text-[var(--ink-2)]">
                  Pose ta question comme à un prof. Tu peux aussi demander un article précis, par exemple « explique l’article 38 de la loi 19-14 ».
                </p>
                <div className="mt-4 flex flex-col items-start gap-2">
                  {CHAT_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => void send(s)}
                      className="rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3.5 py-2 text-left text-sm transition-colors hover:border-[var(--accent)]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {msgs.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-br-md bg-[var(--ink)] px-4 py-2.5 text-sm text-[var(--paper)]">{m.content}</p>
                </div>
              ) : (
                <Answer key={i} m={m} />
              ),
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(q);
            }}
            className="border-t border-[var(--line)] px-4 pb-4 pt-3"
          >
            <label htmlFor="chat-scope" className="sr-only">
              Chercher dans
            </label>
            <select
              id="chat-scope"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="mono mb-2 max-w-full rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-xs text-[var(--ink-2)]"
            >
              {SCOPES.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <div className="flex items-end gap-2">
              <label htmlFor="chat-q" className="sr-only">
                Ta question
              </label>
              <textarea
                id="chat-q"
                ref={inputRef}
                rows={1}
                value={q}
                disabled={needCode}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(q);
                  }
                }}
                placeholder="Ex : à quoi sert le règlement général de la Bourse ?"
                className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3.5 py-2.5 text-[16px] leading-snug outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] md:text-sm"
              />
              {busy ? (
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--ink)] text-sm"
                  aria-label="Arrêter la réponse"
                >
                  ■
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={q.trim().length < 2 || needCode}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--accent)] text-lg text-white transition-colors hover:bg-[var(--accent-deep)] disabled:opacity-40"
                  aria-label="Envoyer"
                >
                  ↑
                </button>
              )}
            </div>
            <p className="mt-2 text-[11px] leading-snug text-[var(--muted)]">
              Réponses générées par IA à partir des textes officiels : vérifie toujours l’article cité. Pas un avis juridique ni un conseil d’investissement.
            </p>
          </form>
        </div>
      ) : null}
    </>
  );
}
