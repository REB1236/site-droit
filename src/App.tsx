import { useEffect, type ReactElement } from "react";

import { Chat } from "./components/Chat";
import { openChat } from "./lib/chat-events";
import { Cours, Monogram } from "./pages/Cours";
import { Investir } from "./pages/Investir";
import { Sources } from "./pages/Sources";

const PAGES: Record<string, { title: string; render: () => ReactElement }> = {
  "/": { title: "Marché des capitaux · Maroc", render: () => <Cours /> },
  "/sources": { title: "Sources juridiques · Marché des capitaux", render: () => <Sources /> },
  "/investir": { title: "Investir en Bourse au Maroc · Marché des capitaux", render: () => <Investir /> },
};

const NAV: Array<[string, string]> = [
  ["/", "Le cours"],
  ["/sources", "Sources juridiques"],
  ["/investir", "Investir en Bourse"],
  ["/#quiz", "Quiz"],
];

function currentPath() {
  const p = window.location.pathname.replace(/\/+$/, "") || "/";
  return PAGES[p] ? p : "/";
}

export function App() {
  const path = currentPath();
  const page = PAGES[path];

  useEffect(() => {
    document.title = page.title;
  }, [page]);

  return (
    <>
      <header className="nav-glass sticky top-0 z-40 border-b border-[var(--line)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <Monogram size={28} />
            <span className="hidden sm:inline">Marché des capitaux</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-[var(--ink-2)] lg:flex" aria-label="Navigation principale">
            {NAV.map(([href, label]) => (
              <a
                key={href}
                href={href}
                aria-current={href === path ? "page" : undefined}
                className={`transition-colors hover:text-[var(--accent)] ${href === path ? "font-semibold text-[var(--ink)]" : ""}`}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <details className="relative lg:hidden">
              <summary className="cursor-pointer list-none rounded-full border border-[var(--line)] px-4 py-1.5 text-sm font-medium">Menu</summary>
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--line)] bg-[var(--paper)] p-2 shadow-lg">
                {NAV.map(([href, label]) => (
                  <a key={href} href={href} className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--paper-2)]">
                    {label}
                  </a>
                ))}
              </div>
            </details>
            <button
              onClick={() => openChat()}
              className="rounded-full border border-[var(--ink)] px-4 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
            >
              Assistant IA
            </button>
          </div>
        </div>
      </header>

      {page.render()}

      <footer className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5 text-[var(--ink)]">
            <Monogram size={22} />
            <span className="font-medium">Infrastructures du marché des capitaux et marché à terme</span>
          </div>
          <p>Site pédagogique. Pas un avis juridique ni un conseil en investissement.</p>
        </div>
      </footer>
      <Chat />
    </>
  );
}
