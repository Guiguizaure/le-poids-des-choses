// « Les animaux parlent » : format du contenu. Chaque texte existe en français ET en anglais
// (`Bilingual`) : une langue oubliée fait échouer la vérification des types, donc le build.
// Une réplique est une séquence de 1 à 3 étapes, chacune avec l'expression du portrait.
import type { Season } from "@/lib/garden/seasons";

/** Animaux qui parlent (lot « Les animaux parlent ») : quatre débloqués et le renard. */
export const TALKERS = [
  "butterfly",
  "ladybug",
  "bird",
  "snail",
  "fox",
] as const;
export type TalkerId = (typeof TALKERS)[number];

export type Bilingual = { fr: string; en: string };

/** 1 présentation, 2 anecdote, 3 petite histoire, 4 confidence, 5 souvenir. */
export type Chapter = 1 | 2 | 3 | 4 | 5;

/**
 * `fait` : une information sur le vrai animal, qui doit citer une source de
 * docs/animaux-sources.md (`sourceId`) ; `recit` : le personnage parle, sans fait à sourcer.
 */
export type LineKind = "fait" | "recit";

/** Réplique conditionnelle : prioritaire quand toutes ses conditions sont vraies. */
export type LineCondition = {
  season?: Season;
  night?: boolean;
  /** Espèce plantée dans le jardin (id de species.ts : « arbre-1 », « fleur-4 »…). */
  planted?: string;
};

/** Expression du portrait pendant une étape. */
export const EXPRESSIONS = ["content", "surpris", "dort"] as const;
export type Expression = (typeof EXPRESSIONS)[number];

/** Une étape d'une réplique : ce que dit l'animal, et sa tête pendant ce temps. */
export type Step = Bilingual & { expr: Expression };

/** Une réplique : une séquence de 1 à 3 étapes (« Suite ▶ » entre deux). */
export type Sequence = readonly Step[];

export type Line = {
  /** Identifiant stable (mémorisé dans lpdc:amis:v1) : ne jamais le changer ni le réutiliser. */
  id: string;
  chapter: Chapter;
  kind: LineKind;
  sourceId?: string;
  condition?: LineCondition;
  steps: Sequence;
};

export type AnimalScript = {
  /** Étiquette de la boîte de dialogue et de la liste : « Papillon », « Butterfly ». */
  name: Bilingual;
  /** Nom accessible de la zone de toucher : « Parler au papillon », « Talk to the butterfly ». */
  talk: Bilingual;
  /** Répliques, dans l'ordre où elles se découvrent (chapitre par chapitre). */
  lines: readonly Line[];
  /** Répliques quand il dort (dans son personnage), expression « dort » à chaque étape. */
  sleep: readonly Sequence[];
  /** « Déjà parlé aujourd'hui » : tirée parmi 2 ou 3. */
  again: readonly Sequence[];
};
