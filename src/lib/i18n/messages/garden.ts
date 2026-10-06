// Jardin : textes calculés (arrivées, arrosage, description), écran /jardin, carnet, ciel,
// paliers, partage, installation, habitudes. Jamais « évité », « économisé », « saved »…
import { defineMessages } from "../index";
import type { AnimalName } from "./names";

/** « 2 choix légers » : pluriel français (0 et 1 au singulier). */
const pluralFr = (count: number, singular: string, plural: string) =>
  `${count} ${count > 1 ? plural : singular}`;
/** « 2 lighter choices » : pluriel anglais (1 seul au singulier). */
const pluralEn = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

/** Fonctions de texte du jardin (src/lib/garden/text.ts). */
export const GARDEN_TEXT = defineMessages(
  {
    plural: pluralFr,
    nextAnimal: (remaining: number, animal: AnimalName) =>
      `Encore ${pluralFr(remaining, "choix léger", "choix légers")} avant l’arrivée ${animal.of}`,
    arrivalExclamation: (animal: AnimalName) =>
      `Et ${animal.indefinite} arrive !`,
    revealGrow: (tree: boolean) =>
      tree
        ? "Un arbre va grandir dans ton jardin"
        : "Une fleur va grandir dans ton jardin",
    revealSprout: "Une petite pousse va sortir de terre",
    revealNew: (tree: boolean) =>
      tree
        ? "Un arbre va pousser dans ton jardin"
        : "Une fleur va pousser dans ton jardin",
    arrival: (animal: AnimalName, away: "saison" | "nuit" | null) => {
      const text = `${animal.feminine ? "Une" : "Un"} ${animal.name} s’est installé${animal.feminine ? "e" : ""} dans ton jardin`;
      const pronoun = animal.feminine ? "la" : "le";
      if (away === "saison")
        return `${text} : tu ${pronoun} verras au printemps`;
      if (away === "nuit") return `${text} : tu ${pronoun} verras demain matin`;
      return text;
    },
    description: {
      empty: "Jardin vide",
      garden: (parts: string) => `Jardin : ${parts}`,
      plants: (n: number) => pluralFr(n, "plante", "plantes"),
      bloomed: (n: number) => ` dont ${pluralFr(n, "épanouie", "épanouies")}`,
      animals: (n: number) => pluralFr(n, "animal", "animaux"),
      visitors: (n: number) => pluralFr(n, "visiteur", "visiteurs"),
      night: "la nuit",
      asleep: "assoupi sous la brume",
    },
    watering: {
      noPlant:
        "Ton jardin est arrosé. Il attend sa première pousse : compare deux gestes pour la planter.",
      already: "Ton jardin est déjà arrosé aujourd’hui : c’est noté.",
      moved: (n: number) =>
        `Ton jardin est arrosé : ${pluralFr(n, "plante avance", "plantes avancent")} d’un cran.`,
      allBloomed: "Ton jardin est arrosé : toutes tes plantes sont épanouies.",
      next: (n: number) =>
        `Ton jardin est arrosé. Encore ${pluralFr(n, "jour arrosé", "jours arrosés")} avant le prochain cran.`,
      titleWatered: "Ton jardin est arrosé",
      titleNoted: "C’est noté",
      bloom: (tree: boolean) =>
        tree ? "Un arbre s’épanouit" : "Une fleur s’épanouit",
      grow: (tree: boolean) =>
        tree ? "Un arbre grandit" : "Une fleur grandit",
    },
  },
  {
    plural: pluralEn,
    nextAnimal: (remaining: number, animal: AnimalName) =>
      `${pluralEn(remaining, "more lighter choice", "more lighter choices")} until ${animal.of} arrives`,
    arrivalExclamation: (animal: AnimalName) =>
      `And here comes ${animal.indefinite}!`,
    revealGrow: (tree: boolean) =>
      tree
        ? "A tree in your garden is going to grow"
        : "A flower in your garden is going to grow",
    revealSprout: "A little sprout is about to come up",
    revealNew: (tree: boolean) =>
      tree
        ? "A tree is going to grow in your garden"
        : "A flower is going to grow in your garden",
    arrival: (animal: AnimalName, away: "saison" | "nuit" | null) => {
      const text = `${animal.indefinite.charAt(0).toUpperCase()}${animal.indefinite.slice(1)} has moved into your garden`;
      if (away === "saison") return `${text}: you’ll see it in spring`;
      if (away === "nuit") return `${text}: you’ll see it tomorrow morning`;
      return text;
    },
    description: {
      empty: "Empty garden",
      garden: (parts: string) => `Garden: ${parts}`,
      plants: (n: number) => pluralEn(n, "plant", "plants"),
      bloomed: (n: number) => `, ${n} in bloom`,
      animals: (n: number) => pluralEn(n, "animal", "animals"),
      visitors: (n: number) => pluralEn(n, "visitor", "visitors"),
      night: "at night",
      asleep: "dozing under the mist",
    },
    watering: {
      noPlant:
        "Your garden’s been watered. It’s waiting for its first sprout: compare two actions to plant it.",
      already: "Your garden’s already been watered today: noted.",
      moved: (n: number) =>
        `Your garden’s been watered: ${pluralEn(n, "plant moves", "plants move")} up a step.`,
      allBloomed:
        "Your garden’s been watered: all your plants are in full bloom.",
      next: (n: number) =>
        `Your garden’s been watered. ${pluralEn(n, "more watered day", "more watered days")} until the next step.`,
      titleWatered: "Your garden’s been watered",
      titleNoted: "Noted",
      bloom: (tree: boolean) =>
        tree ? "A tree is flourishing" : "A flower is blooming",
      grow: (tree: boolean) =>
        tree ? "A tree is growing" : "A flower is growing",
    },
  },
);

