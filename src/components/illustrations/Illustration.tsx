import { useId, type SVGProps } from "react";
import type { IllustrationName } from "@/lib/illustrations/specs";
import { generatedIllustrations } from "./generated";

export type IllustrationProps = Omit<
  SVGProps<SVGSVGElement>,
  "children" | "name"
> & {
  name: IllustrationName;
  /** Titre accessible. Sans titre, l'illustration est décorative (aria-hidden). */
  title?: string;
};

/**
 * Affiche une illustration de public/illustrations, convertie en composant. Les calques sont
 * exposés en data-part="…" (pas d'id) : on peut afficher plusieurs fois le même SVG.
 */
export function Illustration({ name, title, ...svgProps }: IllustrationProps) {
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const Component = generatedIllustrations[name];
  const titleId = `${uid}-title`;
  const a11y: SVGProps<SVGSVGElement> = title
    ? { role: "img", "aria-labelledby": titleId }
    : { "aria-hidden": true, focusable: "false" };

  return (
    <Component uid={uid} svgProps={{ ...a11y, ...svgProps }}>
      {title ? <title id={titleId}>{title}</title> : null}
    </Component>
  );
}
