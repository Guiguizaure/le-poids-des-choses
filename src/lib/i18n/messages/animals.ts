// « Les animaux parlent » : textes de l'interface (boîte de dialogue, « Les habitants du
// jardin »). Les noms et les répliques de chaque animal : src/content/animaux.
import { defineMessages } from "../index";

export const ANIMAL_TALK = defineMessages(
  {
    close: "Fermer la conversation",
    asleep: (talk: string) => `${talk}, qui dort`,
    asleepNote: "En plein sommeil.",
    next: "Suite",
    finish: "Fermer",
    listTitle: "Les habitants du jardin",
    listIntro:
      "Touche un animal dans le jardin pour lui parler, ou choisis-le ici. Chaque jour, il a quelque chose de nouveau à te dire.",
    talkButton: "Parler",
    progress: (seen: number, total: number) =>
      `${seen} ${seen > 1 ? "répliques" : "réplique"} sur ${total}`,
    unmet: "Pas encore rencontré",
    unmetLabel: "Habitant pas encore rencontré",
    awaySeason: "Pas là en cette saison",
    awayNight: "Pas là cette nuit",
    awayNow: "Pas dans le jardin en ce moment",
  },
  {
    close: "Close the conversation",
    asleep: (talk: string) => `${talk} (asleep)`,
    asleepNote: "Fast asleep.",
    next: "Next",
    finish: "Close",
    listTitle: "Who lives in the garden",
    listIntro:
      "Tap an animal in the garden to talk to it, or choose it here. Each day, it has something new to tell you.",
    talkButton: "Talk",
    progress: (seen: number, total: number) =>
      `${seen} of ${total} ${total > 1 ? "lines" : "line"}`,
    unmet: "Not met yet",
    unmetLabel: "Resident not met yet",
    awaySeason: "Away this season",
    awayNight: "Away tonight",
    awayNow: "Not in the garden right now",
  },
);
