import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  ILLUSTRATION_NAMES,
  ILLUSTRATION_SPECS,
} from "../src/lib/illustrations/specs";
import {
  checkAgainstSpec,
  componentName,
  convertDirectory,
  convertSvg,
  generateModule,
  toJsxAttributeName,
} from "./build-illustrations";

const DIR = new URL("../public/illustrations/", import.meta.url);
const STATIC_ID = /\sid="/;

describe("toJsxAttributeName", () => {
  it("convertit les attributs SVG en props React", () => {
    expect(toJsxAttributeName("stroke-width")).toBe("strokeWidth");
    expect(toJsxAttributeName("fill-opacity")).toBe("fillOpacity");
    expect(toJsxAttributeName("class")).toBe("className");
    expect(toJsxAttributeName("xlink:href")).toBe("href");
    expect(toJsxAttributeName("xml:space")).toBe("xmlSpace");
    expect(toJsxAttributeName("data-x")).toBe("data-x");
    expect(toJsxAttributeName("xmlns")).toBeNull();
    expect(toJsxAttributeName("xmlns:xlink")).toBeNull();
  });
});

describe("convertSvg", () => {
  const sample = `<?xml version="1.0"?>
<!-- export -->
<svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="tronc"><rect x="1" y="2" width="3" height="4" fill="#1F1A17" stroke-width="2"/></g>
<g id="feuillage" style="mix-blend-mode: multiply"><circle cx="60" cy="54" r="44" fill="url(#grad)"/></g>
<defs><linearGradient id="grad"><stop stop-color="#FFC93C"/></linearGradient></defs>
</svg>`;
  const converted = convertSvg("arbre-1-grand", sample);

  it("lit la taille et le viewBox", () => {
    expect(converted).toMatchObject({
      width: 120,
      height: 160,
      viewBox: "0 0 120 160",
    });
  });
  it("remplace les id par data-part", () => {
    expect(converted.parts).toEqual(["tronc", "feuillage"]);
    expect(converted.body).toContain('data-part="tronc"');
    expect(converted.body).toContain('data-part="feuillage"');
    expect(converted.body).not.toMatch(STATIC_ID);
  });
  it("garde les id référencés, préfixés par instance", () => {
    expect(converted.referencedIds).toEqual(["grad"]);
    expect(converted.body).toContain("id={`${uid}-grad`}");
    expect(converted.body).toContain("fill={`url(#${uid}-grad)`}");
    expect(converted.parts).not.toContain("grad");
  });
  it("convertit attributs et style", () => {
    expect(converted.body).toContain('strokeWidth="2"');
    expect(converted.body).toContain('stopColor="#FFC93C"');
    expect(converted.body).toContain('style={{ "mixBlendMode": "multiply" }}');
    expect(converted.body).not.toContain("xmlns");
    expect(converted.rootAttributes).toBe(' fill="none"');
  });
  it("refuse une racine qui n'est pas <svg>", () => {
    expect(() => convertSvg("x", "<g></g>")).toThrow(/racine/);
  });
  it("refuse des balises mal fermées", () => {
    expect(() => convertSvg("x", '<svg viewBox="0 0 1 1"><g>')).toThrow(
      /mal fermées/,
    );
  });
});

describe("checkAgainstSpec", () => {
  it("signale une taille ou un calque manquant", () => {
    const wrong = convertSvg(
      "arbre-1-grand",
      '<svg width="100" height="160"><g id="tronc"/></svg>',
    );
    const problems = checkAgainstSpec(wrong);
    expect(problems.join("\n")).toMatch(/100×160, attendu 120×160/);
    expect(problems.join("\n")).toMatch(/« feuillage » manquant/);
  });
  it("signale un fichier inconnu", () => {
    expect(
      checkAgainstSpec(
        convertSvg("inconnu", '<svg width="1" height="1"></svg>'),
      ),
    ).toHaveLength(1);
  });
});

describe("illustrations du dépôt", () => {
  const files = readdirSync(DIR).filter((file) => file.endsWith(".svg"));

  it("47 fichiers, exactement ceux de specs.ts", () => {
    expect(files).toHaveLength(47);
    expect(files.map((file) => file.replace(/\.svg$/, "")).sort()).toEqual(
      [...ILLUSTRATION_NAMES].sort(),
    );
  });

  it.each(files)(
    "%s : conforme, sans id restant, calques attendus présents",
    (file) => {
      const name = file.replace(
        /\.svg$/,
        "",
      ) as keyof typeof ILLUSTRATION_SPECS;
      const converted = convertSvg(
        name,
        readFileSync(new URL(file, DIR), "utf8"),
      );
      expect(checkAgainstSpec(converted)).toEqual([]);
      expect(converted.body).not.toMatch(STATIC_ID);
      for (const part of ILLUSTRATION_SPECS[name].parts) {
        expect(converted.body).toContain(`data-part="${part}"`);
      }
    },
  );

  it("le composant généré est à jour (sinon : pnpm illustrations)", () => {
    const committed = readFileSync(
      new URL("../src/components/illustrations/generated.tsx", import.meta.url),
      "utf8",
    );
    expect(committed).toBe(generateModule(convertDirectory(DIR)));
  });
});

describe("componentName", () => {
  it("donne un nom de composant valide", () => {
    expect(componentName("arbre-1-pousse")).toBe("Arbre1Pousse");
    expect(componentName("picto-repas-boeuf")).toBe("PictoRepasBoeuf");
  });
});