/** Écran « Mon jardin ». */
export const GARDEN_SCREEN = defineMessages(
  {
    back: "Comparer",
    export: "Exporter",
    share: "Partager",
    title: "Mon jardin",
    found: (n: number) =>
      `Ton jardin est de retour : ${pluralFr(n, "choix retrouvé", "choix retrouvés")}.`,
    importInvalid: "Ce fichier n’est pas un carnet lisible.",
    importNothing: "Rien de nouveau dans ce fichier : ton carnet est à jour.",
    importAdded: (n: number) =>
      `${pluralFr(n, "choix ajouté", "choix ajoutés")} à ton carnet.`,
    importSkipped: (n: number) =>
      ` ${pluralFr(n, "entrée illisible ignorée", "entrées illisibles ignorées")}.`,
    noStorage:
      "Ton navigateur n’autorise pas l’enregistrement : ton jardin vivra le temps de cette visite. Exporte ton carnet pour le garder.",
    emptyTitle: "Ton jardin t’attend",
    emptyText:
      "Chaque fois que tu choisis le geste le plus léger, une plante pousse ici. Un choix plus lourd est simplement noté : rien n’est retiré au jardin.",
    compareTwo: "Comparer deux gestes",
    summary: "Bilan",
    differenceSince:
      "de CO2e d’écart avec les autres options, depuis ton premier choix",
    choices: (n: number) => pluralFr(n, "choix noté", "choix notés"),
    wateredDays: (n: number) => pluralFr(n, "jour arrosé", "jours arrosés"),
    plants: (n: number) => pluralFr(n, "plante", "plantes"),
    animals: (n: number) => pluralFr(n, "animal", "animaux"),
    journal: "Carnet",
    seeAll: "Tout voir",
    heavyNote:
      "Un choix plus lourd est simplement noté : rien n’est retiré au jardin.",
    backup: "Sauvegarde du carnet",
    backupText:
      "Ton carnet reste sur cet appareil. Exporte-le pour le garder ou le retrouver ailleurs.",
    import: "Importer",
    setAside: (n: number) =>
      ` ${pluralFr(n, "entrée illisible a été mise", "entrées illisibles ont été mises")} de côté.`,
    flyBird: "Faire s’envoler l’oiseau",
  },
  {
    back: "Compare",
    export: "Export",
    share: "Share",
    title: "My garden",
    found: (n: number) =>
      `Your garden is back: ${pluralEn(n, "choice", "choices")} found.`,
    importInvalid: "This file isn’t a readable journal.",
    importNothing: "Nothing new in this file: your journal is up to date.",
    importAdded: (n: number) =>
      `${pluralEn(n, "choice", "choices")} added to your journal.`,
    importSkipped: (n: number) =>
      ` ${pluralEn(n, "unreadable entry", "unreadable entries")} ignored.`,
    noStorage:
      "Your browser doesn’t allow storage here: your garden will only last for this visit. Export your journal to keep it.",
    emptyTitle: "Your garden is waiting for you",
    emptyText:
      "Every time you choose the lighter action, a plant grows here. A heavier choice is simply noted: nothing is taken away from the garden.",
    compareTwo: "Compare two actions",
    summary: "Summary",
    differenceSince:
      "of CO2e difference from the other options, since your first choice",
    choices: (n: number) => pluralEn(n, "choice noted", "choices noted"),
    wateredDays: (n: number) => pluralEn(n, "watered day", "watered days"),
    plants: (n: number) => pluralEn(n, "plant", "plants"),
    animals: (n: number) => pluralEn(n, "animal", "animals"),
    journal: "Journal",
    seeAll: "See all",
    heavyNote:
      "A heavier choice is simply noted: nothing is taken away from the garden.",
    backup: "Journal backup",
    backupText:
      "Your journal stays on this device. Export it to keep it safe or to find it somewhere else.",
    import: "Import",
    setAside: (n: number) =>
      n === 1
        ? " 1 unreadable entry has been set aside."
        : ` ${n} unreadable entries have been set aside.`,
    flyBird: "Make the bird fly",
  },
);

