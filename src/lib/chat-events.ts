export const CHAT_SUGGESTIONS = [
  "Explique-moi simplement le rôle de Maroclear",
  "Pourquoi les sociétés de bourse ont-elles le monopole de la négociation ?",
  "Comment fonctionne le Future MASI 20 et à quoi sert la chambre de compensation ?",
  "Quelle différence entre prêt de titres et pension ?",
  "Que dit la Constitution sur les délits d'initié ?",
  "Quels sont les compartiments du marché principal ?",
];

export function openChat(question?: string, scope?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("open-chat", { detail: { question: question ?? null, scope: scope ?? null } }));
}
