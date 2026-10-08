// Répliques de l’oiseau : contenu reçu le 8 octobre 2026 (animaux-dialogues.json),
// textes repris mot pour mot. Personnalité : Bavard et curieux, enchaîne les questions.
// Format : ./types.ts ; sources des faits : docs/animaux-sources.md.
import type { AnimalScript } from "./types";

export const OISEAU: AnimalScript = {
  name: { fr: "Oiseau", en: "Bird" },
  talk: { fr: "Parler à l’oiseau", en: "Talk to the bird" },
  lines: [
    {
      id: "ois-1",
      chapter: 1,
      kind: "presentation",
      steps: [
        {
          expr: "surpris",
          fr: "Oh, quelqu'un ! Tu viens d'où ? Tu restes longtemps ? Tu aimes les graines ?",
          en: "Oh, someone! Where are you from? Are you staying long? Do you like seeds?",
        },
        {
          expr: "content",
          fr: "Pardon. Je suis l'oiseau du jardin : une mésange bleue, dessinée à la façon de ce jardin.",
          en: "Sorry. I'm the garden bird: a blue tit, drawn the way this garden draws things.",
        },
      ],
    },
    {
      id: "ois-2",
      chapter: 2,
      kind: "fait",
      sourceId: "mesange-vikidia",
      steps: [
        {
          expr: "content",
          fr: "Devine combien je pèse.",
          en: "Guess how much I weigh.",
        },
        {
          expr: "surpris",
          fr: "Entre 9 et 12 grammes ! Un vrai poids plume.",
          en: "Between 9 and 12 grams! A real featherweight.",
        },
      ],
    },
    {
      id: "ois-3",
      chapter: 3,
      kind: "fait",
      sourceId: "mesange-vikidia",
      steps: [
        {
          expr: "content",
          fr: "Au printemps, une maman mésange pond souvent une dizaine d'œufs.",
          en: "In spring, a mother blue tit often lays around ten eggs.",
        },
        {
          expr: "surpris",
          fr: "Une dizaine ! Tu imagines le bruit au nid ?",
          en: "Around ten! Can you imagine the noise in the nest?",
        },
      ],
    },
    {
      id: "ois-4",
      chapter: 3,
      kind: "histoire",
      steps: [
        {
          expr: "content",
          fr: "J'ai vu le renard ce matin. Il dormait. Il dort tout le temps, celui-là.",
          en: "I saw the fox this morning. Asleep. He's always asleep, that one.",
        },
        {
          expr: "surpris",
          fr: "Il paraît qu'il sort la nuit. Moi, la nuit, je dors. On ne se croise jamais !",
          en: "Apparently he comes out at night. At night, I sleep. We never meet!",
        },
      ],
    },
    {
      id: "ois-5",
      chapter: 4,
      kind: "confidence",
      steps: [
        {
          expr: "content",
          fr: "Tu sais pourquoi je m'envole quand on s'approche trop vite ?",
          en: "Do you know why I fly off when someone comes too close too fast?",
        },
        {
          expr: "content",
          fr: "Ce n'est pas contre toi. C'est un vieux réflexe d'oiseau.",
          en: "It's nothing personal. Just an old bird reflex.",
        },
      ],
    },
    {
      id: "ois-6",
      chapter: 5,
      kind: "souvenir",
      steps: [
        {
          expr: "content",
          fr: "Je t'ai gardé une plume. Une toute petite. Pour te souvenir de moi.",
          en: "I saved you a feather. A tiny one. So you'll remember me.",
        },
      ],
    },
    {
      id: "ois-c1",
      chapter: 3,
      kind: "humeur",
      condition: { season: "hiver" },
      steps: [
        {
          expr: "content",
          fr: "Brr, l'hiver ! Je gonfle mes plumes.",
          en: "Brr, winter! I'm fluffing up my feathers.",
        },
        {
          expr: "surpris",
          fr: "J'ai l'air d'une petite boule, non ?",
          en: "I look like a little ball, don't I?",
        },
      ],
    },
    {
      id: "ois-c2",
      chapter: 3,
      kind: "humeur",
      condition: { planted: "arbre-1" /* pommier */ },
      steps: [
        {
          expr: "surpris",
          fr: "Un pommier !",
          en: "An apple tree!",
        },
        {
          expr: "content",
          fr: "Des feuilles pour me cacher, des fruits plus tard. Très bonne idée.",
          en: "Leaves to hide in, fruit later on. Very good idea.",
        },
      ],
    },
  ],
  sleep: [
    [
      {
        expr: "dort",
        fr: "Zzz… (L'oiseau dort, la tête enfouie dans ses plumes. Reviens demain matin.)",
        en: "Zzz… (The bird is asleep, head tucked into its feathers. Come back in the morning.)",
      },
    ],
    [
      {
        expr: "dort",
        fr: "Zzz… pio… zzz…",
        en: "Zzz… tweet… zzz…",
      },
    ],
  ],
  again: [
    [
      {
        expr: "content",
        fr: "J'ai encore plein de choses à te raconter, mais une histoire par jour, c'est la règle. À demain !",
        en: "I've still got loads to tell you, but one story a day is the rule. See you tomorrow!",
      },
    ],
    [
      {
        expr: "surpris",
        fr: "Déjà toi ? Tu m'as manqué ! Bon… on s'est vus il y a cinq minutes. Reviens demain !",
        en: "You again? I missed you! Well… we saw each other five minutes ago. Come back tomorrow!",
      },
    ],
  ],
};