/** Carnet : page « Tout voir », lignes, graphique de la semaine. */
export const JOURNAL = defineMessages(
  {
    back: "Mon jardin",
    title: "Carnet",
    empty: "Ton carnet est vide.",
    emptyLink: "Compare deux gestes",
    emptyEnd: "pour noter ton premier choix.",
    all: "Tous les choix",
    sortBy: "Trier par",
    category: "Catégorie",
    allCategories: "Toutes",
    choices: "Choix",
    sorts: { date: "Date", ecart: "Écart", categorie: "Catégorie" },
    filters: {
      tous: "Tous les choix",
      legers: "Choix légers",
      notes: "Choix notés (plus lourds)",
      habitudes: "Habitudes tenues",
    },
    noMatch: "Aucun choix ne correspond à ces filtres.",
    shown: (n: number) => pluralFr(n, "choix affiché", "choix affichés"),
    heavyNote:
      "Un choix plus lourd est simplement noté : rien n’est retiré au jardin.",
    habit: "habitude",
    watered: "arrosé",
    noted: "noté",
    today: "Aujourd’hui",
    yesterday: "Hier",
    week: {
      title: "Choix légers, 7 derniers jours",
      none: "Aucun choix léger ces 7 derniers jours. Le prochain fera pousser une plante.",
      todayShort: "auj.",
      total: (n: number) => `${n} choix léger${n > 1 ? "s" : ""} cette semaine`,
      watered: (n: number) =>
        `${n} jour${n > 1 ? "s" : ""} arrosé${n > 1 ? "s" : ""} cette semaine`,
      caption: "Choix légers par jour, sur les 7 derniers jours",
      day: "Jour",
      lightChoices: "Choix légers",
      todayFull: (date: string) => `Aujourd’hui, ${date}`,
    },
    rather: (chosen: string, other: string) =>
      /^[aàâeéèêëiîïoôuùûüyhœæ]/i.test(other)
        ? `${chosen} plutôt qu’${other}`
        : `${chosen} plutôt que ${other}`,
  },
  {
    back: "My garden",
    title: "Journal",
    empty: "Your journal is empty.",
    emptyLink: "Compare two actions",
    emptyEnd: "to note your first choice.",
    all: "All choices",
    sortBy: "Sort by",
    category: "Category",
    allCategories: "All",
    choices: "Choices",
    sorts: { date: "Date", ecart: "Difference", categorie: "Category" },
    filters: {
      tous: "All choices",
      legers: "Lighter choices",
      notes: "Noted choices (heavier)",
      habitudes: "Habits kept",
    },
    noMatch: "No choice matches these filters.",
    shown: (n: number) => pluralEn(n, "choice shown", "choices shown"),
    heavyNote:
      "A heavier choice is simply noted: nothing is taken away from the garden.",
    habit: "habit",
    watered: "watered",
    noted: "noted",
    today: "Today",
    yesterday: "Yesterday",
    week: {
      title: "Lighter choices, last 7 days",
      none: "No lighter choices in the last 7 days. The next one will grow a plant.",
      todayShort: "today",
      total: (n: number) =>
        `${pluralEn(n, "lighter choice", "lighter choices")} this week`,
      watered: (n: number) =>
        `${pluralEn(n, "watered day", "watered days")} this week`,
      caption: "Lighter choices per day, over the last 7 days",
      day: "Day",
      lightChoices: "Lighter choices",
      todayFull: (date: string) => `Today, ${date}`,
    },
    rather: (chosen: string, other: string) => `${chosen} rather than ${other}`,
  },
);

