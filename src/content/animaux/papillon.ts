// Répliques du papillon : contenu reçu le 8 octobre 2026 (animaux-dialogues.json),
// textes repris mot pour mot. Personnalité : Tête en l'air, rêveur, part dans tous les sens.
// Format : ./types.ts ; sources des faits : docs/animaux-sources.md.
import type { AnimalScript } from "./types";

export const PAPILLON: AnimalScript = {
  name: { fr: "Papillon", en: "Butterfly" },
  talk: { fr: "Parler au papillon", en: "Talk to the butterfly" },
  lines: [
    {
      id: "pap-1",
      chapter: 1,
      kind: "presentation",
      steps: [
        {
          expr: "surpris",
          fr: "Oh ! Bonjour ! Pardon, je pensais à une fleur.",
          en: "Oh! Hello! Sorry, I was thinking about a flower.",
        },
        {
          expr: "content",
          fr: "Je suis le papillon. Je vole, je butine, je rêvasse. Surtout je rêvasse.",
          en: "I'm the butterfly. I fly, I sip nectar, I daydream. Mostly I daydream.",
        },
      ],
    },
    {
      id: "pap-2",
      chapter: 2,
      kind: "fait",
      sourceId: "papillon-carleton",
      steps: [
        {
          expr: "content",
          fr: "Tu sais comment je sais si une plante est bonne ?",
          en: "Do you know how I tell if a plant is any good?",
        },
        {
          expr: "surpris",
          fr: "Je goûte avec mes pattes ! Elles sentent les saveurs dès que je me pose.",
          en: "I taste with my feet! They pick up flavours as soon as I land.",
        },
      ],
    },
    {
      id: "pap-3",
      chapter: 3,
      kind: "fait",
      sourceId: "papillon-carleton",
      steps: [
        {
          expr: "content",
          fr: "Les mamans papillons tapotent les feuilles avec leurs pattes avant de pondre.",
          en: "Mother butterflies drum on leaves with their feet before laying eggs.",
        },
        {
          expr: "content",
          fr: "Comme ça, elles vérifient que la plante conviendra à leurs chenilles.",
          en: "That way they check the plant will suit their caterpillars.",
        },
      ],
    },
    {
      id: "pap-4",
      chapter: 3,
      kind: "histoire",
      steps: [
        {
          expr: "content",
          fr: "J'ai été une chenille, tu sais. Je mangeais, je dormais, je mangeais.",
          en: "I used to be a caterpillar, you know. I ate, I slept, I ate.",
        },
        {
          expr: "surpris",
          fr: "Et un jour : des ailes ! Personne ne m'avait prévenu.",
          en: "And one day: wings! Nobody warned me.",
        },
      ],
    },
    {
      id: "pap-5",
      chapter: 4,
      kind: "confidence",
      steps: [
        {
          expr: "content",
          fr: "L'escargot m'a conseillé de prendre mon temps.",
          en: "The snail told me to take my time.",
        },
        {
          expr: "surpris",
          fr: "J'ai essayé. J'ai tenu quatre secondes.",
          en: "I tried. I lasted four seconds.",
        },
      ],
    },
    {
      id: "pap-6",
      chapter: 5,
      kind: "souvenir",
      steps: [
        {
          expr: "content",
          fr: "Tiens, un peu de pollen doré pour ton jardin. Ne le dis pas aux abeilles.",
          en: "Here, a little golden pollen for your garden. Don't tell the bees.",
        },
      ],
    },
    {
      id: "pap-c1",
      chapter: 2,
      kind: "humeur",
      condition: { season: "printemps" },
      steps: [
        {
          expr: "surpris",
          fr: "Le printemps ! Tout fleurit en même temps, je ne sais plus où me poser.",
          en: "Spring! Everything's blooming at once, I don't know where to land.",
        },
      ],
    },
    {
      id: "pap-c2",
      chapter: 3,
      kind: "humeur",
      condition: { planted: "fleur-5" /* lavande */ },
      steps: [
        {
          expr: "surpris",
          fr: "De la lavande !",
          en: "Lavender!",
        },
        {
          expr: "content",
          fr: "Je crois que je vais rester ici pour toujours. Ou au moins dix minutes.",
          en: "I think I'll stay here forever. Or at least ten minutes.",
        },
      ],
    },
  ],
  sleep: [],
  again: [
    [
      {
        expr: "surpris",
        fr: "Encore toi ? Pardon, j'avais la tête ailleurs. On se reparle demain, promis !",
        en: "You again? Sorry, my mind was elsewhere. Let's talk tomorrow, promise!",
      },
    ],
    [
      {
        expr: "content",
        fr: "J'ai déjà oublié ce que je voulais te dire… Reviens demain, ça me reviendra.",
        en: "I've already forgotten what I wanted to say… Come back tomorrow, it'll come back to me.",
      },
    ],
  ],
};
