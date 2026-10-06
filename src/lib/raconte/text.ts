// Textes de l'écran « Raconte ta journée » (maquette 08) : lignes des gestes repérés, ce qui
// manque avant l'ajout, messages doux quand l'analyse n'aboutit pas. Les phrases sont dans
// src/lib/i18n/messages/raconte.ts.
import { objectNoun, possessive, type ObjectOption } from "@/lib/compare";
import { gestureDetail, gestureLabel, getGesture } from "@/lib/data";
import { format, type Locale } from "@/lib/i18n";
import { RACONTE } from "@/lib/i18n/messages/raconte";
import { CATEGORY_NAMES } from "@/lib/i18n/messages/names";
import type { RaconteError } from "./api";
import { missingFor, type Proposal } from "./proposal";

/** Mention demandée sous le champ. */
export const PRIVACY_NOTICE = RACONTE.fr.privacy;

export function objectOptionLabel(
  gestureId: string,
  option: ObjectOption,
  locale: Locale = "fr",
): string {
  const t = RACONTE[locale];
  if (option === "neuf") return t.optionNew;
  if (option === "occasion") return t.optionUsed;
  return format(t.optionKeep, {
    mine: possessive(objectNoun(gestureId, locale), "moi", locale),
  });
}

/** Quantité ou option, telle qu'elle sera notée (« 65 km », « 1 repas », « à préciser »). */
function detailFor(proposal: Proposal, locale: Locale): string {
  const t = RACONTE[locale];
  const gesture = getGesture(proposal.gestureId);
  if (!gesture) return "";
  switch (gesture.unit) {
    case "km":
      return proposal.quantity === null
        ? t.distanceToFill
        : format(t.km, { n: proposal.quantity });
    case "repas":
      return t.meal;
    case "litre":
      return t.litre;
    case "achat":
      return gestureDetail(gesture.id, locale) ?? t.purchase;
    case "objet":
      if (!proposal.objectOption) return t.optionToFill;
      return proposal.objectOption === "occasion" && proposal.delivered
        ? t.usedDelivered
        : objectOptionLabel(
            gesture.id,
            proposal.objectOption,
            locale,
          ).toLowerCase();
  }
}

/** Ligne sous le nom du geste : « Manger · 1 repas · d’après « burger » ». */
export function proposalSubtitle(
  proposal: Proposal,
  locale: Locale = "fr",
): string {
  const t = RACONTE[locale];
  const gesture = getGesture(proposal.gestureId);
  if (!gesture) return "";
  const parts = [
    CATEGORY_NAMES[locale][gesture.category],
    proposal.asHabit ? t.habitNoKg : detailFor(proposal, locale),
  ];
  if (proposal.certainty === "inferred")
    parts.push(format(t.fromExcerpt, { excerpt: proposal.excerpt }));
  return parts.join(" · ");
}

/** Option comparée, écrite en clair (rien pour un objet : l'option le dit). */
export function comparedToLabel(
  proposal: Proposal,
  locale: Locale = "fr",
): string | null {
  if (proposal.asHabit || !proposal.alternativeId) return null;
  const other = getGesture(proposal.alternativeId);
  return other
    ? format(RACONTE[locale].comparedTo, {
        label: gestureLabel(other.id, locale),
      })
    : null;
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
  locale: Locale = "fr",
): Blocking | null {
  const t = RACONTE[locale];
  const checked = rows.filter((row) => row.checked);
  if (checked.length === 0)
    return rows.length
      ? { message: t.tickOne, focusId: rowCheckboxId(rows[0].proposal.key) }
      : null;
  const incomplete = checked.filter((row) => missingFor(row.proposal));
  if (incomplete.length === 0) return null;
  const first = incomplete[0].proposal;
  return {
    message: t.toComplete(incomplete.length),
    focusId: inlineNeed(first)
      ? rowFieldId(first.key)
      : rowCheckboxId(first.key),
  };
}

/** Messages quand l'analyse ne donne rien : jamais d'alarme, toujours une autre voie. */
export const ERROR_MESSAGES: Record<RaconteError, string> = RACONTE.fr.errors;

export function errorMessage(
  error: RaconteError,
  locale: Locale = "fr",
): string {
  return RACONTE[locale].errors[error];
}

export const NOTHING_FOUND = RACONTE.fr.nothing;
