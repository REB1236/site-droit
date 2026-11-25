// Recherche plein texte (BM25) dans le corpus juridique : data/corpus.json
import fs from "node:fs";
import path from "node:path";

const STOP = new Set(
  "a au aux avec ce ces cet cette c d de des du elle en et est etre il ils je j l la le les leur leurs lui ma mais me meme mes moi mon ne nos notre nous on ou par pas pour qu que qui sa se ses son sur ta te tes toi ton tu un une vos votre vous y quoi quel quelle quels quelles comment pourquoi combien est-ce estce dans peut peuvent doit doivent fait faire sont ete selon entre lors tout tous toute toutes autre autres ainsi donc alors cela ca si sous apres avant plus moins tres bien aussi ont avoir sera seront etait dont lequel laquelle lesquels lesquelles quand loi lois article articles present presente dit dite explique expliquer explique-moi definition definir veut dire role sert servir chose stp svp merci bonjour moi texte textes"
    .split(" "),
);

const SYN = {
  sdb: ["societe", "bourse"],
  cif: ["conseiller", "investissement", "financier"],
  maroclear: ["depositaire", "central"],
  ammc: ["autorite", "marocaine", "marche", "capitaux"],
  future: ["contrat", "terme"],
  futures: ["contrat", "terme"],
  repo: ["pension"],
  monopole: ["seule", "habilite", "negociation"],
  prison: ["emprisonnement"],
  sanction: ["amende", "emprisonnement", "sanction"],
  sanctions: ["amende", "emprisonnement", "sanction"],
  ccp: ["chambre", "compensation"],
  icmat: ["instance", "coordination", "marche", "terme"],
  derive: ["instrument", "financier", "terme"],
  derives: ["instrument", "financier", "terme"],
  dematerialisation: ["inscription", "compte"],
  casablanca: ["societe", "gestionnaire"],
  ipo: ["introduction", "bourse", "admission"],
  introduction: ["introduction", "admission"],
  opa: ["offre", "publique", "achat"],
  ope: ["offre", "publique", "echange"],
  initie: ["initie", "information", "privilegiee"],
  initie_: ["initie"],
  prospectus: ["document", "information"],
  constitution: ["constitution"],
  emprunter: ["emprunteur", "emprunter"],
  preter: ["preteur", "preter"],
};

const HINTS = [
  [/\bconstitution|constitutionnel|parlement|domaine de la loi|droit de propriete|liberte d entreprendre/, ["constitution"]],
  [/\b43[- .]?12\b|autorite marocaine|ammc|regulateur|college des sanctions/, ["43-12"]],
  [/\b44[- .]?12\b|appel public|prospectus|document d information|investisseur qualifie|emetteur/, ["44-12"]],
  [/\b26[- .]?03\b|offre publique|opa|ope|retrait obligatoire|franchissement de seuil/, ["26-03"]],
  [/\b19[- .]?14\b|societe de bourse|sdb|cif|conseiller en investissement|bourse des valeurs/, ["19-14", "rg-bourse"]],
  [/reglement general|cotation|carnet d ordres|seuil|fixing|continu|marche principal|marche alternatif|introduction en bourse|radiation|admission/, ["rg-bourse"]],
  [/\b35[- .]?96\b|depositaire|maroclear|inscription en compte|teneur|dematerialis/, ["35-96"]],
  [/\b42[- .]?12\b|marche a terme|future|compensation|instrument financier a terme|icmat|derive|marge|depot de garantie|sgmat/, ["42-12", "rg-sgmat", "decret-icmat"]],
  [/\b45[- .]?12\b|\b83[- .]?20\b|pret de titres|emprunt de titres|preteur|emprunteur/, ["45-12", "83-20"]],
  [/\b24[- .]?01\b|pension|retrocession|repo\b/, ["24-01"]],
];

export function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'`«»"]/g, " ")
    .replace(/[^a-z0-9.-]+/g, " ")
    .replace(/(^|\s)[.-]+|[.-]+(\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function stem(t) {
  let w = t;
  if (w.length > 7 && w.endsWith("ements")) w = w.slice(0, -6);
  else if (w.length > 6 && w.endsWith("ement")) w = w.slice(0, -5);
  if (w.length > 5 && (w.endsWith("tions") || w.endsWith("aires"))) w = w.slice(0, -1);
  if (w.length > 3 && (w.endsWith("s") || w.endsWith("x"))) w = w.slice(0, -1);
  if (w.length > 5 && w.endsWith("e")) w = w.slice(0, -1);
  return w;
}

function tokens(s) {
  return normalize(s)
    .split(" ")
    .filter((t) => t && !STOP.has(t) && (t.length > 1 || /\d/.test(t)))
    .map(stem);
}

let STATE = null;

function load() {
  if (STATE) return STATE;
  const file = path.join(process.cwd(), "data", "corpus.json");
  const docs = JSON.parse(fs.readFileSync(file, "utf8"));
  const chunks = [];
  for (const d of docs) {
    for (const a of d.articles) {
      // découpe les articles très longs en morceaux d'environ 380 mots
      const parts = [];
      let cur = [];
      let n = 0;
      for (const p of a.text) {
        const w = p.split(/\s+/).length;
        if (n + w > 380 && cur.length) {
          parts.push(cur);
          cur = [];
          n = 0;
        }
        cur.push(p);
        n += w;
      }
      if (cur.length) parts.push(cur);
      parts.forEach((paras, i) => chunks.push({ doc: d, art: a, paras, part: parts.length > 1 ? i + 1 : 0 }));
    }
  }
  const df = new Map();
  let total = 0;
  for (const c of chunks) {
    const body = c.paras.join(" ");
    const head = tokens(body.slice(0, 260));
    const toks = [...tokens(body + " " + c.art.ctx + " " + c.doc.title), ...head, ...head];
    const tf = new Map();
    toks.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
    const bigrams = new Set();
    for (let i = 0; i < toks.length - 1; i++) bigrams.add(toks[i] + " " + toks[i + 1]);
    tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1));
    c.tf = tf;
    c.len = toks.length;
    c.bigrams = bigrams;
    c.head = normalize(body.slice(0, 400));
    total += toks.length;
  }
  STATE = { docs, chunks, df, avg: total / chunks.length };
  return STATE;
}

