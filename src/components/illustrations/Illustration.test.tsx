import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Illustration } from "./Illustration";

describe("<Illustration />", () => {
  it("affiche plusieurs instances sans id en double", () => {
    const html = renderToStaticMarkup(
      <>
        <Illustration name="arbre-1-grand" />
        <Illustration name="arbre-1-grand" />
      </>,
    );
    expect(html.match(/<svg/g)).toHaveLength(2);
    expect(html.match(/data-part="feuillage"/g)).toHaveLength(2);
    expect(html).not.toMatch(/\sid="/);
  });

  it("sans titre : décorative (aria-hidden)", () => {
    const html = renderToStaticMarkup(<Illustration name="papillon" />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("<title");
  });

  it("avec titre : role img et titre relié, id uniques par instance", () => {
    const html = renderToStaticMarkup(
      <>
        <Illustration name="balance" title="Balance en équilibre" />
        <Illustration name="balance" title="Autre balance" />
      </>,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain("Balance en équilibre</title>");
    const ids = [...html.matchAll(/<title id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    for (const id of ids) expect(html).toContain(`aria-labelledby="${id}"`);
  });

  it("transmet la taille et les classes", () => {
    const html = renderToStaticMarkup(
      <Illustration name="picto-velo" className="w-8" />,
    );
    expect(html).toContain('class="w-8"');
    expect(html).toContain('viewBox="0 0 64 64"');
  });
});
