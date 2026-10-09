// Répliques de l’écureuil : contenu reçu le 9 octobre 2026
// (animaux-dialogues-ecureuil-abeille.json), textes repris mot pour mot.
// Personnalité : Étourdi, gourmand, toujours en mouvement. Parle vite et se perd dans
// ses phrases.
// Visiteur d'automne, jamais dessiné endormi : ses répliques de sommeil ne s'affichent pas
// (gardées si un dessin endormi arrive).
// Format : ./types.ts ; sources des faits : docs/animaux-sources.md.
import type { AnimalScript } from "./types";

export const ECUREUIL: AnimalScript = {
  name: { fr: "Écureuil", en: "Squirrel" },
  talk: { fr: "Parler à l’écureuil", en: "Talk to the squirrel" },
  lines: [
    {
      id: "ecu-1",
      chapter: 1,
      kind: "presentation",
      steps: [
        {
          expr: "surpris",
          fr: "Oh ! Tu m'as fait peur. Enfin non. Si. Un peu.",
          en: "Oh! You made me jump. Well, no. Yes. A bit.",
        },
        {
          expr: "content",
          fr: "Moi, c'est l'écureuil. Je cours, je grimpe, je cache des noisettes. Et après… je ne sais plus où.",
          en: "I'm the squirrel. I run, I climb, I hide hazelnuts. And then… I can't remember where.",
        },
      ],
    },
    {
      id: "ecu-2",
      chapter: 2,
      kind: "fait",
      sourceId: "ecureuil-futura",
      steps: [
        {
          expr: "content",
          fr: "Chaque année, je cache plusieurs milliers de graines.",
          en: "Every year I hide several thousand seeds.",
        },
        {
          expr: "surpris",
          fr: "Dans le sol, dans les arbres creux… partout !",
          en: "In the ground, in hollow trees… everywhere!",
        },
        {
          expr: "content",
          fr: "Me souvenir de toutes mes cachettes, c'est une autre histoire.",
          en: "Remembering all my hiding places is another story.",
        },
      ],
    },
    {
      id: "ecu-3",
      chapter: 2,
      kind: "fait",
      sourceId: "ecureuil-espace-sciences",
      steps: [
        {
          expr: "content",
          fr: "Tu sais ce qui arrive aux graines que j'oublie ?",
          en: "Do you know what happens to the seeds I forget?",
        },
        {
          expr: "surpris",
          fr: "Elles germent et deviennent des arbres !",
          en: "They sprout and grow into trees!",
        },
        {
          expr: "content",
          fr: "Donc je ne suis pas étourdi. Je suis jardinier.",
          en: "So I'm not scatterbrained. I'm a gardener.",
        },
      ],
    },
    {
      id: "ecu-4",
      chapter: 3,
      kind: "fait",
      sourceId: "ecureuil-espace-sciences",
      steps: [
        {
          expr: "content",
          fr: "Tu as vu ma queue ? Elle n'est pas là que pour faire joli.",
          en: "Seen my tail? It's not just for show.",
        },
        {
          expr: "surpris",
          fr: "C'est mon balancier ! Elle m'aide à garder l'équilibre quand je file de branche en branche.",
          en: "It's my balancing pole! It helps me keep my balance when I dash from branch to branch.",
        },
      ],
    },
    {
      id: "ecu-5",
      chapter: 4,
      kind: "fait",
      sourceId: "ecureuil-espace-sciences",
      steps: [
        {
          expr: "content",
          fr: "Une confidence de rongeur ?",
          en: "Want a rodent's secret?",
        },
        {
          expr: "surpris",
          fr: "Mes dents de devant poussent toute ma vie !",
          en: "My front teeth keep growing my whole life!",
        },
        {
          expr: "content",
          fr: "Alors je croque des noisettes. Beaucoup de noisettes.",
          en: "So I crunch hazelnuts. Lots of hazelnuts.",
        },
      ],
    },
    {
      id: "ecu-6",
      chapter: 5,
      kind: "souvenir",
      steps: [
        {
          expr: "content",
          fr: "Tiens, une noisette. Je l'ai cachée pour toi.",
          en: "Here, a hazelnut. I hid it for you.",
        },
        {
          expr: "surpris",
          fr: "Et pour une fois, je me suis souvenu où !",
          en: "And for once, I remembered where!",
        },
      ],
    },
    {
      id: "ecu-c1",
      chapter: 3,
      kind: "fait",
      sourceId: "ecureuil-futura",
      condition: { season: "automne" },
      steps: [
        {
          expr: "content",
          fr: "L'hiver approche. Mais moi, je n'hiberne pas : je ne dors pas tout l'hiver.",
          en: "Winter's coming. But I don't hibernate: I don't sleep all winter.",
        },
        {
          expr: "content",
          fr: "Quand il fera froid, je me blottirai dans un de mes nids ronds, faits de brindilles et de mousse.",
          en: "When it gets cold, I'll snuggle into one of my round nests, made of twigs and moss.",
        },
      ],
    },
    {
      id: "ecu-c2",
      chapter: 3,
      kind: "fait",
      sourceId: "ecureuil-futura",
      condition: { season: "automne" },
      steps: [
        {
          expr: "surpris",
          fr: "Tu as vu mes oreilles ? Des petites touffes de poils y poussent quand le froid arrive.",
          en: "Seen my ears? Little tufts of fur grow on them as the cold sets in.",
        },
        {
          expr: "content",
          fr: "Ça s'appelle des pinceaux. Très chic, non ?",
          en: "They're called ear tufts. Rather dashing, no?",
        },
      ],
    },
    {
      id: "ecu-c3",
      chapter: 3,
      kind: "humeur",
      condition: { planted: "arbre-5" /* sapin */ },
      steps: [
        {
          expr: "surpris",
          fr: "Un sapin ! Parfait pour grimper tout en haut.",
          en: "A fir tree! Perfect for climbing right to the top.",
        },
        {
          expr: "content",
          fr: "De là-haut, je surveille toutes mes cachettes. Enfin, celles dont je me souviens.",
          en: "From up there I keep an eye on all my hiding places. Well, the ones I remember.",
        },
      ],
    },
  ],
  sleep: [
    [
      {
        expr: "dort",
        fr: "Zzz… (L'écureuil dort dans son nid. Il a sûrement caché ses rêves quelque part.)",
        en: "Zzz… (The squirrel is asleep in its nest. It's probably hidden its dreams somewhere.)",
      },
    ],
    [
      {
        expr: "dort",
        fr: "Zzz… (Il marmonne en dormant : « Troisième branche à gauche… ou à droite ? »)",
        en: 'Zzz… (It mumbles in its sleep: "Third branch on the left… or the right?")',
      },
    ],
  ],
  sleepSourceId: "ecureuil-futura",
  again: [
    [
      {
        expr: "content",
        fr: "On s'est déjà parlé aujourd'hui ! Je crois. Oui. Sûrement.",
        en: "We've already talked today! I think. Yes. Probably.",
      },
    ],
    [
      {
        expr: "content",
        fr: "Reviens demain, j'ai des noisettes à cacher. Beaucoup de noisettes.",
        en: "Come back tomorrow, I've got hazelnuts to hide. Lots of hazelnuts.",
      },
    ],
  ],
};
