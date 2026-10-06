// Espèces du jardin : fiches (nom, type, description, anecdote) et textes du choix « Que
// veux-tu planter ? ». Chaque anecdote est vérifiée sur une source fiable :
// docs/especes-sources.md. Une anecdote non confirmée n'entre pas ici.
import { defineMessages } from "../index";

export type SpeciesSheet = {
  /** Nom seul (« Olivier »). */
  name: string;
  /** Avec l'article, en milieu de phrase (« l’olivier » ; anglais : « olive tree »). */
  inSentence: string;
  /** Feuillage et floraison (« Persistant · fleurit à la fin du printemps »). */
  type: string;
  description: string;
  anecdote: string;
};

export const SPECIES_SHEETS = defineMessages<Record<string, SpeciesSheet>>(
  {
    "arbre-1": {
      name: "Pommier",
      inSentence: "le pommier",
      type: "Caduc · fleurit au printemps",
      description:
        "Un arbre rond et généreux, qui fleurit blanc et rose au printemps avant de donner ses pommes à l’automne.",
      anecdote:
        "Plante un pépin de pomme et tu obtiendras une variété différente de la pomme d’origine. C’est pour ça que les variétés se multiplient par greffe.",
    },
    "arbre-2": {
      name: "Poirier",
      inSentence: "le poirier",
      type: "Caduc · fleurit au printemps",
      description:
        "Un arbre élancé, plus haut que large, aux fleurs blanches et aux poires dorées.",
      anecdote:
        "La plupart des poires mûrissent mal sur l’arbre : on les cueille avant, et elles finissent de mûrir après la cueillette. Laissées sur l’arbre, elles deviennent farineuses.",
    },
    "arbre-3": {
      name: "Cerisier",
      inSentence: "le cerisier",
      type: "Caduc · fleurit au printemps",
      description:
        "Un nuage de fleurs au printemps, puis des cerises par paires au début de l’été.",
      anecdote:
        "Au Japon, la floraison des cerisiers se fête avec le hanami : on pique-nique sous les arbres en fleurs.",
    },
    "fleur-1": {
      name: "Églantine",
      inSentence: "l’églantine",
      type: "Rosier sauvage · fleurit de la fin du printemps à l’été",
      description:
        "La fleur du rosier sauvage : cinq pétales roses autour d’un cœur doré.",
      anecdote:
        "Ses fruits rouges, les cynorrhodons, sont surnommés « gratte-cul » à cause des petits poils qui grattent à l’intérieur.",
    },
    "fleur-2": {
      name: "Tulipe",
      inSentence: "la tulipe",
      type: "Bulbe · fleurit au printemps",
      description:
        "Une fleur en coupe qui sort de terre au printemps, à partir d’un bulbe.",
      anecdote:
        "La tulipe vient d’Asie centrale. Elle est arrivée en Europe au XVIe siècle par l’Empire ottoman.",
    },
    "fleur-3": {
      name: "Herbes folles",
      inSentence: "les herbes folles",
      type: "Vivaces · fleurissent au printemps et en été",
      description:
        "Les herbes qu’on laisse pousser librement, un abri pour les petites bêtes du jardin.",
      anecdote:
        "Les graminées n’ont pas besoin des insectes : c’est le vent qui transporte leur pollen.",
    },
    "arbre-4": {
      name: "Olivier",
      inSentence: "l’olivier",
      type: "Persistant · fleurit à la fin du printemps",
      description:
        "Un arbre méditerranéen au tronc tortueux et aux feuilles argentées, qui garde ses feuilles toute l’année.",
      anecdote:
        "Les olives vertes et les olives noires viennent du même arbre : les noires sont simplement cueillies plus mûres.",
    },
    "arbre-5": {
      name: "Sapin",
      inSentence: "le sapin",
      type: "Persistant · conifère",
      description:
        "Un conifère en étages qui garde ses aiguilles l’hiver et porte ses cônes dressés vers le ciel.",
      anecdote:
        "Les cônes du sapin se défont directement sur l’arbre. Au pied d’un sapin, on ne trouve que des écailles isolées, presque jamais un cône entier.",
    },
    "arbre-6": {
      name: "Figuier",
      inSentence: "le figuier",
      type: "Caduc",
      description:
        "Un arbre du Sud aux grandes feuilles découpées, qui perd ses feuilles l’hiver et montre alors ses branches.",
      anecdote:
        "La figue cache ses fleurs à l’intérieur : ce qu’on mange est une sorte de coupe charnue qui les enferme.",
    },
    "fleur-4": {
      name: "Marguerite",
      inSentence: "la marguerite",
      type: "Vivace · fleurit de la fin du printemps à l’été",
      description:
        "Des pétales blancs autour d’un cœur jaune, la fleur des prairies par excellence.",
      anecdote:
        "Une marguerite n’est pas une fleur mais un bouquet : son cœur jaune est fait de nombreuses minuscules fleurs, et chaque « pétale » blanc en est une aussi.",
    },
    "fleur-5": {
      name: "Lavande",
      inSentence: "la lavande",
      type: "Arbrisseau persistant · fleurit en été",
      description:
        "Des épis parfumés qui colorent la Provence en été et attirent les abeilles.",
      anecdote:
        "En France, la plupart des champs de « lavande » sont en réalité du lavandin, un hybride naturel de la lavande vraie et de la lavande aspic.",
    },
    "fleur-6": {
      name: "Pissenlit",
      inSentence: "le pissenlit",
      type: "Vivace · fleurit surtout au printemps",
      description:
        "Une fleur jaune vif qui devient une boule de graines à souffler.",
      anecdote:
        "En anglais, il s’appelle dandelion, de l’ancien français « dent de lion », à cause de ses feuilles dentelées. En français, son nom, « pisse-en-lit », rappelle ses vertus diurétiques.",
    },
  },
  {
    "arbre-1": {
      name: "Apple tree",
      inSentence: "apple tree",
      type: "Deciduous · blossoms in spring",
      description:
        "A round, generous tree that blossoms white and pink in spring before bearing apples in autumn.",
      anecdote:
        "Plant an apple pip and you’ll get a different variety from the apple it came from. That’s why varieties are grown by grafting.",
    },
    "arbre-2": {
      name: "Pear tree",
      inSentence: "pear tree",
      type: "Deciduous · blossoms in spring",
      description:
        "A slender tree, taller than it is wide, with white blossom and golden pears.",
      anecdote:
        "Most pears don’t ripen well on the tree: they’re picked before they’re ripe and finish ripening afterwards. Left on the tree, they turn mealy.",
    },
    "arbre-3": {
      name: "Cherry tree",
      inSentence: "cherry tree",
      type: "Deciduous · blossoms in spring",
      description:
        "A cloud of blossom in spring, then cherries in pairs in early summer.",
      anecdote:
        "In Japan, cherry blossom season is celebrated with hanami: picnics under the trees in bloom.",
    },
    "fleur-1": {
      name: "Dog rose",
      inSentence: "dog rose",
      type: "Wild rose · flowers from late spring into summer",
      description:
        "The flower of the wild rose: five pink petals around a golden heart.",
      anecdote:
        "The hairs inside its red hips are so itchy that they’re used to make itching powder.",
    },
    "fleur-2": {
      name: "Tulip",
      inSentence: "tulip",
      type: "Bulb · flowers in spring",
      description: "A cup-shaped flower that rises from a bulb in spring.",
      anecdote:
        "Tulips come from Central Asia and reached Europe in the 16th century by way of the Ottoman Empire.",
    },
    "fleur-3": {
      name: "Wild grasses",
      inSentence: "wild grasses",
      type: "Perennials · flower in spring and summer",
      description:
        "Grasses left to grow freely, a shelter for the garden’s small creatures.",
      anecdote: "Grasses don’t need insects: the wind carries their pollen.",
    },
    "arbre-4": {
      name: "Olive tree",
      inSentence: "olive tree",
      type: "Evergreen · flowers in late spring",
      description:
        "A Mediterranean tree with a twisted trunk and silvery leaves, evergreen all year round.",
      anecdote:
        "Green and black olives grow on the same tree: black ones are simply picked riper.",
    },
    "arbre-5": {
      name: "Fir tree",
      inSentence: "fir tree",
      type: "Evergreen · conifer",
      description:
        "A tiered conifer that keeps its needles through winter and holds its cones upright.",
      anecdote:
        "Fir cones break apart while still on the tree. Under a fir you’ll find loose scales, almost never a whole cone.",
    },
    "arbre-6": {
      name: "Fig tree",
      inSentence: "fig tree",
      type: "Deciduous",
      description:
        "A southern tree with large lobed leaves. It drops them in winter, showing off its branches.",
      anecdote:
        "A fig hides its flowers on the inside: what we eat is a fleshy pouch that encloses them.",
    },
    "fleur-4": {
      name: "Oxeye daisy",
      inSentence: "oxeye daisy",
      type: "Perennial · flowers from late spring into summer",
      description:
        "White petals around a yellow heart, the meadow flower par excellence.",
      anecdote:
        "A daisy isn’t one flower but a whole bunch: its yellow centre is made of many tiny flowers, and each white “petal” is a flower too.",
    },
    "fleur-5": {
      name: "Lavender",
      inSentence: "lavender",
      type: "Evergreen shrub · flowers in summer",
      description:
        "Fragrant spikes that colour Provence in summer and draw in the bees.",
      anecdote:
        "In France, most “lavender” fields are actually lavandin, a natural hybrid of true lavender and spike lavender.",
    },
    "fleur-6": {
      name: "Dandelion",
      inSentence: "dandelion",
      type: "Perennial · flowers mostly in spring",
      description:
        "A bright yellow flower that turns into a ball of seeds to blow away.",
      anecdote:
        "Its English name comes from the Old French “dent de lion”, lion’s tooth, after its jagged leaves. The French name, pissenlit (“wet the bed”), is less poetic: it refers to the plant being a diuretic.",
    },
  },
);

