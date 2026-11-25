import { openChat } from "../lib/chat-events";

type Item = {
  ref: string;
  title: string;
  desc: string;
  url?: string;
  ask?: string; // identifiant du texte dans la base de l'assistant
};
type Level = { id: string; name: string; who: string; intro: string; items: Item[] };

const AMMC_LOIS = "https://www.ammc.ma/fr/reglementations/dahirs-lois";
const AMMC_FILES = "https://www.ammc.ma/sites/default/files/";

const LEVELS: Level[] = [
  {
    id: "constitution",
    name: "Constitution",
    who: "Adoptée par référendum (2011)",
    intro: "Le sommet de la pyramide. Elle ne parle pas de la Bourse directement, mais elle pose les principes que toutes les règles du marché doivent respecter.",
    items: [
      {
        ref: "Préambule",
        title: "Primauté des conventions internationales ratifiées",
        desc: "Les conventions internationales dûment ratifiées et publiées priment sur le droit interne, qui doit être harmonisé avec elles.",
        ask: "constitution",
      },
      {
        ref: "Article 35",
        title: "Propriété, liberté d’entreprendre, libre concurrence",
        desc: "Garantit le droit de propriété (dont celle des titres) et la liberté d’entreprendre : la base d’un marché où l’on achète et vend librement des actions.",
        ask: "constitution",
      },
      {
        ref: "Article 36",
        title: "Délits d’initié et infractions financières",
        desc: "Les conflits d’intérêts, les délits d’initié et toutes les infractions d’ordre financier sont sanctionnés par la loi. Les lois 43-12 et 19-14 organisent ces sanctions.",
        ask: "constitution",
      },
      {
        ref: "Article 55",
        title: "Ratification des traités",
        desc: "Le Roi signe et ratifie les traités ; ceux qui engagent les finances de l’État ou exigent des mesures législatives doivent d’abord être approuvés par la loi.",
        ask: "constitution",
      },
      {
        ref: "Article 71",
        title: "Domaine de la loi",
        desc: "Liste les matières réservées au Parlement. C’est pourquoi l’organisation du marché des capitaux se fait par des lois votées, précisées ensuite par décrets et arrêtés.",
        ask: "constitution",
      },
    ],
  },
  {
    id: "traites",
    name: "Traités et accords internationaux",
    who: "Ratifiés par le Maroc ou signés par l’AMMC",
    intro: "Ils engagent le Maroc ou son régulateur vis-à-vis de l’étranger : coopération entre autorités de marché, échange d’informations, fiscalité des investisseurs étrangers.",
    items: [
      {
        ref: "OICV / IOSCO · 2007",
        title: "Accord multilatéral d’échange d’informations (MMoU)",
        desc: "L’AMMC est signataire depuis 2007 de l’accord multilatéral de l’Organisation internationale des commissions de valeurs : le Maroc a été le 44e signataire et le 3e pays africain. C’est un accord entre régulateurs, pas un traité ratifié.",
        url: "https://www.ammc.ma/fr/ammc/oicv",
      },
      {
        ref: "AMMC · AMF · 2024",
        title: "Accord de coopération avec l’autorité française (AMF)",
        desc: "Signé le 29 octobre 2024 : coopération et assistance mutuelle dans le domaine des marchés de capitaux.",
        url: "https://www.amf-france.org/fr/actualites-publications/communiques/communiques-de-lamf/lamf-et-lammc-renforcent-leur-cooperation",
      },
      {
        ref: "AMMC · CNMV",
        title: "Mémorandum avec le régulateur espagnol",
        desc: "Mémorandum de coopération et d’assistance mutuelle entre l’AMMC et la CNMV.",
        url: "https://www.ammc.ma/fr/node/43142",
      },
      {
        ref: "Conventions fiscales",
        title: "Conventions de non double imposition",
        desc: "Pour un investisseur non résident, la retenue sur les dividendes marocains peut s’imputer sur l’impôt de son pays grâce aux conventions fiscales bilatérales.",
      },
    ],
  },
  {
    id: "organiques",
    name: "Lois organiques",
    who: "Votées par le Parlement, contrôlées par la Cour constitutionnelle",
    intro: "Il n’existe pas de loi organique propre à la Bourse. Une loi organique joue toutefois un rôle indirect, par la fiscalité.",
    items: [
      {
        ref: "Loi organique n° 130-13",
        title: "Loi organique relative à la loi de finances",
        desc: "Encadre les lois de finances annuelles. C’est par elles que sont fixés les taux d’imposition des dividendes et des plus-values sur titres.",
      },
    ],
  },
  {
    id: "lois",
    name: "Lois ordinaires",
    who: "Votées par le Parlement, promulguées par dahir",
    intro: "Le cœur du droit boursier marocain. Les textes marqués « dans l’assistant » sont lus par le chatbot.",
    items: [
      { ref: "Loi n° 43-12", title: "Autorité marocaine du marché des capitaux (AMMC)", desc: "Crée l’AMMC (qui remplace le CDVM), fixe ses missions de protection de l’épargne, ses pouvoirs de contrôle et de sanction, et réprime le délit d’initié.", url: AMMC_LOIS, ask: "43-12" },
      { ref: "Loi n° 44-12", title: "Appel public à l’épargne", desc: "Règles de l’émission de titres auprès du public : document d’information (prospectus) visé par l’AMMC, information permanente des émetteurs.", url: AMMC_LOIS, ask: "44-12" },
      { ref: "Loi n° 19-14", title: "Bourse des valeurs, sociétés de bourse et CIF", desc: "Organisation de la Bourse de Casablanca, monopole de négociation des sociétés de bourse, statut des conseillers en investissement financier.", url: AMMC_FILES + "Loi%20n%C2%B0%2019-14.pdf", ask: "19-14" },
      { ref: "Loi n° 35-96", title: "Dépositaire central et inscription en compte", desc: "Crée Maroclear, dématérialise les titres et organise leur circulation de compte à compte.", url: AMMC_FILES + "Loi%20n%C2%B0%2035-96.pdf", ask: "35-96" },
      { ref: "Loi n° 42-12", title: "Marché à terme d’instruments financiers", desc: "Société gestionnaire, chambre de compensation, membres, ICMAT : le cadre du marché lancé le 6 avril 2026.", url: AMMC_FILES + "Loi%20n%C2%B0%2042-12%20relative%20au%20March%C3%A9%20%C3%A0%20terme%20d%E2%80%99instruments%20financiers.pdf", ask: "42-12" },
      { ref: "Loi n° 45-12 (+ loi 83-20)", title: "Prêt de titres", desc: "Transfert temporaire de titres contre rémunération. Modifiée en 2021 par la loi 83-20.", url: AMMC_FILES + "Loi%20n%C2%B0%2045-12%20relative%20au%20Pr%C3%AAt%20de%20titres.pdf", ask: "45-12" },
      { ref: "Loi n° 24-01", title: "Opérations de pension", desc: "Cession temporaire de titres contre espèces avec engagement de rétrocession.", url: AMMC_FILES + "Loi%20n%C2%B0%2024-01.pdf", ask: "24-01" },
      { ref: "Loi n° 26-03", title: "Offres publiques sur le marché boursier", desc: "OPA, OPE, offres de retrait : procédures et protection des actionnaires minoritaires.", url: AMMC_FILES + "Loi%20n%C2%B0%2026-03.pdf", ask: "26-03" },
      { ref: "Loi n° 17-95", title: "Sociétés anonymes", desc: "Droit des sociétés anonymes, y compris les règles propres aux sociétés faisant appel public à l’épargne.", url: AMMC_LOIS },
      { ref: "Loi n° 03-25", title: "Organismes de placement collectif en valeurs mobilières (OPCVM)", desc: "Cadre des fonds d’investissement (SICAV, FCP) par lesquels beaucoup d’épargnants accèdent à la Bourse.", url: AMMC_LOIS },
      { ref: "Lois n° 33-06, 70-14, 41-05, 15-18", title: "Titrisation, OPCI, OPCC, financement collaboratif", desc: "Autres véhicules et marchés placés sous le contrôle de l’AMMC.", url: AMMC_LOIS },
    ],
  },
  {
    id: "decrets",
    name: "Dahirs, décrets-lois et décrets",
    who: "Pris par le Roi ou le Chef du gouvernement",
    intro: "Le dahir promulgue chaque loi. Les décrets précisent ensuite les lois. Il n’existe pas aujourd’hui de décret-loi (l’équivalent marocain de l’ordonnance) propre à la Bourse ; des « dahirs portant loi » ont existé avant la réforme.",
    items: [
      { ref: "Décret n° 2-18-827 (2019)", title: "Composition et fonctionnement de l’ICMAT", desc: "Organise l’instance de coordination du marché à terme prévue par l’article 7 de la loi 42-12.", ask: "decret-icmat" },
      { ref: "Décret n° 2-13-274 (2013)", title: "Application de la loi 45-12 sur le prêt de titres", desc: "Habilitation des intermédiaires et modèles de convention et de notification.", url: "https://www.ammc.ma/fr/reglementations/decrets?page=1" },
      { ref: "Décret n° 2-04-547 (2004)", title: "Application de la loi 24-01 sur les pensions", desc: "Habilitation des organismes autres que les banques et modèle de convention-cadre.", url: "https://www.bkam.ma/fr/Trouvez-l-information-concernant/Reglementation/Marche-monetaire/Operations-de-pension/Operations-de-pension/Decret-n-2-04-547-du-16-kaada-1425-29-decembre-2004-pris-pour-l-application-de-la-loi-n-24-01-relative-aux-operations-de-pension" },
      { ref: "Décrets n° 2-17-227 et 2-17-216 (2017)", title: "Application des lois 44-12 et 43-12", desc: "Précisent l’appel public à l’épargne et certaines dispositions sur l’AMMC.", url: "https://www.ammc.ma/fr/reglementations/decrets" },
    ],
  },
  {
    id: "arretes",
    name: "Arrêtés",
    who: "Pris par le ministre de l’Économie et des Finances",
    intro: "Ils rendent obligatoires les règlements généraux et fixent des détails techniques.",
    items: [
      { ref: "Arrêté n° 2208-19 (3 juillet 2019)", title: "Approuve le règlement général de la Bourse des valeurs", desc: "Rend applicable le règlement général de la Bourse de Casablanca.", url: "https://www.ammc.ma/fr/reglementations/reglement-general-de-la-bourse-des-valeurs", ask: "rg-bourse" },
      { ref: "Arrêté n° 2582-22 (27 septembre 2022)", title: "Approuve le règlement général du marché à terme", desc: "Rend applicable le règlement de la société gestionnaire du marché à terme.", ask: "rg-sgmat" },
      { ref: "Arrêté n° 2169-16", title: "Approuve le règlement général de l’AMMC", desc: "Règles d’organisation et de contrôle de l’AMMC, amendées depuis.", url: "https://www.ammc.ma/fr/reglementations/reglements-generaux" },
      { ref: "Arrêté n° 3109-21 (2021)", title: "Journaux d’annonces légales", desc: "Liste des journaux prévue par l’article 30 de la loi 44-12 pour les publications des émetteurs.", url: "https://www.ammc.ma/fr/reglementations/par-theme?page=5" },
    ],
  },
  {
    id: "reglements",
    name: "Règlements généraux",
    who: "Établis par les institutions du marché, approuvés par arrêté",
    intro: "Les règles de fonctionnement au quotidien : admission à la cote, compartiments, séances, seuils de cours, membres.",
    items: [
      { ref: "Règlement général de la Bourse des valeurs", title: "Règlement de la Bourse de Casablanca", desc: "Marché principal et marché alternatif, conditions d’admission, introduction en bourse, négociation, seuils de variation, radiation, sociétés de bourse et CIF.", url: "https://www.ammc.ma/fr/reglementations/reglement-general-de-la-bourse-des-valeurs", ask: "rg-bourse" },
      { ref: "Règlement général de la SGMAT", title: "Règlement du marché à terme", desc: "Caractéristiques des contrats à terme, membres, cotation, cours de référence, suspension.", ask: "rg-sgmat" },
      { ref: "Règlements de l’AMMC, de Maroclear et de la chambre de compensation", title: "Autres règlements généraux", desc: "Fonctionnement du régulateur, du dépositaire central et de la contrepartie centrale.", url: "https://www.ammc.ma/fr/reglementations/reglements-generaux" },
    ],
  },
  {
    id: "circulaires",
    name: "Circulaires et instructions",
    who: "Publiées par l’AMMC, la Bourse, la SGMAT et la CCP",
    intro: "Le niveau le plus opérationnel : modalités pratiques, formulaires, horaires, paramètres de marché.",
    items: [
      { ref: "Circulaire de l’AMMC", title: "Circulaire générale de l’AMMC", desc: "Règles détaillées pour les émetteurs, les intermédiaires et les OPCVM.", url: "https://www.ammc.ma/fr/reglementations/par-theme?page=5" },
      { ref: "Instructions de la Bourse de Casablanca", title: "Horaires, groupes et modes de cotation", desc: "Fixent notamment les horaires de séance et les groupes de cotation, révisés selon la liquidité des valeurs.", url: "https://www.casablanca-bourse.com/fr/les-horaires-de-cotation" },
      { ref: "Instructions SGMAT et CCP (2026)", title: "Marché à terme et compensation", desc: "Publiées début avril 2026 : calendrier de marché, admission des contrats sur le MASI 20, classification des instruments à terme.", url: "https://medias24.com/2026/04/01/marche-a-terme-la-bourse-de-casablanca-met-en-ligne-sa-plateforme-dediee-et-publie-les-premieres-instructions-sgmat-et-ccp-1652085/" },
    ],
  },
];

