// Parcours de comparaison : choix des gestes (02), duel (03), duel objet (03b), résultats
// (05a v2, 05b v2, habitude), et phrases de résultat.
import { defineMessages } from "../index";

export const COMPARE = defineMessages(
  {
    back: "Retour",
    close: "Fermer et revenir à l’accueil",
    invalidLink:
      "Ce lien de comparaison n’est pas valable : choisis tes deux gestes.",
    chooser: {
      step: "Option {n} sur 2",
      title: "Que veux-tu comparer ?",
      categories: "Catégories",
      sameTypeAs: "{category} · même type que {noun}",
      examples: "{category} · exemples de gestes",
      badge: ", geste {n}",
      bothChosen: "{a} et {b} choisis : tu peux comparer.",
      firstChosen:
        "{a} choisi en premier. Choisis un second geste du même type ; les autres sont grisés.",
      removed: "{label} retiré.",
      compare: "Comparer",
      versus: "{a} vs {b}",
      barLabel: "Ta comparaison",
      hintNone: "Touche un premier geste, puis un second du même type.",
      hintOne: "Ensuite, choisis la seconde option.",
      hintTwo: "Retouche un geste pour le retirer.",
      declaredHabit: "C’est une de tes habitudes : la noter sans comparer",
      logHabit: "Noter une habitude",
      logHabitHelp:
        "Un repas végé, le vélo pour aller au travail : sans comparaison ni kg, ça arrose ton jardin.",
      searchLabel: "Chercher un geste",
      searchPlaceholder: "Cherche : covoiturage, lave-linge…",
      searchClear: "Effacer la recherche",
      found: (n: number) =>
        n === 0
          ? "Aucun geste trouvé"
          : `${n} ${n > 1 ? "gestes trouvés" : "geste trouvé"}`,
      searchRule:
        "Un trajet se compare à un autre trajet, un objet à lui-même (neuf, d’occasion ou garder le tien). Jamais un vélo contre un steak.",
      searchEmpty:
        "Rien trouvé ? Le catalogue suit les données de l’ADEME : si un geste n’y est pas, on ne l’invente pas.",
      newCategory: "Nouveau",
      units: {
        km: "au km",
        repas: "par repas",
        litre: "par litre",
        achat: "par achat",
        objet: "par objet",
      },
    },
    duel: {
      lighterFeminine: "plus légère",
      lighter: "plus léger",
      scale: "Balance : {a} à gauche, {b} à droite",
      title: "Lequel pèse le moins ?",
      distance: "Distance",
      kilometres: (n: number) => `${n} ${n > 1 ? "kilomètres" : "kilomètre"}`,
      choose: "Je choisis {noun}",
    },
    object: {
      back: "Retour au choix des gestes",
      title: "Neuf, d’occasion, ou tu gardes {yours} ?",
      how: "Comment l’obtenir",
      newTitle: "Neuf",
      newDetail: "Fabrication {newOne}",
      usedTitle: "D’occasion",
      usedDetail: "Pas de nouvelle fabrication",
      keepTitle: "Je garde {mine}",
      keepDetail: "Rien de neuf à fabriquer",
      delivered: "Livré en colis (+ {mass})",
      // Les deux côtés de la phrase de résultat.
      sentenceNew: "Neuf",
      sentenceNewOther: "neuf",
      sentenceUsed: "D’occasion",
      sentenceUsedDelivered: "D’occasion livré",
      sentenceUsedOther: "d’occasion",
      sentenceUsedDeliveredOther: "d’occasion livré",
      sentenceKeep: "Garder {yours}",
      chooseNew: "Je choisis neuf",
      chooseUsed: "Je choisis d’occasion",
      chooseKeep: "Je garde {mine}",
      howWeCount: "Comment on compte l’occasion ?",
      manufacturingNote:
        "Écart de fabrication : l’électricité, tu la consommes que l’appareil soit neuf ou gardé.",
    },
    result: {
      full: "Ton jardin est au complet",
      noted: "C’est noté",
      difference: "{mass} d’écart",
      differenceManufacturing: "{mass} d’écart de fabrication",
      notedPill: "Noté",
      lightText: "{title} : c’est noté dans ton carnet.",
      heavyText:
        "{title} : rien n’est retiré à ton jardin. On n’a pas toujours le choix.",
      plant: "Aller la planter",
      seeGarden: "Voir mon jardin",
      again: "Comparer autre chose",
    },
    habitResult: {
      pill: "Habitude tenue",
      noted: "C’est noté",
      text: "{label} : c’est noté dans ton carnet, sans aucun kg.",
      seeGarden: "Voir mon jardin",
      again: "Comparer deux gestes",
      why: "Pourquoi une habitude ne compte aucun kg",
    },
  },
  {
    back: "Back",
    close: "Close and go back to the home page",
    invalidLink: "This comparison link doesn’t work: choose your two actions.",
    chooser: {
      step: "Option {n} of 2",
      title: "What would you like to compare?",
      categories: "Categories",
      sameTypeAs: "{category} · same type as {noun}",
      examples: "{category} · example actions",
      badge: ", action {n}",
      bothChosen: "{a} and {b} selected: you can compare.",
      firstChosen:
        "{a} selected first. Choose a second action of the same type; the others are greyed out.",
      removed: "{label} removed.",
      compare: "Compare",
      versus: "{a} vs {b}",
      barLabel: "Your comparison",
      hintNone: "Tap a first action, then a second one of the same type.",
      hintOne: "Next, choose the second option.",
      hintTwo: "Tap an action again to remove it.",
      declaredHabit: "This is one of your habits: log it without comparing",
      logHabit: "Log a habit",
      logHabitHelp:
        "A veggie meal, cycling to work: no comparison and no kg, it just waters your garden.",
      searchLabel: "Search for an action",
      searchPlaceholder: "Search: car-sharing, washing machine…",
      searchClear: "Clear the search",
      found: (n: number) =>
        n === 0
          ? "No actions found"
          : `${n} ${n > 1 ? "actions found" : "action found"}`,
      searchRule:
        "A journey is compared with another journey, an item with itself (new, second-hand or keeping yours). Never a bike against a steak.",
      searchEmpty:
        "Nothing found? The catalogue follows ADEME’s data: if an action isn’t in it, we don’t make it up.",
      newCategory: "New",
      units: {
        km: "per km",
        repas: "per meal",
        litre: "per litre",
        achat: "per purchase",
        objet: "per item",
      },
    },
    duel: {
      lighterFeminine: "lighter",
      lighter: "lighter",
      scale: "Scales: {a} on the left, {b} on the right",
      title: "Which one weighs less?",
      distance: "Distance",
      kilometres: (n: number) => `${n} ${n > 1 ? "kilometres" : "kilometre"}`,
      choose: "I’ll go for {noun}",
    },
    object: {
      back: "Back to the actions",
      title: "New, second-hand, or keep {yours}?",
      how: "How to get it",
      newTitle: "New",
      newDetail: "Making {newOne}",
      usedTitle: "Second-hand",
      usedDetail: "No new manufacturing",
      keepTitle: "I’ll keep {mine}",
      keepDetail: "Nothing new to make",
      delivered: "Delivered by post (+ {mass})",
      sentenceNew: "New",
      sentenceNewOther: "new",
      sentenceUsed: "Second-hand",
      sentenceUsedDelivered: "Second-hand, delivered",
      sentenceUsedOther: "second-hand",
      sentenceUsedDeliveredOther: "second-hand, delivered",
      sentenceKeep: "Keeping {yours}",
      chooseNew: "I’ll go for new",
      chooseUsed: "I’ll go for second-hand",
      chooseKeep: "I’ll keep {mine}",
      howWeCount: "How do we count second-hand?",
      manufacturingNote:
        "Manufacturing difference: you use the electricity whether the appliance is new or kept.",
    },
    result: {
      full: "Your garden is full",
      noted: "Noted",
      difference: "{mass} difference",
      differenceManufacturing: "{mass} manufacturing difference",
      notedPill: "Noted",
      lightText: "{title}: noted in your journal.",
      heavyText:
        "{title}: nothing is taken away from your garden. We don’t always have a choice.",
      plant: "Go and plant it",
      seeGarden: "See my garden",
      again: "Compare something else",
    },
    habitResult: {
      pill: "Habit kept",
      noted: "Noted",
      text: "{label}: noted in your journal, with no kg.",
      seeGarden: "See my garden",
      again: "Compare two actions",
      why: "Why a habit counts no kg",
    },
  },
);