export function docsMeta() {
  return load().docs.map((d) => ({ id: d.id, short: d.short, title: d.title, level: d.level, url: d.url, count: d.articles.length }));
}

export function artLabel(doc, num) {
  if (doc.id === "constitution") return num === "1" ? "Constitution, article premier" : `Constitution, art. ${num}`;
  const base = doc.short.replace(/\s*\(.*\)$/, "");
  return `${base}, ${num === "1" ? "art. 1er" : "art. " + num}`;
}

export function search(question, { scope = "all", limit = 8 } = {}) {
  const st = load();
  const nq = normalize(question);

  // Accès direct : "article 22 loi 19-14", "article 2.1.3 du règlement général"
  const artM = nq.match(/\bart(?:icle)?\.?\s*(premier|\d{1,3}(?:\.\d{1,3}){0,3})\b/);
  let direct = [];
  if (artM) {
    const num = artM[1] === "premier" ? "1" : artM[1];
    const lawM = nq.match(/\b(19|35|42|45|24|83|43|44|26)[- ](14|96|12|01|20|03)\b/);
    let docId = lawM ? `${lawM[1]}-${lawM[2]}` : null;
    if (!docId && /constitution/.test(nq)) docId = "constitution";
    if (!docId && /reglement general/.test(nq)) docId = /terme|sgmat/.test(nq) ? "rg-sgmat" : "rg-bourse";
    if (!docId && scope !== "all") docId = scope;
    if (docId) {
      direct = st.chunks.filter((c) => c.doc.id === docId && c.art.num === num);
    }
  }

  const raw = tokens(question);
  const expanded = [];
  nq.split(" ").forEach((w) => (SYN[w] || []).forEach((s) => expanded.push(stem(s))));
  const qterms = Array.from(new Set([...raw, ...expanded]));
  const qbigrams = [];
  for (let i = 0; i < raw.length - 1; i++) qbigrams.push(raw[i] + " " + raw[i + 1]);
  const hinted = new Set();
  HINTS.forEach(([re, ids]) => re.test(nq) && ids.forEach((id) => hinted.add(id)));
  const isDefinition = /\b(qu est ce|c est quoi|definition|definir|signifie|veut dire|entend par)\b/.test(nq);
  const isRole = /\b(role|mission|missions|sert|charge|fonction|attributions)\b/.test(nq);

  const N = st.chunks.length;
  const k1 = 1.2;
  const b = 0.75;
  const scored = [];
  if (qterms.length) {
    for (const c of st.chunks) {
      const key = c.doc.id === "83-20" ? "45-12" : c.doc.id;
      if (scope !== "all" && key !== scope && c.doc.id !== scope) continue;
      let s = 0;
      let matched = 0;
      for (const t of qterms) {
        const f = c.tf.get(t);
        if (!f) continue;
        matched++;
        const n = st.df.get(t) || 1;
        const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
        s += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * c.len) / st.avg)));
      }
      if (!s) continue;
      s *= 0.6 + 0.4 * (matched / qterms.length);
      qbigrams.forEach((bg) => c.bigrams.has(bg) && (s += 1.5));
      if (hinted.size && hinted.has(c.doc.id)) s *= 1.35;
      if (isDefinition && /entend par|est l operation par laquelle|est un contrat par lequel|est une operation/.test(c.head)) s *= 2;
      if (isRole && /(est|sera) creee?|(est|sont) chargee?s? (de|d)\b|a pour mission|missions suivantes|seule competente|a pour objet/.test(c.head)) s *= 2.2;
      scored.push({ c, s });
    }
  }
  scored.sort((x, y) => y.s - x.s);
  const out = [...direct.map((c) => ({ c, s: 999 }))];
  for (const x of scored) {
    if (out.length >= limit) break;
    if (out.some((o) => o.c === x.c)) continue;
    if (out.length && x.s < (scored[0]?.s || 0) * 0.3) break;
    out.push(x);
  }
  return out.map(({ c, s }) => ({
    docId: c.doc.id,
    docShort: c.doc.short,
    docTitle: c.doc.title,
    level: c.doc.level,
    url: c.doc.url,
    num: c.art.num,
    part: c.part,
    ctx: c.art.ctx,
    label: artLabel(c.doc, c.art.num) + (c.part ? ` (partie ${c.part})` : ""),
    text: c.paras.join("\n"),
    score: Math.round(s * 10) / 10,
  }));
}
