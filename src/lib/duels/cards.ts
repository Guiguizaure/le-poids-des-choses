// Contenu des cartes de duels prêts à jouer, préparé avec les données (au rendu serveur pour
// l'accueil) : le navigateur n'a plus qu'à choisir le Duel du jour.
import { comparisonHref } from "@/lib/compare/url";
import type { Locale } from "@/lib/i18n";
import { CATEGORY_NAMES } from "@/lib/i18n/messages/names";
import type { IllustrationName } from "@/lib/illustrations/specs";
import { pictoFor } from "@/lib/journal/display";
import {
  DUEL_TITLES,
  duelCategory,
  duelGestures,
  READY_DUELS,
  type ReadyDuel,
} from "./ready";

export type DuelCard = {
  id: string;
  /** Adresse française ; le lien la traduit (LocalLink). */
  href: string;
  pictos: [IllustrationName, IllustrationName];
  category: string;
  title: string;
};

/** Pictos d'un duel : les deux gestes, ou l'objet et l'option proposée (occasion, garder). */
function duelPictos(duel: ReadyDuel): [IllustrationName, IllustrationName] {
  if (duel.state.step === "object") {
    const mode = duel.state.option === "neuf" ? undefined : duel.state.option;
    return [pictoFor(duel.state.object), pictoFor(duel.state.object, mode)];
  }
  const [a, b] = duelGestures(duel);
  return [pictoFor(a), pictoFor(b)];
}

/** Les cartes, dans l'ordre de la liste (la rotation du jour se fait ensuite). */
export function duelCards(locale: Locale): DuelCard[] {
  return READY_DUELS.map((duel) => ({
    id: duel.id,
    href: comparisonHref(duel.state),
    pictos: duelPictos(duel),
    category: CATEGORY_NAMES[locale][duelCategory(duel)],
    title: DUEL_TITLES[locale][duel.id],
  }));
}
