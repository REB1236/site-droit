import { search } from "../api/_lib/search.js";
const qs = process.argv.slice(2).length ? process.argv.slice(2) : [
  "Qui a le monopole de la négociation en bourse ?",
  "Quel est le rôle du dépositaire central ?",
  "Qu'est-ce qu'un contrat à terme ?",
  "rôle de la chambre de compensation",
  "Qui peut emprunter des titres ?",
  "définition de la pension",
  "Que dit la Constitution sur les délits d'initié ?",
  "Quels sont les pouvoirs de l'AMMC ?",
  "Qu'est-ce qu'une offre publique d'achat ?",
  "conditions d'admission au marché principal",
  "seuils de variation des cours",
  "article 2.1.3 du règlement général",
  "composition de l'ICMAT",
  "qu'est-ce qu'un prospectus ?",
];
for (const q of qs) {
  const r = search(q, { limit: 4 });
  console.log("\nQ:", q);
  r.forEach((h) => console.log("  ", h.score, "|", h.label, "|", h.text.slice(0, 110).replace(/\n/g, " ")));
}
