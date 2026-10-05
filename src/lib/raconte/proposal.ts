// Propositions « On l'ajoute ? » : un geste repéré, l'option comparée (table du code), la
// quantité à demander si elle manque. Rien n'est écrit dans le carnet sans validation : seule
// `proposalEntry`, appelée au clic de la personne, produit une entrée.
import {
  compatibleGestures,
  duelEntry,
  isValidQuantity,
  objectEntry,
  type ObjectOption,
} from "@/lib/compare";
import { getGesture } from "@/lib/data";
import type { NewEntry } from "@/lib/journal/entry";
import { alternativeFor } from "./alternatives";
import type { Certainty, Detection } from "./detections";

export type Proposal = {
  /** Clé stable dans la liste (ordre d'arrivée). */
  key: string;
  gestureId: string;
  excerpt: string;
  certainty: Certainty;
  /** Gestes de même unité : option comparée ; null pour un objet. */
  alternativeId: string | null;
  /** Distance (trajets) ; null tant qu'elle n'est pas connue. Toujours 1 pour les autres. */
  quantity: number | null;
  /** Objets : option retenue (null tant qu'elle n'est pas connue) et colis. */
  objectOption: ObjectOption | null;
  delivered: boolean;
};

export function toProposal(detection: Detection, index: number): Proposal {
  const gesture = getGesture(detection.gestureId);
  const isObject = gesture?.unit === "objet";
  return {
    key: `${index}-${detection.gestureId}`,
    gestureId: detection.gestureId,
    excerpt: detection.excerpt,
    certainty: detection.certainty,
    alternativeId: alternativeFor(detection.gestureId),
    quantity: gesture?.unit === "km" ? detection.quantity : 1,
    objectOption: isObject ? detection.mode : null,
    // Comme au duel objet : « Livré en colis » activé par défaut.
    delivered: true,
  };
}

/** Options que la personne peut choisir à la place de celle de la table. */
export function alternativeChoices(proposal: Proposal): string[] {
  return compatibleGestures(proposal.gestureId).map((gesture) => gesture.id);
}

/** Ce qui manque avant de pouvoir ajouter la proposition (null : prête). */
export function missingFor(
  proposal: Proposal,
): "quantity" | "object-option" | "alternative" | null {
  const gesture = getGesture(proposal.gestureId);
  if (!gesture) return "alternative";
  if (gesture.unit === "objet")
    return proposal.objectOption ? null : "object-option";
  if (!proposal.alternativeId) return "alternative";
  if (
    proposal.quantity === null ||
    !isValidQuantity(gesture.unit, proposal.quantity)
  )
    return "quantity";
  return null;
}

/**
 * Entrée de carnet d'une proposition validée : la personne a fait le geste repéré, comparé à
 * l'autre option. L'écart est calculé ensuite par createEntry (src/lib/calc), jamais par l'IA.
 */
export function proposalEntry(proposal: Proposal): NewEntry | null {
  if (missingFor(proposal)) return null;
  const gesture = getGesture(proposal.gestureId);
  if (!gesture) return null;
  if (gesture.unit === "objet")
    return objectEntry(
      gesture.id,
      proposal.objectOption as ObjectOption,
      proposal.delivered,
    );
  return duelEntry(
    gesture.id,
    proposal.alternativeId as string,
    proposal.quantity as number,
    "a",
  );
}
