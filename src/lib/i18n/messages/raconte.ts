// « Raconte ta journée » / « Tell us about your day » (maquette 08). L'IA ne fait que
// reconnaître des gestes : jamais de chiffre dans ses réponses, tous les kg viennent des données.
import { defineMessages } from "../index";

const pluralFr = (count: number, singular: string, plural: string) =>
  `${count} ${count > 1 ? plural : singular}`;
const pluralEn = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

export const RACONTE = defineMessages(
  {
    back: "Comparer",
    title: "Raconte ta journée",
    intro:
      "Écris tes gestes comme ils te viennent. Tu vérifies tout avant l’ajout au carnet.",
    fieldLabel: "Ta journée, en quelques phrases",
    placeholder:
      "Train Toulon–Marseille ce matin, un burger à midi, et un café en terrasse.",
    characters: " caractères",
    privacy:
      "Ton texte est envoyé à Claude (Anthropic) pour repérer les gestes, puis oublié. N’écris pas d’informations personnelles.",
    more: "En savoir plus",
    reading: "Claude lit ta journée…",
    analyse: "Analyser mon texte",
    aiNote:
      "Fonction IA à la demande. Elle repère tes gestes, mais ne calcule rien : les chiffres viennent de l’ADEME.",
    nothingTitle: "Rien de reconnu",
    understood: "Voici ce que j’ai compris",
    add: "Ajouter au carnet",
    energy:
      "Chaque analyse consomme un peu d’énergie : elle ne se lance qu’à ta demande.",
    seeMethod: "Voir la méthode",
    chooseMine: "Choisir mes gestes",
    check: "À vérifier",
    edit: "Modifier",
    compareOrHabit: "Comparer {label} ou le noter en habitude",
    compare: "Comparer",
    habit: "Habitude tenue (aucun kg : elle arrose ton jardin)",
    distance: "Distance du trajet (km)",
    distanceHint: (min: number, max: string) =>
      `Un nombre entier, de ${min} à ${max} km.`,
    objectQuestion: "Neuf, d’occasion, ou tu gardes {yours} ?",
    delivered: "Livré en colis",
    comparedWith: "Comparé à",
    addedTitle: "C’est noté dans ton carnet",
    added: (n: number) =>
      `${pluralFr(n, "geste ajouté", "gestes ajoutés")} à ton carnet.`,
    heavyNote:
      "Un choix plus lourd est simplement noté : rien n’est retiré au jardin.",
    seeGarden: "Voir mon jardin",
    again: "Raconter autre chose",
    // Textes calculés (src/lib/raconte/text.ts)
    optionNew: "Neuf",
    optionUsed: "D’occasion",
    optionKeep: "Je garde {mine}",
    distanceToFill: "distance à préciser",
    km: "{n} km",
    meal: "1 repas",
    litre: "1 litre",
    purchase: "1 achat",
    optionToFill: "option à préciser",
    usedDelivered: "d’occasion, livré en colis",
    habitNoKg: "habitude, aucun kg",
    fromExcerpt: "d’après « {excerpt} »",
    comparedTo: "Comparé à : {label}",
    tickOne: "Coche au moins un geste pour l’ajouter au carnet.",
    toComplete: (n: number) =>
      pluralFr(n, "geste à compléter", "gestes à compléter"),
    errors: {
      offline:
        "Pas de connexion pour l’instant. Réessaie dans un moment, ou choisis tes gestes toi-même.",
      timeout:
        "Le serveur met trop de temps à répondre, réessaie dans un instant, ou choisis tes gestes toi-même.",
      turnstile:
        "La vérification anti-robot n’a pas abouti. Réessaie, ou choisis tes gestes toi-même.",
      "text-length": "Écris entre 1 et 280 caractères, puis relance l’analyse.",
      "rate-limited":
        "Tu as déjà raconté plusieurs journées aujourd’hui. Reviens demain, ou choisis tes gestes toi-même.",
      quota:
        "Claude a beaucoup lu aujourd’hui et se repose jusqu’à demain. En attendant, tu peux choisir tes gestes toi-même.",
      disabled:
        "« Raconte ta journée » fait une pause pour l’instant. Tu peux choisir tes gestes toi-même.",
      error:
        "Claude n’a pas pu lire ta journée cette fois. Réessaie dans un moment, ou choisis tes gestes toi-même.",
    },
    nothing:
      "Je n’ai reconnu aucun geste du catalogue dans ton texte. Tu peux le reformuler, ou choisir tes gestes toi-même.",
    link: {
      title: "Raconte ta journée",
      text: "Écris tes gestes en quelques phrases : Claude les repère, tu vérifies tout avant l’ajout au carnet.",
      quick: "Plus rapide : raconte ta journée",
    },
  },
  {
    back: "Compare",
    title: "Tell us about your day",
    intro:
      "Write down what you did, however it comes to you. You check everything before it goes into your journal.",
    fieldLabel: "Your day, in a few sentences",
    placeholder:
      "Train from Toulon to Marseille this morning, a burger at lunch, and a coffee on a terrace.",
    characters: " characters",
    privacy:
      "Your text is sent to Claude (Anthropic) to spot your actions, then forgotten. Don’t write any personal information.",
    more: "Find out more",
    reading: "Claude is reading your day…",
    analyse: "Read my day",
    aiNote:
      "AI feature, only when you ask. It spots your actions but doesn’t calculate anything: the figures come from ADEME.",
    nothingTitle: "Nothing recognised",
    understood: "Here’s what I understood",
    add: "Add to journal",
    energy: "Each analysis uses a little energy: it only runs when you ask.",
    seeMethod: "See the method",
    chooseMine: "Choose my actions",
    check: "Check this",
    edit: "Change",
    compareOrHabit: "Compare {label} or log it as a habit",
    compare: "Compare",
    habit: "Habit kept (no kg: it waters your garden)",
    distance: "Trip distance (km)",
    distanceHint: (min: number, max: string) =>
      `A whole number, from ${min} to ${max} km.`,
    objectQuestion: "New, second-hand, or keep {yours}?",
    delivered: "Delivered by post",
    comparedWith: "Compared with",
    addedTitle: "Noted in your journal",
    added: (n: number) =>
      `${pluralEn(n, "action", "actions")} added to your journal.`,
    heavyNote:
      "A heavier choice is simply noted: nothing is taken away from the garden.",
    seeGarden: "See my garden",
    again: "Tell us something else",
    optionNew: "New",
    optionUsed: "Second-hand",
    optionKeep: "I’ll keep {mine}",
    distanceToFill: "distance to fill in",
    km: "{n} km",
    meal: "1 meal",
    litre: "1 litre",
    purchase: "1 purchase",
    optionToFill: "option to fill in",
    usedDelivered: "second-hand, delivered by post",
    habitNoKg: "habit, no kg",
    fromExcerpt: "from “{excerpt}”",
    comparedTo: "Compared with: {label}",
    tickOne: "Tick at least one action to add it to your journal.",
    toComplete: (n: number) =>
      pluralEn(n, "action to complete", "actions to complete"),
    errors: {
      offline:
        "No connection right now. Try again in a moment, or choose your actions yourself.",
      timeout:
        "The server is taking too long to respond, please try again in a moment, or choose your actions yourself.",
      turnstile:
        "The anti-robot check didn’t go through. Try again, or choose your actions yourself.",
      "text-length": "Write between 1 and 280 characters, then try again.",
      "rate-limited":
        "You’ve already told us about several days today. Come back tomorrow, or choose your actions yourself.",
      quota:
        "Claude has read a lot today and is resting until tomorrow. In the meantime, you can choose your actions yourself.",
      disabled:
        "“Tell us about your day” is taking a break for now. You can choose your actions yourself.",
      error:
        "Claude couldn’t read your day this time. Try again in a moment, or choose your actions yourself.",
    },
    nothing:
      "I didn’t recognise any action from the catalogue in your text. You can rephrase it, or choose your actions yourself.",
    link: {
      title: "Tell us about your day",
      text: "Write about your actions in a few sentences: Claude spots them, and you check everything before it goes into your journal.",
      quick: "Quicker: tell us about your day",
    },
  },
);
