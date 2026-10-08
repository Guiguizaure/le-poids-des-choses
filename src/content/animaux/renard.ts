// Répliques du renard : contenu reçu le 8 octobre 2026 (animaux-dialogues.json),
// textes repris mot pour mot. Personnalité : Beau parleur, charmeur, un peu vantard. Vit la nuit.
// Format : ./types.ts ; sources des faits : docs/animaux-sources.md.
import type { AnimalScript } from "./types";

export const RENARD: AnimalScript = {
  name: { fr: "Renard", en: "Fox" },
  talk: { fr: "Parler au renard", en: "Talk to the fox" },
  lines: [
    {
      id: "ren-1",
      chapter: 1,
      kind: "presentation",
      steps: [
        {
          expr: "content",
          fr: "Bonsoir. Tu as bien fait de venir à cette heure-ci : la nuit, je suis à mon meilleur.",
          en: "Good evening. You were right to come at this hour: at night, I'm at my best.",
        },
        {
          expr: "content",
          fr: "Le renard. Enchanté. Je ne serre pas la patte, mais le cœur y est.",
          en: "The fox. Delighted. I don't shake paws, but the thought is there.",
        },
      ],
    },
    {
      id: "ren-2",
      chapter: 2,
      kind: "fait",
      sourceId: "renard-futura",
      steps: [
        {
          expr: "content",
          fr: "Tu entends ce petit bruit, là ? Non ? Moi, oui.",
          en: "Hear that little noise? No? I do.",
        },
        {
          expr: "surpris",
          fr: "J'ai une ouïe incroyable, surtout pour les sons très graves.",
          en: "My hearing is incredible, especially for very low sounds.",
        },
        {
          expr: "content",
          fr: "Je peux même repérer un mulot qui gratte sous la neige.",
          en: "I can even find a vole scratching about under the snow.",
        },
      ],
    },
    {
      id: "ren-3",
      chapter: 3,
      kind: "fait",
      sourceId: "renard-futura",
      steps: [
        {
          expr: "content",
          fr: "Ensuite, je repère où il est… et hop !",
          en: "Then I work out where it is… and hup!",
        },
        {
          expr: "surpris",
          fr: "Je bondis et je plonge la tête la première dans la neige. Ça s'appelle le mulotage.",
          en: "I leap and dive head first into the snow. It's called mousing.",
        },
      ],
    },
    {
      id: "ren-4",
      chapter: 4,
      kind: "fait",
      sourceId: "renard-futura",
      steps: [
        {
          expr: "content",
          fr: "Un secret de renard ?",
          en: "Want a fox's secret?",
        },
        {
          expr: "surpris",
          fr: "Des chercheurs ont remarqué que je réussis plus souvent mes sauts quand je bondis vers le nord.",
          en: "Researchers noticed I catch more prey when I pounce towards the north.",
        },
        {
          expr: "content",
          fr: "Pourquoi ? Personne ne le sait encore. Moi, je dis que c'est le talent.",
          en: "Why? Nobody knows yet. I say it's talent.",
        },
      ],
    },
    {
      id: "ren-5",
      chapter: 4,
      kind: "confidence",
      steps: [
        {
          expr: "content",
          fr: "L'oiseau croit que je dors tout le temps.",
          en: "The bird thinks I sleep all the time.",
        },
        {
          expr: "content",
          fr: "En vérité, je vis en décalé. Chacun son horaire.",
          en: "Truth is, I keep different hours. To each their own.",
        },
      ],
    },
    {
      id: "ren-6",
      chapter: 5,
      kind: "souvenir",
      steps: [
        {
          expr: "content",
          fr: "Tu es un visiteur du soir fidèle. Ça mérite un titre : « mon ami de la nuit ».",
          en: 'You\'re a loyal evening visitor. That deserves a title: "my friend of the night".',
        },
      ],
    },
    {
      id: "ren-c1",
      chapter: 3,
      kind: "humeur",
      sourceId: "renard-futura",
      condition: { season: "hiver" },
      steps: [
        {
          expr: "surpris",
          fr: "La neige ! Mon terrain de jeu préféré.",
          en: "Snow! My favourite playground.",
        },
        {
          expr: "content",
          fr: "Tout ce qui bouge dessous, je l'entends.",
          en: "Anything moving underneath, I can hear it.",
        },
      ],
    },
  ],
  sleep: [
    [
      {
        expr: "dort",
        fr: "Zzz… (Le renard dort. Il a laissé un mot : « Repasser après 21 h. »)",
        en: 'Zzz… (The fox is asleep. He\'s left a note: "Come back after 9 pm.")',
      },
    ],
    [
      {
        expr: "dort",
        fr: "Zzz… (Il est roulé en boule, la queue posée sur le museau comme une couverture.)",
        en: "Zzz… (He's curled up in a ball, his tail over his nose like a blanket.)",
      },
    ],
    [
      {
        expr: "dort",
        fr: "Zzz… (Il sourit en dormant. Sûrement un rêve de mulots.)",
        en: "Zzz… (He's smiling in his sleep. Dreaming of voles, no doubt.)",
      },
    ],
  ],
  sleepSourceId: "renard-queue",
  again: [
    [
      {
        expr: "content",
        fr: "Je t'ai déjà accordé une conversation ce soir. Un renard doit garder un peu de mystère.",
        en: "I've already granted you one conversation tonight. A fox must keep a little mystery.",
      },
    ],
    [
      {
        expr: "content",
        fr: "Demain soir, même heure ? Je ne promets rien… mais je serai là.",
        en: "Tomorrow night, same time? I promise nothing… but I'll be there.",
      },
    ],
  ],
};
