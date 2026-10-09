// Répliques de l’abeille : contenu reçu le 9 octobre 2026
// (animaux-dialogues-ecureuil-abeille.json), textes repris mot pour mot.
// Personnalité : Travailleuse, organisée, toujours pressée. Compte tout et adore les chiffres.
// Jamais dessinée endormie (absente l'hiver, la nuit et quand le jardin s'assoupit) : sa
// réplique de sommeil est gardée dans le contenu sans être affichée.
// Format : ./types.ts ; sources des faits : docs/animaux-sources.md.
import type { AnimalScript } from "./types";

export const ABEILLE: AnimalScript = {
  name: { fr: "Abeille", en: "Bee" },
  talk: { fr: "Parler à l’abeille", en: "Talk to the bee" },
  lines: [
    {
      id: "abe-1",
      chapter: 1,
      kind: "presentation",
      steps: [
        {
          expr: "content",
          fr: "Bonjour ! Je n'ai qu'une minute, des fleurs m'attendent.",
          en: "Hello! I've only got a minute, there are flowers waiting for me.",
        },
        {
          expr: "content",
          fr: "Je suis une abeille ouvrière. Butineuse, pour être précise.",
          en: "I'm a worker bee. A forager, to be precise.",
        },
      ],
    },
    {
      id: "abe-2",
      chapter: 2,
      kind: "fait",
      sourceId: "abeille-larousse",
      steps: [
        {
          expr: "content",
          fr: "Tu sais combien de fleurs de trèfle je dois visiter pour remplir mon jabot de nectar ?",
          en: "Do you know how many clover flowers I have to visit to fill my nectar sac?",
        },
        {
          expr: "surpris",
          fr: "Entre 1 000 et 1 500 !",
          en: "Between 1,000 and 1,500!",
        },
        {
          expr: "content",
          fr: "Et ensuite, je recommence.",
          en: "And then I start all over again.",
        },
      ],
    },
    {
      id: "abe-3",
      chapter: 2,
      kind: "fait",
      sourceId: "abeille-larousse",
      steps: [
        {
          expr: "content",
          fr: "Le coquelicot, je l'adore. Mais pas pour son rouge.",
          en: "I love poppies. But not for their red.",
        },
        {
          expr: "surpris",
          fr: "Ce qui m'attire, ce sont les ultraviolets qu'il renvoie. Toi, tu ne peux pas les voir !",
          en: "What draws me in is the ultraviolet light they reflect. You can't see it!",
        },
      ],
    },
    {
      id: "abe-4",
      chapter: 3,
      kind: "fait",
      sourceId: "abeille-larousse",
      steps: [
        {
          expr: "content",
          fr: "Quand je trouve de bonnes fleurs, je rentre à la ruche et je danse.",
          en: "When I find good flowers, I fly back to the hive and dance.",
        },
        {
          expr: "surpris",
          fr: "Ma danse indique la direction des fleurs par rapport au soleil !",
          en: "My dance shows where the flowers are, compared with the sun!",
        },
        {
          expr: "content",
          fr: "Les autres n'ont plus qu'à suivre. Efficace.",
          en: "The others just have to follow. Efficient.",
        },
      ],
    },
    {
      id: "abe-5",
      chapter: 4,
      kind: "fait",
      sourceId: "abeilles-lpo-paca",
      steps: [
        {
          expr: "content",
          fr: "Moi, je vis dans une ruche. Mais je ne suis pas la seule abeille du coin.",
          en: "I live in a hive. But I'm not the only bee around here.",
        },
        {
          expr: "surpris",
          fr: "En France, il existe près de 1 000 espèces d'abeilles !",
          en: "In France there are nearly 1,000 species of bee!",
        },
        {
          expr: "content",
          fr: "La plupart des abeilles sauvages nichent dans le sol. Mes cousines, en quelque sorte.",
          en: "Most wild bees nest in the ground. My cousins, in a way.",
        },
      ],
    },
    {
      id: "abe-6",
      chapter: 5,
      kind: "souvenir",
      steps: [
        {
          expr: "content",
          fr: "Tu reviens aussi régulièrement qu'une butineuse. C'est le plus beau compliment que je connaisse.",
          en: "You come back as regularly as a forager. That's the finest compliment I know.",
        },
        {
          expr: "content",
          fr: "Garde cette goutte de nectar. Elle vient de ton jardin.",
          en: "Keep this drop of nectar. It comes from your garden.",
        },
      ],
    },
    {
      id: "abe-c1",
      chapter: 3,
      kind: "fait",
      sourceId: "abeille-larousse",
      condition: { season: "ete" },
      steps: [
        {
          expr: "content",
          fr: "En été, une ouvrière comme moi ne vit que quelques semaines.",
          en: "In summer, a worker like me only lives a few weeks.",
        },
        {
          expr: "surpris",
          fr: "C'est pour ça que je suis toujours pressée !",
          en: "That's why I'm always in a hurry!",
        },
      ],
    },
    {
      id: "abe-c2",
      chapter: 2,
      kind: "humeur",
      condition: { season: "printemps" },
      steps: [
        {
          expr: "surpris",
          fr: "Le printemps ! Les fleurs s'ouvrent, la ruche s'active.",
          en: "Spring! The flowers are opening, the hive is buzzing.",
        },
        {
          expr: "content",
          fr: "Pas le temps de discuter… enfin, juste un peu.",
          en: "No time to chat… well, just a little.",
        },
      ],
    },
    {
      id: "abe-c3",
      chapter: 3,
      kind: "humeur",
      condition: { planted: "fleur-5" /* lavande */ },
      steps: [
        { expr: "surpris", fr: "De la lavande !", en: "Lavender!" },
        {
          expr: "content",
          fr: "Je préviens les autres. Ça mérite une danse.",
          en: "I'm telling the others. This calls for a dance.",
        },
      ],
    },
  ],
  sleep: [
    [
      {
        expr: "dort",
        fr: "Zzz… (L'abeille est rentrée à la ruche. Elle reprendra le travail demain matin.)",
        en: "Zzz… (The bee has gone back to the hive. She'll be back at work tomorrow morning.)",
      },
    ],
  ],

  again: [
    [
      {
        expr: "content",
        fr: "On s'est déjà parlé aujourd'hui. Et j'ai encore des centaines de fleurs sur ma liste.",
        en: "We've already talked today. And I've still got hundreds of flowers on my list.",
      },
    ],
    [
      {
        expr: "content",
        fr: "Demain, même fleur, même heure ?",
        en: "Tomorrow, same flower, same time?",
      },
    ],
  ],
};
