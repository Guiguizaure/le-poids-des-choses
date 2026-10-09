import { describe, expect, it } from "vitest";
import { buildGarden } from "@/lib/garden/model";
import { treesBySeasonHabit } from "@/lib/garden/species";
import { SEASONS_UI } from "./seasons";
import { SPECIES_SHEETS } from "./species";

const fr = SEASONS_UI.fr;
const en = SEASONS_UI.en;
const apple = { name: "pommier", count: 1 };
const cherry = { name: "cerisier", count: 1 };

describe("au fil des saisons : textes", () => {
  it("fiche : caduc et persistant, comme la maquette", () => {
    const sheets = SPECIES_SHEETS.fr;
    expect(
      fr.deciduous(sheets["arbre-1"].inSentence, sheets["arbre-1"].pronoun),
    ).toBe(
      "Le pommier perd ses feuilles et dort en hiver. Il se réveillera au printemps.",
    );
    expect(fr.evergreen(sheets["arbre-4"].inSentence, false)).toBe(
      "L’olivier garde ses feuilles toute l’année, même en hiver.",
    );
    expect(fr.evergreen(sheets["arbre-5"].inSentence, true)).toBe(
      "Le sapin garde ses aiguilles toute l’année, même en hiver.",
    );
    expect(en.deciduous(SPECIES_SHEETS.en["arbre-1"].inSentence, "it")).toBe(
      "The apple tree loses its leaves and sleeps through winter. It will wake up in spring.",
    );
  });
  it("arbre endormi touché", () => {
    expect(fr.asleepUntilSpring("le pommier")).toBe(
      "Le pommier dort jusqu’au printemps.",
    );
    expect(en.asleepUntilSpring("apple tree")).toBe(
      "The apple tree is asleep until spring.",
    );
  });
  it("astuce de saison construite avec les arbres du jardin", () => {
    expect(fr.seasonHint("automne", [apple, cherry], ["l’olivier"])).toBe(
      "L’automne est là : ton pommier et ton cerisier se colorent. L’olivier, lui, garde ses feuilles.",
    );
    expect(fr.seasonHint("hiver", [apple], [])).toBe(
      "C’est l’hiver : ton pommier s’est endormi. Il se réveillera au printemps.",
    );
    expect(fr.seasonHint("hiver", [{ name: "pommier", count: 2 }], [])).toBe(
      "C’est l’hiver : tes pommiers se sont endormis. Ils se réveilleront au printemps.",
    );
    expect(fr.seasonHint("printemps", [apple, cherry], [])).toBe(
      "Le printemps revient : tes arbres se réveillent.",
    );
    expect(fr.seasonHint("printemps", [apple], [])).toBe(
      "Le printemps revient : ton pommier se réveille.",
    );
    expect(
      en.seasonHint(
        "automne",
        [{ name: "apple tree", count: 1 }],
        ["olive tree", "fir tree"],
      ),
    ).toBe(
      "Autumn is here: your apple tree is turning colour. The olive tree and fir tree, though, keep their leaves.",
    );
  });
  it("aucune astuce sans arbre caduc, ni l'été", () => {
    expect(fr.seasonHint("automne", [], ["l’olivier"])).toBeNull();
    expect(fr.seasonHint("ete", [apple], [])).toBeNull();
    expect(en.seasonHint("ete", [apple], [])).toBeNull();
  });
  it("arbres du jardin : caducs comptés par espèce, persistants une fois, fleurs ignorées", () => {
    const plants = [
      { kind: { type: "tree", variant: 1 } },
      { kind: { type: "flower", variant: 1 } },
      { kind: { type: "tree", variant: 4 } },
      { kind: { type: "tree", variant: 1 } },
      { kind: { type: "tree", variant: 4 } },
      { kind: { type: "tree", variant: 6 } },
    ] as const;
    expect(treesBySeasonHabit(plants)).toEqual({
      deciduous: [
        { id: "arbre-1", count: 2 },
        { id: "arbre-6", count: 1 },
      ],
      evergreen: ["arbre-4"],
    });
    expect(treesBySeasonHabit(buildGarden([], new Date()).plants)).toEqual({
      deciduous: [],
      evergreen: [],
    });
  });
});
