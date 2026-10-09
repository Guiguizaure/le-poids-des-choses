// « Le jardin au fil des saisons » : bloc de la fiche d'espèce, astuces (premier choix
// d'espèce, changement de saison), arbre endormi qu'on touche. Les espèces arrivent par leurs
// fiches (src/lib/i18n/messages/species.ts : `inSentence`, `pronoun`, `name`).
import type { Season } from "@/lib/garden/seasons";
import { defineMessages } from "../index";

/** Un arbre caduc du jardin et son nombre (« ton pommier », « tes pommiers »). */
export type DeciduousInGarden = { name: string; count: number };

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

/** « a », « a et b », « a, b et c » / “a”, “a and b”, “a, b and c”. */
const listFr = (items: readonly string[]) =>
  items.length < 2
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} et ${items.at(-1)}`;
const listEn = (items: readonly string[]) =>
  items.length < 2
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

const yoursFr = (trees: readonly DeciduousInGarden[]) =>
  listFr(
    trees.map((tree) =>
      tree.count > 1 ? `tes ${tree.name}s` : `ton ${tree.name}`,
    ),
  );
const yoursEn = (trees: readonly DeciduousInGarden[]) =>
  listEn(trees.map((tree) => `your ${tree.name}${tree.count > 1 ? "s" : ""}`));
const total = (trees: readonly DeciduousInGarden[]) =>
  trees.reduce((sum, tree) => sum + tree.count, 0);

export const SEASONS_UI = defineMessages(
  {
    names: {
      printemps: "Printemps",
      ete: "Été",
      automne: "Automne",
      hiver: "Hiver",
    } satisfies Record<Season, string>,
    throughSeasons: "Au fil des saisons",
    /** Caduc : « Le pommier perd ses feuilles et dort en hiver. Il se réveillera au printemps. » */
    deciduous: (inSentence: string, pronoun: string) =>
      `${capitalize(inSentence)} perd ses feuilles et dort en hiver. ${capitalize(pronoun)} se réveillera au printemps.`,
    /** Persistant : « L’olivier garde ses feuilles toute l’année, même en hiver. » */
    evergreen: (inSentence: string, needles: boolean) =>
      `${capitalize(inSentence)} garde ses ${needles ? "aiguilles" : "feuilles"} toute l’année, même en hiver.`,
    /** Nom accessible d'un arbre endormi du jardin. */
    asleepTree: (name: string) => `${name} endormi`,
    /** Ce qu'on lit en touchant un arbre endormi. */
    asleepUntilSpring: (inSentence: string) =>
      `${capitalize(inSentence)} dort jusqu’au printemps.`,
    /** Astuce avant la grille des espèces, la première fois. */
    pickerHint:
      "Chaque espèce vit au rythme des vraies saisons : certaines se colorent en automne et dorment l’hiver, d’autres gardent leurs feuilles toute l’année. Tu retrouves tout ça dans la fiche de chaque espèce.",
    /** Astuce du changement de saison, d'après les arbres du jardin (null : aucune). */
    seasonHint: (
      season: Season,
      deciduous: readonly DeciduousInGarden[],
      evergreen: readonly string[],
    ): string | null => {
      if (deciduous.length === 0) return null;
      const many = total(deciduous) > 1;
      if (season === "automne") {
        const kept =
          evergreen.length === 0
            ? ""
            : evergreen.length === 1
              ? ` ${capitalize(evergreen[0])}, lui, garde ses feuilles.`
              : ` ${capitalize(listFr(evergreen))}, eux, gardent leurs feuilles.`;
        return `L’automne est là : ${yoursFr(deciduous)} ${many ? "se colorent" : "se colore"}.${kept}`;
      }
      if (season === "hiver")
        return many
          ? `C’est l’hiver : ${yoursFr(deciduous)} se sont endormis. Ils se réveilleront au printemps.`
          : `C’est l’hiver : ${yoursFr(deciduous)} s’est endormi. Il se réveillera au printemps.`;
      if (season === "printemps")
        return many
          ? "Le printemps revient : tes arbres se réveillent."
          : `Le printemps revient : ${yoursFr(deciduous)} se réveille.`;
      return null;
    },
  },
  {
    names: {
      printemps: "Spring",
      ete: "Summer",
      automne: "Autumn",
      hiver: "Winter",
    },
    throughSeasons: "Through the seasons",
    deciduous: (inSentence: string, pronoun: string) =>
      `The ${inSentence} loses its leaves and sleeps through winter. ${capitalize(pronoun)} will wake up in spring.`,
    evergreen: (inSentence: string, needles: boolean) =>
      `The ${inSentence} keeps its ${needles ? "needles" : "leaves"} all year round, even in winter.`,
    asleepTree: (name: string) => `${name}, asleep`,
    asleepUntilSpring: (inSentence: string) =>
      `The ${inSentence} is asleep until spring.`,
    pickerHint:
      "Each species lives by the real seasons: some turn colour in autumn and sleep through winter, others keep their leaves all year round. You’ll find it all on each species’ sheet.",
    seasonHint: (
      season: Season,
      deciduous: readonly DeciduousInGarden[],
      evergreen: readonly string[],
    ): string | null => {
      if (deciduous.length === 0) return null;
      const many = total(deciduous) > 1;
      if (season === "automne") {
        const kept =
          evergreen.length === 0
            ? ""
            : evergreen.length === 1
              ? ` The ${evergreen[0]}, though, keeps its leaves.`
              : ` The ${listEn(evergreen)}, though, keep their leaves.`;
        return `Autumn is here: ${yoursEn(deciduous)} ${many ? "are" : "is"} turning colour.${kept}`;
      }
      if (season === "hiver")
        return many
          ? `It’s winter: ${yoursEn(deciduous)} have fallen asleep. They will wake up in spring.`
          : `It’s winter: ${yoursEn(deciduous)} has fallen asleep. It will wake up in spring.`;
      if (season === "printemps")
        return many
          ? "Spring is back: your trees are waking up."
          : `Spring is back: ${yoursEn(deciduous)} is waking up.`;
      return null;
    },
  },
);
