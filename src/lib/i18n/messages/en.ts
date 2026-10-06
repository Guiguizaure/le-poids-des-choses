// Interface text in British English. Same keys as fr.ts (checked by the `Messages` type).
// Terms follow docs/glossaire-en.md.
import type { Messages } from "./fr";

export const en: Messages = {
  site: {
    description:
      "Compare two everyday actions on the scales and watch your garden grow with every lighter choice.",
    ogAlt: "Le poids des choses: a pair of scales and a garden",
  },
  nav: {
    label: "Main navigation",
    compare: "Compare",
    garden: "My garden",
    method: "Method",
    signIn: "Sign in",
  },
  footer: {
    label: "Footer",
    method: "Method",
    legal: "Legal notice",
    privacy: "Privacy",
    byline: "A project by Guillaume ·",
    install: "Install the app",
  },
  language: {
    switchTo: "Français",
    switchLabel: "Lire cette page en français",
  },
  home: {
    eyebrow: "ILLUSTRATED CARBON COMPARISON",
    intro:
      "Before a journey, a meal or a purchase, put two options on the scales. Your garden grows every time you choose the lighter one.",
    start: "Start",
    howItWorks: "How does it work?",
    findGardenQuestion: "Already have a garden?",
    findGardenAction: "Find it",
    sources: "Public data from ADEME · Independent project",
  },
  season: {
    title: "In season",
    titleInMonth: "In season in {month}",
    lightestToHeaviest: "Lightest to heaviest, per kilo:",
    perKilo: "Per kilo:",
    seeAll: "All the fruit and veg in season",
  },
  credit: {
    data: "Data:",
    downloadedOn: "downloaded on {date}",
    base: "{name} data (updated {updatedOn}), retrieved on {date}",
    independent: "independent project",
  },
};