/** Phrases de résultat (sentence.ts) : contexte, rapport, écart. */
export const SENTENCES = defineMessages(
  {
    context: {
      km: "Sur ce trajet, ",
      repas: "",
      litre: "Pour un litre, ",
      achat: "Pour un même achat, ",
      objet: "",
    },
    decimal: ",",
    times: (ratio: string) => `${ratio} fois`,
    moreThanTimes: (cap: number) => `plus de ${cap} fois`,
    lighterBy: (times: string, feminine: boolean) =>
      `${times} plus ${feminine ? "légère" : "léger"}`,
    less: (mass: string) => `soit ${mass} de CO2e en moins`,
    almostEqual: (both: string) => `${both} pèsent presque autant.`,
    and: (a: string, b: string) => `${a} et ${b}`,
    zero: (lighter: string, mass: string, heavier: string) =>
      `${lighter}, c’est zéro émission, contre ${mass} de CO2e pour ${heavier}.`,
    lighterThan: (lighter: string, by: string, than: string, less: string) =>
      `${lighter} est ${by} ${than}, ${less}.`,
    rather: (chosen: string, other: string) => `${chosen} plutôt que ${other}`,
    objectAlmost: (head: string) => `${head} : presque autant.`,
    objectMore: (head: string, mass: string) =>
      `${head} : ${mass} de CO2e de plus.`,
    objectHeavier: (head: string, times: string, mass: string) =>
      `${head} : ${times} plus lourd, soit ${mass} de CO2e de plus.`,
    objectNothingNew: (head: string, mass: string) =>
      `${head} : aucune nouvelle fabrication, soit ${mass} de CO2e en moins.`,
    objectLighter: (head: string, by: string, mass: string) =>
      `${head} : ${by}, soit ${mass} de CO2e en moins.`,
    equivalenceUnderOne:
      "L’écart équivaut à moins d’1 km en voiture thermique.",
    equivalence: (km: string) =>
      `L’écart équivaut à ${km} km en voiture thermique.`,
  },
  {
    context: {
      km: "On this journey, ",
      repas: "",
      litre: "For one litre, ",
      achat: "For the same purchase, ",
      objet: "",
    },
    decimal: ".",
    times: (ratio: string) => `${ratio} times`,
    moreThanTimes: (cap: number) => `over ${cap} times`,
    lighterBy: (times: string) => `${times} lighter`,
    less: (mass: string) => `which is ${mass} CO2e less`,
    almostEqual: (both: string) => `${both} weigh almost the same.`,
    and: (a: string, b: string) => `${a} and ${b}`,
    zero: (lighter: string, mass: string, heavier: string) =>
      `${lighter} means zero emissions, compared with ${mass} CO2e for ${heavier}.`,
    lighterThan: (lighter: string, by: string, than: string, less: string) =>
      `${lighter} is ${by} ${than}, ${less}.`,
    rather: (chosen: string, other: string) => `${chosen} rather than ${other}`,
    objectAlmost: (head: string) => `${head}: almost the same.`,
    objectMore: (head: string, mass: string) => `${head}: ${mass} CO2e more.`,
    objectHeavier: (head: string, times: string, mass: string) =>
      `${head}: ${times} heavier, which is ${mass} CO2e more.`,
    objectNothingNew: (head: string, mass: string) =>
      `${head}: nothing new to make, which is ${mass} CO2e less.`,
    objectLighter: (head: string, by: string, mass: string) =>
      `${head}: ${by}, which is ${mass} CO2e less.`,
    equivalenceUnderOne:
      "The difference equals less than 1 km in a petrol or diesel car.",
    equivalence: (km: string) =>
      `The difference equals ${km} km in a petrol or diesel car.`,
  },
);

/** Duels prêts à jouer (Comparer, accueil) ; titres des duels : src/lib/duels/ready.ts. */
export const DUELS_UI = defineMessages(
  {
    ready: "Duels prêts à jouer",
    daily: "Duel du jour",
    forStarters: "Des duels pour commencer",
    seeAll: "Voir tous les duels",
    intro: "Prends un duel tout prêt, ou compose le tien.",
    compose: "Ou compose ton duel",
  },
  {
    ready: "Ready-made duels",
    daily: "Today’s duel",
    forStarters: "Duels to get you started",
    seeAll: "See all duels",
    intro: "Pick a ready-made duel, or put your own together.",
    compose: "Or put your own duel together",
  },
);
