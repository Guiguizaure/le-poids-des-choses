import { describe, expect, it } from "vitest";
import {
  SELECTION,
  buildGestures,
  parseCsv,
  roundSignificant,
} from "./build-gestures";

const header = "Nom de l'objet ou du geste,kg CO2e,Thématique,ID,URL";

describe("parseCsv", () => {
  it("gère les champs entre guillemets avec virgule", () => {
    expect(parseCsv('a,"b, c","d ""e"""\n1,2,3')).toEqual([
      ["a", "b, c", 'd "e"'],
      ["1", "2", "3"],
    ]);
  });
});

describe("roundSignificant", () => {
  it("arrondit à 4 chiffres significatifs", () => {
    expect(roundSignificant(28.009169999999997)).toBe(28.01);
    expect(roundSignificant(0.0044399999999999995)).toBe(0.00444);
    expect(roundSignificant(0)).toBe(0);
  });
});

describe("buildGestures", () => {
  const sel = [SELECTION.find((s) => s.sourceId === "marche")!];
  it("construit un geste à partir d'une ligne", () => {
    const csv = `${header}\nMarche,0,Transport,marche,https://impactco2.fr/outils/transport/marche\n`;
    const [g] = buildGestures(csv, sel);
    expect(g).toMatchObject({
      id: "marche",
      kgCo2ePerUnit: 0,
      source: "impactco2",
      fictive: false,
    });
  });
  it("échoue si l'ID a disparu", () => {
    expect(() => buildGestures(`${header}\n`, sel)).toThrow(/absent/);
  });
  it("échoue si la thématique a changé", () => {
    const csv = `${header}\nMarche,0,Autre,marche,https://x\n`;
    expect(() => buildGestures(csv, sel)).toThrow(/attendu/);
  });

  describe("objets : modes d'acquisition", () => {
    const jean = [SELECTION.find((s) => s.sourceId === "jeans")!];
    const csv = [
      header,
      "Jeans,25.08872880618721,Habillement,jeans,https://impactco2.fr/outils/habillement/jeans",
      "Livraison à domicile (colis d'1kg),0.7220005148152214,Livraison,livraisondomicile,https://impactco2.fr/outils/livraison/livraisondomicile",
      "Marche,0,Transport,marche,https://x",
    ].join("\n");
    it("construit les 4 modes avec le colis arrondi", () => {
      const [g] = buildGestures(csv, jean, { jean: "livraisondomicile" });
      expect(g.modes?.neuf?.kgCo2e).toBe(25.09);
      expect(g.modes?.occasion?.kgCo2e).toBe(0);
      expect(g.modes?.garder?.kgCo2e).toBe(0);
      expect(g.modes?.["occasion-livree"]?.kgCo2e).toBe(0.722);
      expect(g.modes?.["occasion-livree"]?.parts?.[1].sourceId).toBe(
        "livraisondomicile",
      );
    });
    it("sans colis adapté : pas d'occasion livrée, aucun transport inventé", () => {
      const [g] = buildGestures(csv, jean, {});
      expect(g.modes?.["occasion-livree"]).toBeUndefined();
      expect(g.modes?.neuf).toBeDefined();
    });
    it("échoue si la ligne de colis n'est plus dans « Livraison »", () => {
      expect(() => buildGestures(csv, jean, { jean: "marche" })).toThrow(
        /attendu/,
      );
    });
    it("pas de modes pour un trajet", () => {
      const [g] = buildGestures(
        csv,
        [SELECTION.find((s) => s.sourceId === "marche")!],
        {},
      );
      expect(g.modes).toBeUndefined();
    });
  });
});