/** Ciel du jardin. */
export const SKY_PICKER = defineMessages(
  {
    title: "Ciel du jardin",
    missing: (n: number) =>
      `Encore ${pluralFr(n, "choix léger", "choix légers")}`,
    night: (start: number, end: number) =>
      `De ${start} h à ${end} h, ton jardin passe en Nuit encre ; ton ciel revient au matin.`,
  },
  {
    title: "Garden sky",
    missing: (n: number) =>
      `${pluralEn(n, "more lighter choice", "more lighter choices")}`,
    night: (start: number, end: number) =>
      `From ${start % 12 || 12} pm to ${end % 12 || 12} am, your garden switches to Ink night; your sky comes back in the morning.`,
  },
);

/** « Le savais-tu ? » et carte « Palier franchi » : cadre commun. */
export const FACT_CARD = defineMessages(
  {
    didYouKnow: "Le savais-tu ?",
    milestone: "Palier franchi",
    source: "Source : {label} sur Impact CO2",
    newTab: " (nouvel onglet)",
    method: "Méthode",
    milestoneTitle: (kg: string) =>
      `${kg}\u00a0kg de CO2e d’écart avec les autres options`,
    milestoneText: (value: string, unit: string) =>
      `C’est autant que ${value}\u00a0${unit}.`,
  },
  {
    didYouKnow: "Did you know?",
    milestone: "Milestone reached",
    source: "Source: {label} on Impact CO2",
    newTab: " (opens in a new tab)",
    method: "Method",
    milestoneTitle: (kg: string) =>
      `${kg}\u00a0kg CO2e difference from the other options`,
    milestoneText: (value: string, unit: string) =>
      `That’s as much as ${value}\u00a0${unit}.`,
  },
);

/** Pastille de la barre du haut. */
export const GARDEN_PILL = defineMessages(
  { garden: "Mon jardin", withDifference: "Mon jardin · {mass} d’écart" },
  { garden: "My garden", withDifference: "My garden · {mass} difference" },
);