/** Choix de l'espèce et annonce d'une nouvelle espèce. */
export const SPECIES_PICKER = defineMessages(
  {
    title: "Que veux-tu planter ?",
    several: (n: number) =>
      `${n} plantes vont pousser : elles seront toutes de l’espèce que tu choisis.`,
    plant: "Planter : {name}",
    anecdote: "Anecdote :",
    locked: "Se débloque bientôt",
    condition: (n: number) =>
      n > 1
        ? `Encore ${n} choix légers ou jours arrosés`
        : "Encore 1 choix léger ou jour arrosé",
    auto: "Laisse le jardin choisir",
    close: "Fermer : le jardin choisit",
    tree: "Arbre",
    flower: "Fleur",
    unlocked: (name: string) => `Nouvelle espèce : ${name}`,
    unlockedHint: "Tu pourras la planter au prochain choix léger.",
  },
  {
    title: "What would you like to plant?",
    several: (n: number) =>
      `${n} plants are about to grow: they’ll all be the species you choose.`,
    plant: "Plant: {name}",
    anecdote: "Fun fact:",
    locked: "Coming soon",
    condition: (n: number) =>
      n === 1
        ? "1 more lighter choice or watered day"
        : `${n} more lighter choices or watered days`,
    auto: "Let the garden choose",
    close: "Close: the garden chooses",
    tree: "Tree",
    flower: "Flower",
    unlocked: (name: string) => `New species: ${name}`,
    unlockedHint: "You can plant it with your next lighter choice.",
  },
);
