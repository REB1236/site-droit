import { useState } from "react";

import { CHAT_SUGGESTIONS, openChat } from "../lib/chat-events";

export function Cours() {
  return (
    <>
      <main>
        <Hero />
        <Cas />
        <Parcours />
        <Bourse />
        <Intermediaires />
        <PostMarche />
        <MarcheATerme />
        <Connexes />
        <Revision />
        <AssistantSection />
        <Sources />
      </main>
    </>
  );
}

/* ---------- Shared bits ---------- */

export function Monogram({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="var(--accent)" />
      <path d="M32 10 L54 32 L32 54 L10 32 Z" fill="none" stroke="var(--paper)" strokeWidth="4" />
      <path
        d="M18 40 L28 30 L35 36 L46 24"
        fill="none"
        stroke="var(--paper)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LawTag({ children }: { children: string }) {
  return (
    <span className="mono inline-flex items-center rounded-full border border-[var(--accent)] px-3 py-1 text-xs text-[var(--accent-deep)]">
      {children}
    </span>
  );
}

function SectionHead({ title, law, intro }: { title: string; law?: string; intro?: string }) {
  return (
    <div className="max-w-3xl">
      {law ? <LawTag>{law}</LawTag> : null}
      <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-tighter md:text-5xl">{title}</h2>
      {intro ? <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-[var(--ink-2)] md:text-lg">{intro}</p> : null}
    </div>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section id="top" className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 md:grid-cols-[1fr_1.05fr] md:pt-20">
      <div>
        <p className="mono text-sm text-[var(--accent-deep)]">Lois 19-14 · 35-96 · 42-12</p>
        <h1 className="hero-rise mt-4 text-[2.6rem] font-semibold leading-[1.02] tracking-tighter md:text-[3.7rem]">
          Le trajet d’un ordre de bourse au Maroc
        </h1>
        <p className="hero-rise-2 mt-5 max-w-[46ch] text-lg leading-relaxed text-[var(--ink-2)]">
          Bourse, intermédiaires, dépositaire central et marché à terme : qui fait quoi, et quelles règles sécurisent
          chaque étape.
        </p>
        <a
          href="#parcours"
          className="cta-follow mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--accent)] py-3 pl-6 pr-3 font-medium text-white transition-colors hover:bg-[var(--accent-deep)]"
        >
          Suivre l’ordre
          <span className="arrow grid h-8 w-8 place-items-center rounded-full bg-white/15" aria-hidden="true">
            ↓
          </span>
        </a>
      </div>
      <figure className="overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--paper-2)]">
        <img
          src="/assets/parcours.jpg"
          alt="Diorama en papier découpé : un ordre part d’un téléphone, traverse la Bourse et une société de bourse, puis entre dans le coffre du dépositaire central."
          className="aspect-[3/2] h-full w-full object-cover"
          width={1024}
          height={688}
        />
      </figure>
    </section>
  );
}

/* ---------- Le cas ---------- */

const CAS = [
  { when: "Jour J", text: "Une étudiante achète 1 000 actions d’une société cotée depuis l’application de sa banque." },
  { when: "Deux jours plus tard", text: "Les titres apparaissent sur son compte-titres." },
  {
    when: "Au même moment",
    text: "Une banque se couvre contre une baisse du marché avec le tout nouveau contrat à terme sur indice.",
  },
];

function Cas() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--paper-2)]">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <SectionHead title="La situation de départ" />
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-0">
          {CAS.map((c, i) => (
            <li key={c.when} className="relative md:pr-8">
              <div className="flex items-center gap-3">
                <span className="mono grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-sm text-[var(--paper)]">
                  {i + 1}
                </span>
                {i < CAS.length - 1 ? <span className="hidden h-px flex-1 bg-[var(--ink)]/30 md:block" /> : null}
              </div>
              <p className="mt-4 font-semibold">{c.when}</p>
              <p className="mt-1.5 max-w-[34ch] leading-relaxed text-[var(--ink-2)]">{c.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <blockquote className="border-l-4 border-[var(--accent)] pl-6">
            <p className="text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              “Quels acteurs et quelles règles garantissent qu’un ordre de bourse aboutit en toute sécurité, et quel
              cadre pour le marché à terme lancé en 2026 ?”
            </p>
            <footer className="mt-3 text-sm text-[var(--muted)]">La problématique de la séance</footer>
          </blockquote>
          <div>
            <p className="font-semibold">Objectifs</p>
            <ul className="mt-3 space-y-3 text-[var(--ink-2)]">
              <li className="flex gap-3">
                <Check />
                Décrire l’organisation de la Bourse de Casablanca et des intermédiaires (loi 19-14).
              </li>
              <li className="flex gap-3">
                <Check />
                Comprendre le rôle du dépositaire central et du post-marché (loi 35-96).
              </li>
              <li className="flex gap-3">
                <Check />
                Analyser le cadre du marché à terme (loi 42-12) et son lancement en 2026.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg className="mt-1 h-4 w-4 shrink-0" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="var(--accent)" />
      <path d="M4.5 8.2 L7 10.6 L11.5 5.6" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Parcours (stepper) ---------- */

const STEPS = [
  {
    who: "La banque de l’étudiante",
    role: "Teneur de comptes",
    law: "Loi 35-96",
    text: "L’étudiante saisit son ordre d’achat dans l’application. Sa banque tient son compte-titres, vérifie qu’elle dispose des fonds et transmet l’ordre.",
  },
  {
    who: "La société de bourse",
    role: "Négociateur",
    law: "Loi 19-14",
    text: "Seules les sociétés de bourse peuvent négocier en Bourse : c’est leur monopole. Elles exécutent l’ordre sous le contrôle de l’AMMC.",
  },
  {
    who: "La Bourse de Casablanca",
    role: "Société gestionnaire",
    law: "Loi 19-14",
    text: "L’ordre rejoint le carnet d’ordres et rencontre un vendeur. La société gestionnaire assure la cotation, diffuse les cours et surveille les séances, selon le règlement général.",
  },
  {
    who: "Maroclear",
    role: "Dépositaire central",
    law: "Loi 35-96",
    text: "Vient le dénouement : les titres quittent le compte du vendeur pendant que le prix est payé. Livraison et paiement se font en même temps.",
  },
  {
    who: "Le compte-titres",
    role: "Inscription en compte",
    law: "Loi 35-96",
    text: "Deux jours plus tard, les 1 000 actions apparaissent sur le compte de l’étudiante. Aucun papier : les titres sont dématérialisés et inscrits en compte.",
  },
];

function Parcours() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  return (
    <section id="parcours" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHead
        title="Suivre l’ordre, étape par étape"
        intro="Cinq acteurs se passent le relais entre le clic de l’étudiante et l’arrivée des titres sur son compte. Clique sur une étape."
      />
      <div className="mt-12 grid gap-8 md:grid-cols-[280px_1fr]">
        <ol className="relative space-y-1" role="tablist" aria-label="Étapes de l’ordre">
          <span className="absolute bottom-5 left-[19px] top-5 w-px bg-[var(--line)]" aria-hidden="true" />
          {STEPS.map((st, i) => {
            const active = i === step;
            const past = i < step;
            return (
              <li key={st.who} className="relative">
                <button
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStep(i)}
                  className={`flex w-full items-center gap-4 rounded-xl px-0 py-2.5 text-left transition-colors ${
                    active ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  <span
                    className={`mono relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border text-sm transition-colors ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : past
                          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-deep)]"
                          : "border-[var(--line)] bg-[var(--paper)]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={active ? "font-semibold" : "font-medium"}>{st.who}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="zellige-soft rounded-[18px] p-2">
          <div key={step} className="step-panel flex h-full flex-col rounded-[14px] bg-[var(--paper)] p-7 md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="mono text-5xl font-medium text-[var(--accent)] md:text-6xl">0{step + 1}</span>
              <span className="rounded-full bg-[var(--ink)] px-3 py-1 text-xs font-medium text-[var(--paper)]">{s.role}</span>
              <LawTag>{s.law}</LawTag>
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">{s.who}</h3>
            <p className="mt-3 max-w-[58ch] text-lg leading-relaxed text-[var(--ink-2)]">{s.text}</p>
            <div className="mt-auto flex items-center justify-between pt-10 text-sm">
              <button
                onClick={() => setStep((v) => Math.max(0, v - 1))}
                disabled={step === 0}
                className="font-medium underline decoration-[var(--line)] underline-offset-4 transition-colors hover:decoration-[var(--accent)] disabled:opacity-40"
              >
                ← Étape précédente
              </button>
              <button
                onClick={() => setStep((v) => Math.min(STEPS.length - 1, v + 1))}
                disabled={step === STEPS.length - 1}
                className="font-medium underline decoration-[var(--line)] underline-offset-4 transition-colors hover:decoration-[var(--accent)] disabled:opacity-40"
              >
                Étape suivante →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- I. Bourse ---------- */

function Bourse() {
  return (
    <section id="bourse" className="border-t border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead
          title="I. La Bourse des valeurs"
          law="Loi n° 19-14"
          intro="La loi 19-14 modernise le marché boursier marocain. Elle organise qui gère la Bourse, avec quelles règles, et sur quels compartiments."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <div className="rounded-[18px] bg-[var(--ink)] p-8 text-[var(--paper)] md:row-span-2">
            <p className="text-sm text-[var(--paper)]/70">Les trois axes de la réforme</p>
            <ul className="mt-6 space-y-6">
              {["Diversification des instruments", "Élargissement des acteurs", "Renforcement de la régulation"].map((a, i) => (
                <li key={a} className="border-t border-white/15 pt-5">
                  <span className="mono text-sm text-[#7FD3BC]">0{i + 1}</span>
                  <p className="mt-1 text-2xl font-semibold leading-tight tracking-tight">{a}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="zellige rounded-[18px] p-8 text-white md:col-span-2">
            <h3 className="text-2xl font-semibold tracking-tight">La société gestionnaire</h3>
            <p className="mt-3 max-w-[52ch] leading-relaxed text-white/90">
              La Bourse de Casablanca est une société gestionnaire concessionnaire. Elle assure la cotation des titres, la
              diffusion des cours et la surveillance des séances.
            </p>
          </div>
          <div className="rounded-[18px] border border-[var(--line)] bg-[var(--paper)] p-8">
            <h3 className="text-xl font-semibold tracking-tight">Le règlement général</h3>
            <p className="mt-3 leading-relaxed text-[var(--ink-2)]">
              Il fixe les compartiments, les conditions d’admission à la cote et les règles de négociation.
            </p>
          </div>
          <div className="rounded-[18px] bg-[var(--accent-soft)] p-8">
            <h3 className="text-xl font-semibold tracking-tight">Les compartiments</h3>
            <p className="mt-3 leading-relaxed text-[var(--ink-2)]">
              Un marché actions découpé en plusieurs segments, et un marché obligataire.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- II. Intermédiaires ---------- */

const INTERMEDIAIRES = [
  {
    name: "Sociétés de bourse",
    text: "Elles ont le monopole de la négociation : tout ordre passe par elles pour être exécuté en Bourse.",
    control: "Soumises à l’AMMC",
  },
  {
    name: "Conseillers en investissement financier (CIF)",
    text: "Ils conseillent les investisseurs sur leurs placements. Ce statut a été créé par la loi 19-14.",
    control: "Sous contrôle de l’AMMC",
  },
  {
    name: "Teneurs de comptes",
    text: "Banques ou sociétés habilitées à tenir les comptes-titres des investisseurs et à y inscrire leurs titres.",
    control: "Habilités (loi 35-96)",
  },
];

function Intermediaires() {
  return (
    <section id="intermediaires" className="border-t border-[var(--line)] bg-[var(--paper-2)]">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <SectionHead
          title="II. Les intermédiaires"
          intro="L’investisseur n’accède jamais seul au marché. Trois familles d’intermédiaires l’accompagnent, sous l’œil de l’AMMC, le régulateur du marché des capitaux."
        />
        <div className="mt-12 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {INTERMEDIAIRES.map((it) => (
            <div key={it.name} className="grid gap-2 py-7 md:grid-cols-[1fr_1.6fr_auto] md:items-baseline md:gap-10">
              <h3 className="text-xl font-semibold tracking-tight">{it.name}</h3>
              <p className="max-w-[58ch] leading-relaxed text-[var(--ink-2)]">{it.text}</p>
              <p className="mono text-sm text-[var(--accent-deep)] md:text-right">{it.control}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- III. Post-marché ---------- */

function PostMarche() {
  const [run, setRun] = useState(0);
  return (
    <section id="post-marche" className="border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-[1fr_1.1fr] md:items-start">
        <div className="md:sticky md:top-24">
          <img
            src="/assets/post-marche.jpg"
            alt="Des certificats papier se transforment en lignes d’un registre et entrent dans un coffre encadré de zellige."
            className="aspect-[3/2] w-full rounded-[18px] border border-[var(--line)] object-cover"
            width={1024}
            height={688}
            loading="lazy"
          />
        </div>
        <div>
          <SectionHead
            title="III. Le post-marché"
            law="Loi n° 35-96"
            intro="Une fois l’ordre exécuté, il faut le dénouer : livrer les titres et payer le prix. C’est le travail du post-marché, organisé autour du dépositaire central."
          />
          <dl className="mt-10 space-y-7">
            <div>
              <dt className="font-semibold">Dématérialisation</dt>
              <dd className="mt-1 leading-relaxed text-[var(--ink-2)]">
                Les titres n’existent plus sur papier. Ils sont inscrits en compte, ce qui supprime les risques de perte, de
                vol et les lenteurs.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Maroclear, dépositaire central</dt>
              <dd className="mt-1 leading-relaxed text-[var(--ink-2)]">
                Il conserve les titres et les fait circuler par virement de compte à compte entre teneurs de comptes.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Règlement-livraison</dt>
              <dd className="mt-1 leading-relaxed text-[var(--ink-2)]">
                Livraison des titres et paiement du prix ont lieu en même temps. Personne ne livre sans être payé, personne
                ne paie sans être livré.
              </dd>
            </div>
          </dl>

          <div className="mt-10 rounded-[18px] border border-[var(--line)] bg-[var(--paper-2)] p-6">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Le dénouement, en direct</p>
              <button
                onClick={() => setRun((r) => r + 1)}
                className="rounded-full border border-[var(--accent)] px-4 py-1.5 text-sm font-medium text-[var(--accent-deep)] transition-colors hover:bg-[var(--accent)] hover:text-white"
              >
                {run === 0 ? "Lancer" : "Rejouer"}
              </button>
            </div>
            <div key={run} className={`relative mt-6 ${run > 0 ? "dvp-go" : ""}`} style={{ ["--dvp-dist" as string]: "calc(100% - 7rem)" }}>
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-[var(--paper)] px-3 py-2 text-sm font-medium">Vendeur</span>
                <span className="mono text-xs text-[var(--muted)]">via Maroclear</span>
                <span className="rounded-lg bg-[var(--paper)] px-3 py-2 text-sm font-medium">Acheteur</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-9">
                  <span className="dvp-titres inline-flex h-9 items-center rounded-full bg-[var(--accent)] px-4 text-sm font-medium text-white">
                    1 000 titres →
                  </span>
                </div>
                <div className="flex h-9 justify-end">
                  <span className="dvp-prix inline-flex h-9 items-center rounded-full bg-[var(--ink)] px-4 text-sm font-medium text-[var(--paper)]">
                    ← Prix payé
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm text-[var(--muted)]">Les deux flux partent et arrivent ensemble : c’est la sécurité du dénouement.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- IV. Marché à terme ---------- */

const ACTEURS = [
  ["Société gestionnaire", "Organise le marché à terme et la cotation des contrats."],
  [
    "Chambre de compensation",
    "Contrepartie centrale : elle s’interpose entre acheteur et vendeur et garantit la bonne fin des contrats.",
  ],
  ["Membres", "Négocient et compensent les contrats, pour leur compte ou celui de leurs clients."],
  ["ICMAT", "Instance de coordination du marché à terme, qui réunit Bank Al-Maghrib et l’AMMC."],
];

function MarcheATerme() {
  return (
    <section id="terme" className="border-t border-[var(--line)] bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="max-w-3xl">
          <span className="mono inline-flex rounded-full border border-[#7FD3BC] px-3 py-1 text-xs text-[#7FD3BC]">Loi n° 42-12</span>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-tighter md:text-5xl">IV. Le marché à terme</h2>
          <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-[var(--paper)]/80">
            Sur un marché à terme, on fixe aujourd’hui le prix d’une opération qui sera dénouée plus tard. Il sert à se
            couvrir contre les risques et apporte de la liquidité au marché.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.25fr_1fr]">
          <ul className="divide-y divide-white/15 border-y border-white/15">
            {ACTEURS.map(([n, t]) => (
              <li key={n} className="grid gap-1 py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
                <p className="font-semibold">{n}</p>
                <p className="leading-relaxed text-[var(--paper)]/75">{t}</p>
              </li>
            ))}
          </ul>
          <div className="zellige flex flex-col rounded-[18px] p-8">
            <p className="text-sm text-white/80">Lancement en 2026</p>
            <p className="mt-3 text-4xl font-semibold tracking-tighter">6 avril 2026</p>
            <p className="mt-1 text-white/85">Première séance du marché à terme à la Bourse de Casablanca.</p>
            <div className="mt-6 border-t border-white/25 pt-5">
              <p className="text-sm text-white/80">Produit phare</p>
              <p className="mt-1 text-2xl font-semibold">Future MASI 20</p>
              <p className="mt-1 text-sm leading-relaxed text-white/85">
                Un contrat à terme sur l’indice des 20 valeurs les plus liquides de la cote.
              </p>
            </div>
            <p className="mono mt-6 text-xs leading-relaxed text-white/80">
              1re séance : 4 échéances cotées, près de 17 MDH échangés, 695 contrats ouverts (Médias24).
            </p>
          </div>
        </div>

        <Simulateur />
      </div>
    </section>
  );
}

function spaced(n: number) {
  return Math.abs(Math.round(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
function signed(n: number) {
  if (n === 0) return "0 MAD";
  return `${n > 0 ? "+" : "−"}${spaced(n)} MAD`;
}

function Simulateur() {
  const [niveau, setNiveau] = useState(900);
  const [couvert, setCouvert] = useState(true);
  const portefeuille = 10_000_000;
  const depart = 1000;
  const valeurPoint = 100;
  const contrats = 100;
  const varPortefeuille = portefeuille * (niveau / depart - 1);
  const varFutures = couvert ? (depart - niveau) * valeurPoint * contrats : 0;
  const net = varPortefeuille + varFutures;
  const maxAbs = 2_000_000;
  const rows: Array<[string, number, string]> = [
    ["Portefeuille d’actions", varPortefeuille, "var(--paper)"],
    ["Position vendeuse de 100 Futures", varFutures, "#7FD3BC"],
  ];

  return (
    <div className="mt-16 grid gap-10 rounded-[18px] bg-[var(--paper)] p-7 text-[var(--ink)] md:grid-cols-[1fr_1.15fr] md:p-10">
      <div className="flex flex-col">
        <img
          src="/assets/couverture.jpg"
          alt="Une balance en papier reste à l’équilibre au-dessus d’une courbe d’indice qui baisse."
          className="aspect-[3/2] w-full rounded-[14px] object-cover"
          width={1024}
          height={688}
          loading="lazy"
        />
        <h3 className="mt-6 text-2xl font-semibold tracking-tight">La couverture de la banque, en chiffres</h3>
        <p className="mt-2 leading-relaxed text-[var(--ink-2)]">
          La banque détient 10 millions de MAD d’actions qui suivent le MASI 20. Elle vend 100 Futures à 1 000 points. Si
          le marché baisse, la perte sur les actions est compensée par le gain sur les Futures.
        </p>
        <p className="mt-auto pt-6 text-xs leading-relaxed text-[var(--muted)]">
          Exemple pédagogique aux chiffres fictifs (valeur du point supposée à 100 MAD). Les vraies caractéristiques sont
          fixées par la fiche technique du contrat.
        </p>
      </div>

      <div>
        <label htmlFor="niveau" className="flex items-baseline justify-between">
          <span className="font-medium">Niveau du MASI 20 à l’échéance</span>
          <span className="mono text-2xl font-medium text-[var(--accent)]">{niveau} pts</span>
        </label>
        <input
          id="niveau"
          type="range"
          min={800}
          max={1200}
          step={10}
          value={niveau}
          onChange={(e) => setNiveau(Number(e.target.value))}
          className="sim mt-4"
        />
        <div className="mono mt-1 flex justify-between text-xs text-[var(--muted)]">
          <span>800</span>
          <span>1 000</span>
          <span>1 200</span>
        </div>

        <button
          role="switch"
          aria-checked={couvert}
          onClick={() => setCouvert((c) => !c)}
          className="mt-6 flex items-center gap-3 text-sm font-medium"
        >
          <span className={`relative h-6 w-11 rounded-full transition-colors ${couvert ? "bg-[var(--accent)]" : "bg-[var(--line)]"}`}>
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${couvert ? "translate-x-[22px]" : "translate-x-0.5"}`}
            />
          </span>
          {couvert ? "Couverture activée" : "Sans couverture"}
        </button>

        <div className="mt-7 space-y-5">
          {rows.map(([label, v, color]) => (
            <div key={label}>
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span className={`mono ${v < 0 ? "text-[#B3261E]" : v > 0 ? "text-[var(--accent-deep)]" : "text-[var(--muted)]"}`}>
                  {signed(v)}
                </span>
              </div>
              <div className="relative mt-2 h-3 rounded-full bg-[var(--paper-2)]">
                <span className="absolute left-1/2 top-[-3px] h-[18px] w-px bg-[var(--ink)]/40" />
                <span
                  className="bar absolute top-0 h-3 rounded-full"
                  style={{
                    width: `${(Math.min(Math.abs(v), maxAbs) / maxAbs) * 50}%`,
                    left: v < 0 ? undefined : "50%",
                    right: v < 0 ? "50%" : undefined,
                    background: v < 0 ? "#B3261E" : color === "var(--paper)" ? "var(--accent)" : "var(--accent-deep)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[14px] bg-[var(--ink)] p-6 text-[var(--paper)]">
          <p className="text-sm text-[var(--paper)]/70">Résultat global de la banque</p>
          <p className="mono mt-1 text-3xl font-medium">{signed(net)}</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--paper)]/80">
            {couvert
              ? "Couverte, la banque a figé la valeur de son portefeuille : elle ne perd rien si le marché baisse, mais renonce au gain s’il monte."
              : "Sans couverture, la banque subit entièrement les variations du marché."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Opérations connexes ---------- */

const CONNEXES: Array<[string, string, string]> = [
  ["Loi", "n° 45-12", "n° 24-01"],
  [
    "Mécanisme",
    "Transfert temporaire de titres : le prêteur remet des titres, l’emprunteur s’engage à rendre des titres équivalents à l’échéance.",
    "Cession temporaire avec rétrocession : des titres sont cédés contre des espèces, avec l’engagement irrévocable de les reprendre à un prix et une date fixés.",
  ],
  ["Rémunération", "Le prêteur reçoit une rémunération.", "La différence entre prix de cession et prix de rétrocession."],
  [
    "À quoi ça sert",
    "Livrer des titres à temps et soutenir la liquidité du marché.",
    "Se financer à court terme en mobilisant ses titres.",
  ],
];

function Connexes() {
  return (
    <section id="connexes" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHead
        title="Les opérations connexes"
        intro="Autour du marché au comptant, deux opérations temporaires sur titres font circuler les titres et la trésorerie."
      />
      <div className="mt-12 overflow-hidden rounded-[18px] border border-[var(--line)]">
        <div className="hidden grid-cols-[180px_1fr_1fr] bg-[var(--ink)] text-[var(--paper)] md:grid">
          <span className="p-5" />
          <p className="p-5 text-lg font-semibold">Prêt de titres</p>
          <p className="p-5 text-lg font-semibold">Opérations de pension</p>
        </div>
        {CONNEXES.map(([label, a, b], i) => (
          <div
            key={label}
            className={`grid gap-3 border-t border-[var(--line)] p-5 md:grid-cols-[180px_1fr_1fr] md:gap-0 md:p-0 ${
              i % 2 === 1 ? "bg-[var(--paper-2)]" : "bg-[var(--paper)]"
            }`}
          >
            <p className="mono text-sm text-[var(--accent-deep)] md:p-5">{label}</p>
            <p className="leading-relaxed md:p-5">
              <span className="font-semibold md:hidden">Prêt de titres : </span>
              {a}
            </p>
            <p className="leading-relaxed md:border-l md:border-[var(--line)] md:p-5">
              <span className="font-semibold md:hidden">Pension : </span>
              {b}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- À retenir + quiz ---------- */

const RETENIR = [
  "Bourse : société gestionnaire concessionnaire ; monopole de négociation des sociétés de bourse ; CIF créés par la loi 19-14.",
  "Post-marché : dématérialisation et inscription en compte auprès du dépositaire central, Maroclear (loi 35-96).",
  "Marché à terme (loi 42-12) : chambre de compensation en contrepartie centrale, ICMAT, lancement le 6 avril 2026.",
  "Opérations connexes : prêt de titres (loi 45-12) et opérations de pension (loi 24-01).",
];

const QUIZ: Array<{ q: string; options: string[]; answer: number; why: string }> = [
  {
    q: "Qui détient le monopole de la négociation en Bourse ?",
    options: ["Les banques", "Les sociétés de bourse", "Maroclear", "L’AMMC"],
    answer: 1,
    why: "Les sociétés de bourse ont le monopole de la négociation (loi 19-14). Les banques collectent les ordres et les leur transmettent.",
  },
  {
    q: "Quel est le rôle de Maroclear ?",
    options: [
      "Fixer les cours des actions",
      "Conseiller les investisseurs",
      "Dépositaire central : conserver et faire circuler les titres inscrits en compte",
      "Organiser le marché à terme",
    ],
    answer: 2,
    why: "Maroclear est le dépositaire central prévu par la loi 35-96 : les titres dématérialisés y sont inscrits en compte.",
  },
  {
    q: "Que garantit le règlement-livraison ?",
    options: [
      "Les titres sont livrés, puis payés plus tard",
      "Le prix est payé avant toute livraison",
      "La livraison des titres et le paiement du prix ont lieu en même temps",
      "L’acheteur peut annuler pendant deux jours",
    ],
    answer: 2,
    why: "Livraison et paiement simultanés : aucune des deux parties ne s’exécute sans l’autre.",
  },
  {
    q: "Quelle loi encadre le marché à terme d’instruments financiers ?",
    options: ["Loi 19-14", "Loi 35-96", "Loi 42-12", "Loi 24-01"],
    answer: 2,
    why: "La loi 42-12 encadre le marché à terme ; il a été lancé le 6 avril 2026.",
  },
  {
    q: "Quel est le premier produit coté sur le marché à terme marocain ?",
    options: ["Une option sur une action", "Le Future MASI 20", "Un future sur le dirham", "Une obligation du Trésor"],
    answer: 1,
    why: "Le Future MASI 20, contrat à terme sur l’indice des 20 valeurs les plus liquides.",
  },
  {
    q: "Une opération de pension, c’est :",
    options: [
      "Un prêt de titres sans contrepartie",
      "Une cession temporaire avec rétrocession",
      "Un contrat à terme sur indice",
      "Une introduction en Bourse",
    ],
    answer: 1,
    why: "Loi 24-01 : des titres sont cédés contre des espèces et repris à un prix et une date fixés.",
  },
];

function Revision() {
  return (
    <section id="quiz" className="border-t border-[var(--line)] bg-[var(--paper-2)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-[1fr_1.15fr]">
        <div>
          <SectionHead title="À retenir" />
          <ul className="mt-8 space-y-5">
            {RETENIR.map((r) => (
              <li key={r} className="flex gap-3 leading-relaxed text-[var(--ink-2)]">
                <Check />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <Quiz />
      </div>
    </section>
  );
}

function Quiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= QUIZ.length;

  function choose(k: number) {
    if (picked !== null) return;
    setPicked(k);
    if (k === QUIZ[i].answer) setScore((s) => s + 1);
  }
  function next() {
    setPicked(null);
    setI((v) => v + 1);
  }
  function restart() {
    setI(0);
    setPicked(null);
    setScore(0);
  }

  if (done) {
    return (
      <div className="flex flex-col justify-center rounded-[18px] bg-[var(--paper)] p-8 md:p-10">
        <p className="text-sm text-[var(--muted)]">Résultat</p>
        <p className="mono mt-2 text-6xl font-medium text-[var(--accent)]">
          {score}/{QUIZ.length}
        </p>
        <p className="mt-3 text-lg leading-relaxed text-[var(--ink-2)]">
          {score === QUIZ.length
            ? "Sans faute. Tu maîtrises les infrastructures du marché."
            : score >= 4
              ? "Très bien. Relis les points manqués et c’est acquis."
              : "Reprends le parcours de l’ordre, puis retente ta chance."}
        </p>
        <button
          onClick={restart}
          className="mt-6 self-start font-medium text-[var(--accent-deep)] underline decoration-2 underline-offset-4"
        >
          Recommencer le quiz
        </button>
      </div>
    );
  }

  const item = QUIZ[i];
  return (
    <div className="rounded-[18px] bg-[var(--paper)] p-7 md:p-10">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Teste-toi</span>
        <span className="mono text-[var(--muted)]">
          {i + 1} / {QUIZ.length}
        </span>
      </div>
      <div className="mt-3 h-1 rounded-full bg-[var(--paper-2)]">
        <div className="bar h-1 rounded-full bg-[var(--accent)]" style={{ width: `${(i / QUIZ.length) * 100}%` }} />
      </div>
      <p className="mt-7 text-xl font-semibold leading-snug tracking-tight">{item.q}</p>
      <div className="mt-5 space-y-2.5">
        {item.options.map((o, k) => {
          const isAnswer = k === item.answer;
          const isPicked = k === picked;
          let cls = "border-[var(--line)] hover:border-[var(--ink)]";
          if (picked !== null) {
            if (isAnswer) cls = "border-[var(--accent)] bg-[var(--accent-soft)]";
            else if (isPicked) cls = "border-[#B3261E] bg-[#F8E3E1]";
            else cls = "border-[var(--line)] opacity-60";
          }
          return (
            <button
              key={o}
              onClick={() => choose(k)}
              disabled={picked !== null}
              className={`quiz-opt flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left ${cls}`}
            >
              <span className="mono mt-0.5 text-sm text-[var(--muted)]">{String.fromCharCode(65 + k)}</span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      {picked !== null ? (
        <div className="mt-6">
          <p className="leading-relaxed text-[var(--ink-2)]">
            <span className="font-semibold text-[var(--ink)]">{picked === item.answer ? "Bonne réponse. " : "Pas tout à fait. "}</span>
            {item.why}
          </p>
          <button
            onClick={next}
            className="mt-5 rounded-xl bg-[var(--accent)] px-5 py-3 font-medium text-white transition-colors hover:bg-[var(--accent-deep)] active:translate-y-[1px]"
          >
            {i === QUIZ.length - 1 ? "Voir mon score" : "Question suivante"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Sources ---------- */

const LOIS: Array<[string, string, string]> = [
  ["Loi n° 19-14", "Bourse des valeurs, sociétés de bourse et conseillers en investissement financier", "https://www.ammc.ma/sites/default/files/Loi%20n%C2%B0%2019-14.pdf"],
  ["Loi n° 35-96", "Dépositaire central et régime général de l’inscription en compte", "https://www.ammc.ma/sites/default/files/Loi%20n%C2%B0%2035-96.pdf"],
  ["Loi n° 42-12", "Marché à terme d’instruments financiers", "https://www.ammc.ma/sites/default/files/Loi%20n%C2%B0%2042-12%20relative%20au%20March%C3%A9%20%C3%A0%20terme%20d%E2%80%99instruments%20financiers.pdf"],
  ["Loi n° 45-12", "Prêt de titres (modifiée par la loi n° 83-20)", "https://www.ammc.ma/sites/default/files/Loi%20n%C2%B0%2045-12%20relative%20au%20Pr%C3%AAt%20de%20titres.pdf"],
  ["Loi n° 24-01", "Opérations de pension", "https://www.ammc.ma/sites/default/files/Loi%20n%C2%B0%2024-01.pdf"],
];

function Sources() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <SectionHead title="Sources juridiques" intro="Les cinq lois du cours. La bibliothèque complète (Constitution, traités, décrets, arrêtés, règlements, circulaires) est sur la page Sources." />
      <ul className="mt-10 grid gap-x-10 sm:grid-cols-2">
        {LOIS.map(([l, t, href]) => (
          <li key={l} className="border-t border-[var(--line)]">
            <a href={href} target="_blank" rel="noreferrer" className="group flex items-baseline gap-5 py-4">
              <span className="mono w-28 shrink-0 text-sm text-[var(--accent-deep)]">{l}</span>
              <span className="flex-1 leading-relaxed">{t}</span>
              <span className="mono text-xs text-[var(--muted)] transition-colors group-hover:text-[var(--accent)]">PDF ↗</span>
            </a>
          </li>
        ))}
      </ul>
      <a href="/sources" className="mt-8 inline-flex items-center gap-2 font-medium text-[var(--accent-deep)] underline decoration-2 underline-offset-4">
        Voir toute la bibliothèque juridique →
      </a>
    </section>
  );
}

function AssistantSection() {
  return (
    <section id="assistant" className="mx-auto max-w-6xl px-5 pt-24">
      <div className="zellige rounded-[18px] p-2">
        <div className="grid gap-8 rounded-[14px] bg-[var(--ink)] p-8 text-[var(--paper)] md:grid-cols-[1fr_1.1fr] md:p-12">
          <div>
            <h2 className="text-3xl font-semibold leading-[1.05] tracking-tighter md:text-4xl">Une question ? Demande à l’assistant IA</h2>
            <p className="mt-4 max-w-[46ch] leading-relaxed text-[var(--paper)]/80">
              Il lit les textes officiels (Constitution, lois, décrets, règlements généraux), t’explique simplement et cite les articles exacts.
            </p>
            <button
              onClick={() => openChat()}
              className="mt-7 rounded-full bg-[var(--paper)] px-6 py-3 font-medium text-[var(--ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Poser une question
            </button>
          </div>
          <ul className="space-y-2.5">
            {CHAT_SUGGESTIONS.slice(0, 4).map((s) => (
              <li key={s}>
                <button
                  onClick={() => openChat(s)}
                  className="flex w-full items-center justify-between gap-4 border-b border-white/15 py-3 text-left transition-colors hover:text-[#7FD3BC]"
                >
                  <span>{s}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
