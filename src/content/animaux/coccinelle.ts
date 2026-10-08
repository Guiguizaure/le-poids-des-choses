// Répliques de la coccinelle : contenu reçu le 8 octobre 2026 (animaux-dialogues.json),
// textes repris mot pour mot. Personnalité : Petite teigne énergique, se prend pour la garde du jardin.
// Format : ./types.ts ; sources des faits : docs/animaux-sources.md.
import type { AnimalScript } from "./types";

export const COCCINELLE: AnimalScript = {
  name: { fr: "Coccinelle", en: "Ladybird" },
  talk: { fr: "Parler à la coccinelle", en: "Talk to the ladybird" },
  lines: [
    {
      id: "coc-1",
      chapter: 1,
      kind: "presentation",
      steps: [
        {
          expr: "surpris",
          fr: "Halte-là ! Qui va là ?",
          en: "Halt! Who goes there?",
        },
        {
          expr: "content",
          fr: "Ah, c'est toi. Repos. Coccinelle, en service : je surveille ton jardin.",
          en: "Oh, it's you. At ease. Ladybird, on duty: I'm guarding your garden.",
        },
      ],
    },
    {
      id: "coc-2",
      chapter: 2,
      kind: "fait",
      sourceId: "coccinelle-vigienature",
      steps: [
        {
          expr: "content",
          fr: "Les pucerons ? Mes pires ennemis. Enfin… mon goûter.",
          en: "Aphids? My sworn enemies. Well… my snack.",
        },
        {
          expr: "surpris",
          fr: "Une larve de coccinelle peut en manger jusqu'à 600 en quatre semaines !",
          en: "A ladybird larva can eat up to 600 of them in four weeks!",
        },
      ],
    },
    {
      id: "coc-3",
      chapter: 3,
      kind: "fait",
      sourceId: "coccinelle-vigienature",
      steps: [
        {
          expr: "content",
          fr: "Un oiseau veut me croquer ? Je ne me laisse pas faire.",
          en: "A bird wants to gobble me up? Not without a fight.",
        },
        {
          expr: "surpris",
          fr: "Je libère un liquide jaune qui sent mauvais et a un goût âcre. Bon appétit !",
          en: "I release a yellow liquid that smells bad and tastes bitter. Enjoy your meal!",
        },
      ],
    },
    {
      id: "coc-4",
      chapter: 3,
      kind: "fait",
      sourceId: "coccinelle-vigienature",
      steps: [
        {
          expr: "content",
          fr: "L'hiver, je fais une pause. Parfois, je me glisse même dans les maisons pour hiberner.",
          en: "In winter I take a break. Sometimes I even slip into houses to hibernate.",
        },
        {
          expr: "surpris",
          fr: "Si tu me trouves derrière un rideau, ne me dérange pas : c'est ma chambre.",
          en: "If you find me behind a curtain, don't disturb me: that's my bedroom.",
        },
      ],
    },
    {
      id: "coc-5",
      chapter: 4,
      kind: "confidence",
      steps: [
        {
          expr: "content",
          fr: "Je compte mes points tous les matins.",
          en: "I count my spots every morning.",
        },
        {
          expr: "surpris",
          fr: "Sept. Toujours sept. Ça me rassure.",
          en: "Seven. Always seven. I find it reassuring.",
        },
      ],
    },
    {
      id: "coc-6",
      chapter: 5,
      kind: "souvenir",
      steps: [
        {
          expr: "content",
          fr: "Pour ta fidélité, je te nomme garde-jardin d'honneur. Ne me remercie pas, c'est mérité.",
          en: "For your loyalty, I hereby name you honorary garden guard. No need to thank me, you've earned it.",
        },
      ],
    },
    {
      id: "coc-c1",
      chapter: 2,
      kind: "fait",
      sourceId: "coccinelle-vigienature",
      condition: { season: "printemps" },
      steps: [
        {
          expr: "surpris",
          fr: "Le printemps ! Les coccinelles adultes ressortent dès le mois de mars.",
          en: "Spring! Adult ladybirds come back out from March.",
        },
        {
          expr: "content",
          fr: "Au travail : les pucerons n'ont qu'à bien se tenir.",
          en: "Back to work: the aphids had better watch out.",
        },
      ],
    },
  ],
  sleep: [],
  again: [
    [
      {
        expr: "content",
        fr: "Je suis en ronde ! Reviens demain pour le rapport.",
        en: "I'm on patrol! Come back tomorrow for the report.",
      },
    ],
    [
      {
        expr: "content",
        fr: "Une seule audience par jour. C'est le règlement.",
        en: "One audience per day. Those are the rules.",
      },
    ],
  ],
};