/** Partage du jardin : feuille et image. */
export const SHARE = defineMessages(
  {
    fileName: "mon-jardin.png",
    text: "Mon jardin, dans Le poids des choses.",
    title: "Partager mon jardin",
    description: (light: number, animals: number) =>
      `ton jardin, ${pluralFr(light, "choix léger", "choix légers")}, ${pluralFr(animals, "animal", "animaux")}`,
    alt: "Aperçu de l’image à partager : {description}.",
    preparing: "Préparation de l’image…",
    privacy:
      "L’image montre ton jardin et le nombre de tes choix légers. Ni ton carnet, ni de kilos de CO2e.",
    shareImage: "Partager l’image",
    cancel: "Annuler",
    prepareFailed:
      "L’image n’a pas pu être préparée. Réessaie dans un instant.",
    shareFailed: "Le partage n’a pas abouti. Tu peux réessayer.",
    card: {
      kicker: "LE POIDS DES CHOSES",
      title: "Mon jardin",
      titleAsleep: "Mon jardin se repose",
      wake: "Il se réveille au prochain choix léger.",
      lightChoices: (n: number) => pluralFr(n, "choix léger", "choix légers"),
      animals: (n: number) => pluralFr(n, "animal", "animaux"),
      tagline: "Chaque choix léger fait pousser quelque chose.",
    },
  },
  {
    fileName: "my-garden.png",
    text: "My garden, in Le poids des choses.",
    title: "Share my garden",
    description: (light: number, animals: number) =>
      `your garden, ${pluralEn(light, "lighter choice", "lighter choices")}, ${pluralEn(animals, "animal", "animals")}`,
    alt: "Preview of the image to share: {description}.",
    preparing: "Preparing the image…",
    privacy:
      "The image shows your garden and the number of your lighter choices. Not your journal, and no kilos of CO2e.",
    shareImage: "Share the image",
    cancel: "Cancel",
    prepareFailed: "The image couldn’t be prepared. Try again in a moment.",
    shareFailed: "Sharing didn’t work. You can try again.",
    card: {
      kicker: "LE POIDS DES CHOSES",
      title: "My garden",
      titleAsleep: "My garden is resting",
      wake: "It wakes up with your next lighter choice.",
      lightChoices: (n: number) =>
        pluralEn(n, "lighter choice", "lighter choices"),
      animals: (n: number) => pluralEn(n, "animal", "animals"),
      tagline: "Every lighter choice makes something grow.",
    },
  },
);

/** Installation (bandeau de /jardin, accès permanent). */
export const INSTALL = defineMessages(
  {
    close: "Fermer ce bandeau",
    title: "Garde ton jardin",
    prompt:
      "Installe l’app sur ton écran d’accueil pour ne pas perdre ton carnet.",
    ios: "Installe l’app sur ton écran d’accueil pour ne pas perdre ton carnet : touche Partager, puis « Sur l’écran d’accueil ».",
    install: "Installer",
    installApp: "Installer l’appli",
    howTitle: "Pour l’installer, deux gestes :",
    howShare:
      "touche le bouton Partager du navigateur (un carré d’où sort une flèche vers le haut) ;",
    howAdd: "choisis « Sur l’écran d’accueil », puis « Ajouter ».",
  },
  {
    close: "Close this banner",
    title: "Keep your garden",
    prompt:
      "Install the app on your home screen so you don’t lose your journal.",
    ios: "Install the app on your home screen so you don’t lose your journal: tap Share, then “Add to Home Screen”.",
    install: "Install",
    installApp: "Install the app",
    howTitle: "To install it, two steps:",
    howShare:
      "tap the browser’s Share button (a square with an arrow pointing up);",
    howAdd: "choose “Add to Home Screen”, then “Add”.",
  },
);

