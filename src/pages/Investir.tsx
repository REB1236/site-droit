import { openChat } from "../lib/chat-events";

type Step = { title: string; body: string[]; source?: [string, string]; ask?: string };

const STEPS: Step[] = [
  {
    title: "Définis ton projet avant d’acheter",
    body: [
      "Horizon (combien de temps tu peux laisser l’argent), objectif et tolérance au risque : une action peut baisser fortement. N’investis que de l’argent dont tu n’as pas besoin à court terme.",
      "Si tu n’as pas le temps de suivre le marché, l’AMMC recommande plutôt la gestion sous mandat ou les OPCVM (fonds) que l’achat d’actions en direct.",
    ],
    source: ["AMMC · Les questions clés avant d’investir", "https://www.ammc.ma/fr/espace-epargnants/avant-dinvestir-0"],
  },
  {
    title: "Choisis un intermédiaire agréé",
    body: [
      "Deux portes d’entrée : ta banque (qui tient ton compte-titres et collecte tes ordres) ou directement une société de bourse.",
      "Dans tous les cas, l’ordre est exécuté par une société de bourse : elles seules peuvent négocier les titres cotés (loi 19-14, art. 38). Vérifie que l’intermédiaire figure sur les listes de l’AMMC et compare ses frais.",
    ],
    source: ["AMMC · FAQ", "https://www.ammc.ma/fr/faq"],
    ask: "Qui peut exécuter un ordre de bourse au Maroc et pourquoi ?",
  },
  {
    title: "Ouvre un compte-titres",
    body: [
      "Le compte-titres enregistre tes actions ; il est adossé à un compte espèces qui sert à payer les achats et à recevoir ventes et dividendes.",
      "Prévois ta pièce d’identité et les justificatifs demandés ; l’intermédiaire évalue aussi ton profil d’investisseur. Les titres sont dématérialisés : tu ne recevras aucun certificat papier, seulement une inscription en compte (loi 35-96).",
    ],
    source: ["AMMC · Ouverture d’un compte titre", "https://www.ammc.ma/fr/espace-epargnants/investissement/comment-acquerir-les-produits"],
  },
  {
    title: "Passe ton ordre correctement",
    body: [
      "Un ordre doit préciser : le sens (achat ou vente), la valeur, la quantité, le prix et la validité. Sans précision, il est valable 30 jours calendaires. Ne signe jamais un ordre à blanc et garde une copie.",
      "Les principaux types : « à cours limité » (tu fixes un prix maximum à l’achat ou minimum à la vente), « au marché » (exécuté aux prix disponibles, prioritaire), « au marché limité », et les ordres « à déclenchement » (stop). L’expression « au mieux » n’existe pas dans les textes.",
    ],
    source: ["AMMC · Comment passer un ordre de bourse", "https://www.ammc.ma/espace-epargnants/comment-passer-un-ordre-de-bourse"],
  },
  {
    title: "Comprends la séance de bourse",
    body: [
      "Selon leur liquidité, les valeurs sont cotées en continu (exécution dès qu’un acheteur et un vendeur sont d’accord) ou au fixing (confrontation de tous les ordres à un moment donné).",
      "Les horaires et les groupes de cotation sont fixés par la Bourse de Casablanca et peuvent changer (par exemple pendant le Ramadan) : consulte la page officielle des horaires. Des seuils limitent aussi la variation des cours pendant une séance.",
    ],
    source: ["Bourse de Casablanca · Horaires de cotation", "https://www.casablanca-bourse.com/fr/les-horaires-de-cotation"],
    ask: "Comment sont fixés les seuils de variation des cours à la Bourse de Casablanca ?",
  },
  {
    title: "Après l’exécution : règlement-livraison",
    body: [
      "Une fois l’ordre exécuté, Maroclear dénoue l’opération : les titres arrivent sur ton compte pendant que le prix est payé, en même temps. Tu reçois un avis d’opéré de ton intermédiaire : vérifie-le.",
      "Ensuite, suis ton portefeuille : relevés périodiques, assemblées générales, dividendes versés sur ton compte espèces.",
    ],
    ask: "Explique-moi le règlement-livraison et le rôle de Maroclear",
  },
  {
    title: "Anticipe les frais et la fiscalité",
    body: [
      "Chaque ordre supporte des commissions (intermédiaire, Bourse, dépositaire) et le compte peut avoir des droits de garde : demande la grille tarifaire avant d’ouvrir le compte, car les petits montants sont proportionnellement plus taxés.",
      "Pour un particulier résident, la loi de finances 2026 prévoit une retenue à la source de 11,25 % sur les dividendes d’actions cotées en 2026, puis 10 % à partir de 2027 ; les plus-values sur actions cotées sont imposées à 15 %. Ces taux changent avec les lois de finances : vérifie auprès de la DGI ou de ton intermédiaire.",
    ],
    source: ["Upsilon Consulting · Fiscalité 2026 de l’actionnaire", "https://upsilon-consulting.com/introduction-en-bourse-maroc-avantages-fiscaux/"],
  },
  {
    title: "Le marché à terme : pour plus tard",
    body: [
      "Le Future MASI 20 se négocie depuis le 6 avril 2026 via des membres agréés du marché à terme. Avec l’effet de levier, on peut perdre plus vite qu’avec des actions : c’est un outil de couverture et de professionnels avant tout.",
    ],
    ask: "Qui peut intervenir sur le marché à terme marocain et quelles garanties sont exigées ?",
  },
  {
    title: "Protège-toi",
    body: [
      "Méfie-toi des promesses de gains garantis et des « conseillers » non enregistrés. Utiliser une information privilégiée pour acheter ou vendre (délit d’initié) est interdit et sanctionné (Constitution, art. 36 ; loi 43-12).",
      "En cas de litige avec ton intermédiaire, tu peux saisir l’AMMC.",
    ],
    source: ["AMMC · Espace épargnants", "https://www.ammc.ma/fr/espace-epargnants/investissement"],
    ask: "Qu'est-ce qu'un délit d'initié et quelles sont les sanctions ?",
  },
];

export function Investir() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-14 md:pt-20">
        <p className="mono text-sm text-[var(--accent-deep)]">Guide pratique</p>
        <h1 className="mt-4 max-w-3xl text-[2.4rem] font-semibold leading-[1.03] tracking-tighter md:text-[3.4rem]">Investir à la Bourse de Casablanca, étape par étape</h1>
        <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-[var(--ink-2)]">
          Ce que les textes et l’AMMC prévoient pour un particulier : du choix de l’intermédiaire à la fiscalité. Informations générales, pas un conseil en investissement.
        </p>
      </section>

      <section className="border-t border-[var(--line)]">
        <ol className="mx-auto max-w-6xl px-5 py-10">
          {STEPS.map((s, i) => (
            <li key={s.title} className="grid gap-4 border-b border-[var(--line)] py-10 md:grid-cols-[120px_1fr] last:border-b-0">
              <span className="mono text-4xl font-medium text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{s.title}</h2>
                <div className="mt-3 space-y-3">
                  {s.body.map((p) => (
                    <p key={p.slice(0, 30)} className="max-w-[66ch] leading-relaxed text-[var(--ink-2)]">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {s.ask ? (
                    <button onClick={() => openChat(s.ask)} className="font-medium text-[var(--accent-deep)] underline decoration-2 underline-offset-4">
                      Demander à l’assistant
                    </button>
                  ) : null}
                  {s.source ? (
                    <a href={s.source[1]} target="_blank" rel="noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)]">
                      Source : {s.source[0]} ↗
                    </a>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
