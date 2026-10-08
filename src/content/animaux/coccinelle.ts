// Répliques PROVISOIRES de la coccinelle : à remplacer par les vraies (même format). Une réplique est
// une séquence de 1 à 3 étapes (expression du portrait : content, surpris, dort) ; une
// réplique « fait » cite une source de docs/animaux-sources.md (`sourceId`).
import type { AnimalScript } from "./types";

export const COCCINELLE: AnimalScript = {
  name: { fr: "Coccinelle", en: "Ladybird" },
  talk: { fr: "Parler à la coccinelle", en: "Talk to the ladybird" },
  lines: [
    {
      id: "coccinelle-1",
      chapter: 1,
      kind: "recit",
      steps: [
        {
          expr: "content",
          fr: "[Réplique provisoire 1 · chapitre 1]",
          en: "[Placeholder line 1 · chapter 1]",
        },
      ],
    },
    {
      id: "coccinelle-2",
      chapter: 2,
      kind: "recit",
      steps: [
        {
          expr: "content",
          fr: "[Réplique provisoire 2 · chapitre 2 · étape 1/2]",
          en: "[Placeholder line 2 · chapter 2 · step 1/2]",
        },
        {
          expr: "surpris",
          fr: "[Réplique provisoire 2 · chapitre 2 · étape 2/2]",
          en: "[Placeholder line 2 · chapter 2 · step 2/2]",
        },
      ],
    },
    {
      id: "coccinelle-3",
      chapter: 2,
      kind: "recit",
      condition: { planted: "fleur-1" },
      steps: [
        {
          expr: "content",
          fr: "[Réplique provisoire 3 · chapitre 2 · si une églantine est plantée · étape 1/3]",
          en: "[Placeholder line 3 · chapter 2 · if a dog rose is planted · step 1/3]",
        },
        {
          expr: "surpris",
          fr: "[Réplique provisoire 3 · chapitre 2 · étape 2/3]",
          en: "[Placeholder line 3 · chapter 2 · step 2/3]",
        },
        {
          expr: "content",
          fr: "[Réplique provisoire 3 · chapitre 2 · étape 3/3]",
          en: "[Placeholder line 3 · chapter 2 · step 3/3]",
        },
      ],
    },
    {
      id: "coccinelle-4",
      chapter: 3,
      kind: "recit",
      steps: [
        {
          expr: "content",
          fr: "[Réplique provisoire 4 · chapitre 3]",
          en: "[Placeholder line 4 · chapter 3]",
        },
      ],
    },
    {
      id: "coccinelle-5",
      chapter: 3,
      kind: "recit",
      steps: [
        {
          expr: "content",
          fr: "[Réplique provisoire 5 · chapitre 3 · étape 1/2]",
          en: "[Placeholder line 5 · chapter 3 · step 1/2]",
        },
        {
          expr: "surpris",
          fr: "[Réplique provisoire 5 · chapitre 3 · étape 2/2]",
          en: "[Placeholder line 5 · chapter 3 · step 2/2]",
        },
      ],
    },
    {
      id: "coccinelle-6",
      chapter: 4,
      kind: "recit",
      steps: [
        {
          expr: "content",
          fr: "[Réplique provisoire 6 · chapitre 4 · étape 1/3]",
          en: "[Placeholder line 6 · chapter 4 · step 1/3]",
        },
        {
          expr: "surpris",
          fr: "[Réplique provisoire 6 · chapitre 4 · étape 2/3]",
          en: "[Placeholder line 6 · chapter 4 · step 2/3]",
        },
        {
          expr: "content",
          fr: "[Réplique provisoire 6 · chapitre 4 · étape 3/3]",
          en: "[Placeholder line 6 · chapter 4 · step 3/3]",
        },
      ],
    },
    {
      id: "coccinelle-7",
      chapter: 4,
      kind: "recit",
      steps: [
        {
          expr: "content",
          fr: "[Réplique provisoire 7 · chapitre 4]",
          en: "[Placeholder line 7 · chapter 4]",
        },
      ],
    },
    {
      id: "coccinelle-8",
      chapter: 5,
      kind: "recit",
      steps: [
        {
          expr: "content",
          fr: "[Réplique provisoire 8 · chapitre 5 · étape 1/2]",
          en: "[Placeholder line 8 · chapter 5 · step 1/2]",
        },
        {
          expr: "surpris",
          fr: "[Réplique provisoire 8 · chapitre 5 · étape 2/2]",
          en: "[Placeholder line 8 · chapter 5 · step 2/2]",
        },
      ],
    },
  ],
  sleep: [
    [
      {
        expr: "dort",
        fr: "[Sommeil provisoire 1]",
        en: "[Placeholder sleep line 1]",
      },
    ],
    [
      {
        expr: "dort",
        fr: "[Sommeil provisoire 2 · étape 1/2]",
        en: "[Placeholder sleep line 2 · step 1/2]",
      },
      {
        expr: "dort",
        fr: "[Sommeil provisoire 2 · étape 2/2]",
        en: "[Placeholder sleep line 2 · step 2/2]",
      },
    ],
  ],
  again: [
    [
      {
        expr: "content",
        fr: "[Déjà parlé aujourd’hui, provisoire 1]",
        en: "[Already talked today, placeholder 1]",
      },
    ],
    [
      {
        expr: "surpris",
        fr: "[Déjà parlé aujourd’hui, provisoire 2]",
        en: "[Already talked today, placeholder 2]",
      },
    ],
    [
      {
        expr: "content",
        fr: "[Déjà parlé aujourd’hui, provisoire 3]",
        en: "[Already talked today, placeholder 3]",
      },
    ],
  ],
};
