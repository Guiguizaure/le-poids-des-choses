// Textes de l'écran « Raconte ta journée » (maquette 08) : lignes des gestes repérés, ce qui
// manque avant l'ajout, messages doux quand l'analyse n'aboutit pas.
import { objectNoun, possessive, type ObjectOption } from "@/lib/compare";
import { getGesture } from "@/lib/data";
import { plural } from "@/lib/garden/text";
import { CATEGORY_LABELS } from "@/lib/journal/display";
import type { RaconteError } from "./api";
import { missingFor, type Proposal } from "./proposal";

/** Mention demandée sous le champ. */
export const PRIVACY_NOTICE =
  "Ton texte est envoyé à Claude (Anthropic) pour repérer les gestes, puis oublié. N’écris pas d’informations personnelles.";

export function objectOptionLabel(
  gestureId: string,
  option: ObjectOption,
): string {
  if (option === "neuf") return "Neuf";
  if (option === "occasion") return "D’occasion";
  return `Je garde ${possessive(objectNoun(gestureId), "moi")}`;
}

/** Quantité ou option, telle qu'elle sera notée (« 65 km », « 1 repas », « à préciser »). */
function detailFor(proposal: Proposal): string {
  const gesture = getGesture(proposal.gestureId);
  if (!gesture) return "";
  switch (gesture.unit) {
    case "km":
      return proposal.quantity === null
        ? "distance à préciser"
        : `${proposal.quantity} km`;
    case "repas":
      return "1 repas";
    case "litre":
      return "1 litre";
    case "achat":
      return gesture.detail ?? "1 achat";
    case "objet":
      if (!proposal.objectOption) return "option à préciser";
      return proposal.objectOption === "occasion" && proposal.delivered
        ? "d’occasion, livré en colis"
        : objectOptionLabel(gesture.id, proposal.objectOption).toLowerCase();
  }
}

/** Ligne sous le nom du geste : « Manger · 1 repas · d’après « burger » ». */
export function proposalSubtitle(proposal: Proposal): string {
  const gesture = getGesture(proposal.gestureId);
  if (!gesture) return "";
  const parts = [CATEGORY_LABELS[gesture.category], detailFor(proposal)];
  if (proposal.certainty === "inferred")
    parts.push(`d’après « ${proposal.excerpt} »`);
  return parts.join(" · ");
}

/** Option comparée, écrite en clair (rien pour un objet : l'option le dit). */
export function comparedToLabel(proposal: Proposal): string | null {
  if (!proposal.alternativeId) return null;
  const other = getGesture(proposal.alternativeId);
  return other ? `Comparé à : ${other.label}` : null;
}

/** Champ à remplir dans la carte d'un geste (distance, option d'objet), ou null. */
export function inlineNeed(
  proposal: Proposal,
): "quantity" | "object-option" | null {
  const missing = missingFor(proposal);
  return missing === "quantity" || missing === "object-option" ? missing : null;
}

/** Ids stables : le bouton désactivé y mène le focus. */
export const rowCheckboxId = (key: string) => `raconte-${key}-case`;
export const rowFieldId = (key: string) => `raconte-${key}-champ`;

export type Blocking = {
  message: string;
  /** Élément où placer le focus quand on touche le bouton ou le message. */
  focusId: string;
};

/**
 * Ce qui empêche l'ajout (null : tout est prêt) : aucun geste coché, ou des gestes cochés
 * à compléter (« 2 gestes à compléter »), avec le premier à rejoindre.
 */
export function blockingFor(
  rows: readonly { proposal: Proposal; checked: boolean }[],
): Blocking | null {
  const checked = rows.filter((row) => row.checked);
  if (checked.length === 0)
    return rows.length
      ? {
          message: "Coche au moins un geste pour l’ajouter au carnet.",
          focusId: rowCheckboxId(rows[0].proposal.key),
        }
      : null;
  const incomplete = checked.filter((row) => missingFor(row.proposal));
  if (incomplete.length === 0) return null;
  const first = incomplete[0].proposal;
  return {
    message: plural(
      incomplete.length,
      "geste à compléter",
      "gestes à compléter",
    ),
    focusId: inlineNeed(first)
      ? rowFieldId(first.key)
      : rowCheckboxId(first.key),
  };
}

/** Messages quand l'analyse ne donne rien : jamais d'alarme, toujours une autre voie. */
export const ERROR_MESSAGES: Record<RaconteError, string> = {
  offline:
    "Pas de connexion pour l’instant. Réessaie dans un moment, ou choisis tes gestes toi-même.",
  turnstile:
    "La vérification anti-robot n’a pas abouti. Réessaie, ou choisis tes gestes toi-même.",
  "text-length": "Écris entre 1 et 280 caractères, puis relance l’analyse.",
  "rate-limited":
    "Tu as déjà raconté plusieurs journées aujourd’hui. Reviens demain, ou choisis tes gestes toi-même.",
  quota:
    "Claude a beaucoup lu aujourd’hui et se repose jusqu’à demain. En attendant, tu peux choisir tes gestes toi-même.",
  disabled:
    "« Raconte ta journée » fait une pause pour l’instant. Tu peux choisir tes gestes toi-même.",
  error:
    "Claude n’a pas pu lire ta journée cette fois. Réessaie dans un moment, ou choisis tes gestes toi-même.",
};

export const NOTHING_FOUND =
  "Je n’ai reconnu aucun geste du catalogue dans ton texte. Tu peux le reformuler, ou choisir tes gestes toi-même.";
