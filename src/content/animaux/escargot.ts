// Répliques de l’escargot : contenu reçu le 8 octobre 2026 (animaux-dialogues.json),
// textes repris mot pour mot. Personnalité : Philosophe, jamais pressé, pince-sans-rire.
// Format : ./types.ts ; sources des faits : docs/animaux-sources.md.
import type { AnimalScript } from "./types";

export const ESCARGOT: AnimalScript = {
  name: { fr: "Escargot", en: "Snail" },
  talk: { fr: "Parler à l’escargot", en: "Talk to the snail" },
  lines: [
    {
      id: "esc-1",
      chapter: 1,
      kind: "presentation",
      steps: [
        {
          expr: "content",
          fr: "Ah, te voilà. Je t'attendais… enfin, sans me presser.",
          en: "Ah, there you are. I was waiting for you… in no particular hurry.",
        },
        {
          expr: "content",
          fr: "Moi, c'est l'escargot. Je réfléchis beaucoup et j'avance peu. Les deux vont ensemble.",
          en: "I'm the snail. I think a lot and move very little. The two go together.",
        },
      ],
    },
    {
      id: "esc-2",
      chapter: 2,
      kind: "fait",
      sourceId: "escargot-vikidia",
      steps: [
        {
          expr: "content",
          fr: "Tu vois mes deux grandes antennes ?",
          en: "See my two long tentacles?",
        },
        {
          expr: "surpris",
          fr: "Mes yeux sont tout au bout ! Pratique pour regarder par-dessus une feuille.",
          en: "My eyes are right at the tips! Handy for peeking over a leaf.",
        },
      ],
    },
    {
      id: "esc-3",
      chapter: 2,
      kind: "fait",
      sourceId: "escargot-exeter",
      steps: [
        {
          expr: "content",
          fr: "Je fais à peu près un mètre par heure, au mieux.",
          en: "I manage about a metre an hour, at best.",
        },
        {
          expr: "surpris",
          fr: "À ce rythme, traverser ton jardin, c'est une expédition.",
          en: "At that pace, crossing your garden is an expedition.",
        },
        {
          expr: "content",
          fr: "Ma bave m'aide à glisser. Moi, je préfère dire « mon tapis roulant ».",
          en: "My slime helps me glide. I prefer to call it my travelator.",
        },
      ],
    },
    {
      id: "esc-4",
      chapter: 3,
      kind: "fait",
      sourceId: "escargot-vikidia",
      steps: [
        {
          expr: "content",
          fr: "Je vais te confier un secret.",
          en: "Let me tell you a secret.",
        },
        {
          expr: "surpris",
          fr: "Les escargots ont une langue couverte de milliers de minuscules dents !",
          en: "Snails have a tongue covered in thousands of tiny teeth!",
        },
        {
          expr: "content",
          fr: "Ça s'appelle une radula. Idéal pour râper les feuilles.",
          en: "It's called a radula. Perfect for grating leaves.",
        },
      ],
    },
    {
      id: "esc-5",
      chapter: 4,
      kind: "fait",
      sourceId: "escargot-vikidia",
      steps: [
        {
          expr: "content",
          fr: "Chez nous, chaque escargot est à la fois mâle et femelle.",
          en: "In our family, every snail is both male and female.",
        },
        {
          expr: "surpris",
          fr: "Mais il faut quand même être deux pour avoir des petits. La nature aime la compagnie.",
          en: "But it still takes two to have babies. Nature likes company.",
        },
      ],
    },
    {
      id: "esc-6",
      chapter: 5,
      kind: "souvenir",
      steps: [
        {
          expr: "content",
          fr: "Tu reviens souvent. J'aime ça : pas de précipitation, juste de la régularité.",
          en: "You come back often. I like that: no rush, just steadiness.",
        },
        {
          expr: "content",
          fr: "Garde ce souvenir : une feuille de laitue à peine grignotée. C'est mon plus beau cadeau.",
          en: "Keep this as a memento: a barely nibbled lettuce leaf. It's my finest gift.",
        },
      ],
    },
    {
      id: "esc-c1",
      chapter: 2,
      kind: "fait",
      sourceId: "escargot-futura",
      condition: { season: "printemps" },
      steps: [
        {
          expr: "surpris",
          fr: "Le printemps ! J'ai dormi tout l'hiver, bien à l'abri dans ma coquille.",
          en: "Spring! I slept all winter, tucked up in my shell.",
        },
        {
          expr: "content",
          fr: "Je l'avais fermée avec un bouchon de bave séchée. Ça s'appelle un épiphragme.",
          en: "I'd sealed it with a plug of dried slime. It's called an epiphragm.",
        },
      ],
    },
    {
      id: "esc-c2",
      chapter: 3,
      kind: "humeur",
      condition: { night: true },
      steps: [
        {
          expr: "content",
          fr: "La nuit, il fait plus frais et plus humide. Moi, j'adore.",
          en: "At night it's cooler and damper. I love it.",
        },
      ],
    },
    {
      id: "esc-c3",
      chapter: 3,
      kind: "humeur",
      condition: { planted: "arbre-4" /* olivier */ },
      steps: [
        {
          expr: "surpris",
          fr: "Un olivier ? Excellent choix.",
          en: "An olive tree? Excellent choice.",
        },
        {
          expr: "content",
          fr: "Un arbre qui prend son temps. On va bien s'entendre.",
          en: "A tree that takes its time. We'll get on well.",
        },
      ],
    },
  ],
  sleep: [
    [
      {
        expr: "dort",
        fr: "Zzz… (L'escargot hiberne, bien fermé dans sa coquille. Il se réveillera au printemps.)",
        en: "Zzz… (The snail is hibernating, sealed in its shell. It'll wake up in spring.)",
      },
    ],
    [
      {
        expr: "dort",
        fr: "Zzz… On raconte qu'un escargot peut dormir trois ans. C'est très exagéré : dans la nature, c'est plutôt quelques semaines ou quelques mois.",
        en: "Zzz… They say a snail can sleep for three years. That's a big exaggeration: in the wild it's more like a few weeks or months.",
      },
    ],
  ],
  sleepSourceId: "escargot-futura",
  again: [
    [
      {
        expr: "content",
        fr: "Une conversation par jour, c'est déjà un marathon pour moi. Reviens demain.",
        en: "One conversation a day is already a marathon for me. Come back tomorrow.",
      },
    ],
    [
      {
        expr: "content",
        fr: "On s'est déjà parlé aujourd'hui. Laisse-moi digérer… cette conversation.",
        en: "We've already talked today. Let me digest… that conversation.",
      },
    ],
    [
      {
        expr: "content",
        fr: "Demain, peut-être. Ou après-demain. On verra.",
        en: "Tomorrow, maybe. Or the day after. We'll see.",
      },
    ],
  ],
};