function Pyramid() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-1.5" aria-hidden="true">
      {LEVELS.map((l, i) => (
        <a
          key={l.id}
          href={`#${l.id}`}
          className={`block whitespace-nowrap rounded-md px-2 py-2 text-center text-[11px] font-medium transition-transform hover:scale-[1.02] md:text-sm ${
            i === 0 ? "bg-[var(--ink)] text-[var(--paper)]" : i < 3 ? "bg-[var(--accent)] text-white" : i < 5 ? "bg-[var(--accent-soft)] text-[var(--accent-deep)]" : "bg-[var(--paper-2)] text-[var(--ink-2)]"
          }`}
          style={{ width: `${40 + i * 8.5}%` }}
        >
          {l.name}
        </a>
      ))}
    </div>
  );
}

export function Sources() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <p className="mono text-sm text-[var(--accent-deep)]">Hiérarchie des normes</p>
            <h1 className="mt-4 text-[2.4rem] font-semibold leading-[1.03] tracking-tighter md:text-[3.4rem]">Toutes les règles de la Bourse marocaine</h1>
            <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-[var(--ink-2)]">
              De la Constitution aux circulaires : chaque texte doit respecter celui du dessus. Clique sur un niveau, ou demande à l’assistant d’expliquer un texte.
            </p>
          </div>
          <Pyramid />
        </div>
      </section>

      {LEVELS.map((l, i) => (
        <section key={l.id} id={l.id} className={`border-t border-[var(--line)] ${i % 2 ? "bg-[var(--paper-2)]" : ""}`}>
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-[300px_1fr]">
            <div>
              <span className="mono text-sm text-[var(--accent-deep)]">Niveau {i + 1}</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{l.name}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{l.who}</p>
              <p className="mt-4 leading-relaxed text-[var(--ink-2)]">{l.intro}</p>
            </div>
            <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {l.items.map((it) => (
                <li key={it.ref + it.title} className="py-5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="mono text-sm text-[var(--accent-deep)]">{it.ref}</span>
                    {it.ask ? <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent-deep)]">dans l’assistant</span> : null}
                  </div>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">{it.title}</h3>
                  <p className="mt-1 max-w-[62ch] leading-relaxed text-[var(--ink-2)]">{it.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    {it.ask ? (
                      <button
                        onClick={() => openChat(`Explique-moi simplement : ${it.ref}, ${it.title}. Quels sont les articles clés ?`, it.ask)}
                        className="font-medium text-[var(--accent-deep)] underline decoration-2 underline-offset-4"
                      >
                        Demander à l’assistant
                      </button>
                    ) : null}
                    {it.url ? (
                      <a href={it.url} target="_blank" rel="noreferrer" className="text-[var(--muted)] hover:text-[var(--accent)]">
                        Source officielle ↗
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </main>
  );
}