/** Habitudes : « Mes habitudes » (/jardin) et « Noter une habitude » (/comparer). */
export const HABITS_UI = defineMessages(
  {
    mine: "Mes habitudes",
    mineText:
      "Une habitude tenue ne se compare à rien et ne compte aucun kg : elle arrose ton jardin, et tes plantes avancent vers la floraison.",
    how: "Comment ?",
    oneTap: "Noter une habitude d’un toucher",
    done: (label: string) =>
      `J’ai tenu : ${label.charAt(0).toLowerCase()}${label.slice(1)}`,
    another: "Noter une autre habitude",
    edit: "Modifier mes habitudes",
    already: "Ce que tu fais déjà",
    alreadyHelp:
      "Ces gestes te seront proposés en habitude, sans comparaison. Rien n’est noté tant que tu ne le dis pas. Gardé sur cet appareil seulement.",
    back: "Retour au choix des gestes",
    title: "Noter une habitude",
    help: "Ce que tu fais déjà n’a pas à être comparé à ce que tu ne ferais jamais. Une habitude tenue ne compte aucun kg : elle arrose ton jardin.",
    why: "Pourquoi ?",
    group: "Habitudes",
    myHabit: "Mon habitude",
    didIt: "Je l’ai fait aujourd’hui",
    hintSelected: "Retouche l’habitude pour la retirer.",
    hintNone: "Touche l’habitude que tu as tenue aujourd’hui.",
    choose: "Choisir mes habitudes",
  },
  {
    mine: "My habits",
    mineText:
      "A habit you keep isn’t compared with anything and counts no kg: it waters your garden, and your plants move towards flowering.",
    how: "How?",
    oneTap: "Log a habit with one tap",
    done: (label: string) =>
      `Done today: ${label.charAt(0).toLowerCase()}${label.slice(1)}`,
    another: "Log another habit",
    edit: "Edit my habits",
    already: "What you already do",
    alreadyHelp:
      "These actions will be offered to you as habits, with no comparison. Nothing is noted until you say so. Kept on this device only.",
    back: "Back to the actions",
    title: "Log a habit",
    help: "What you already do doesn’t need comparing with what you’d never do. A habit you keep counts no kg: it waters your garden.",
    why: "Why?",
    group: "Habits",
    myHabit: "My habit",
    didIt: "I did it today",
    hintSelected: "Tap the habit again to remove it.",
    hintNone: "Tap the habit you kept today.",
    choose: "Choose my habits",
  },
);

/** Nom court et déclaration de chaque habitude (table HABITS). */
export const HABIT_NAMES = defineMessages<
  Record<string, { label: string; declaration: string }>
>(
  {
    velo: { label: "À vélo", declaration: "Je me déplace à vélo" },
    marche: { label: "À pied", declaration: "Je me déplace à pied" },
    bus: { label: "En bus", declaration: "Je prends le bus" },
    metro: { label: "En métro", declaration: "Je prends le métro" },
    ter: { label: "En TER", declaration: "Je prends le TER" },
    tgv: { label: "En TGV", declaration: "Je prends le TGV" },
    "repas-vegetarien": {
      label: "Repas végétarien",
      declaration: "Je mange végétarien",
    },
    "repas-vegetalien": {
      label: "Repas végétal",
      declaration: "Je mange végétal",
    },
    "eau-robinet": {
      label: "Eau du robinet",
      declaration: "Je bois l’eau du robinet",
    },
    "boisson-soja": {
      label: "Boisson au soja",
      declaration: "Je bois des boissons au soja",
    },
    "magasin-pied": {
      label: "Courses à pied",
      declaration: "Je fais mes courses à pied",
    },
    "point-relais-pied": {
      label: "Colis à pied",
      declaration: "Je vais chercher mes colis à pied",
    },
  },
  {
    velo: { label: "By bike", declaration: "I get around by bike" },
    marche: { label: "On foot", declaration: "I get around on foot" },
    bus: { label: "By bus", declaration: "I take the bus" },
    metro: { label: "By metro", declaration: "I take the metro" },
    ter: { label: "By TER", declaration: "I take the TER (regional train)" },
    tgv: { label: "By TGV", declaration: "I take the TGV (high-speed train)" },
    "repas-vegetarien": {
      label: "Vegetarian meal",
      declaration: "I eat vegetarian",
    },
    "repas-vegetalien": {
      label: "Plant-based meal",
      declaration: "I eat plant-based",
    },
    "eau-robinet": { label: "Tap water", declaration: "I drink tap water" },
    "boisson-soja": {
      label: "Soya drink",
      declaration: "I drink soya drinks",
    },
    "magasin-pied": {
      label: "Shopping on foot",
      declaration: "I go shopping on foot",
    },
    "point-relais-pied": {
      label: "Parcels on foot",
      declaration: "I collect my parcels on foot",
    },
  },
);
