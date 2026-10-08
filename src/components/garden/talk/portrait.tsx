import Image from "next/image";
import { EXPRESSIONS, type Expression, type TalkerId } from "@/content/animaux";

/** Fichiers des portraits : public/portraits/portrait-{animal}-{expression}.svg. */
const SLUG: Record<TalkerId, string> = {
  butterfly: "papillon",
  ladybug: "coccinelle",
  bird: "oiseau",
  snail: "escargot",
  fox: "renard",
};

export function portraitSrc(talker: TalkerId, expr: Expression): string {
  return `/portraits/portrait-${SLUG[talker]}-${expr}.svg`;
}

/**
 * « Zzz » d'un animal endormi dans le jardin, purement décoratif (dessiné en CSS : rien à lire
 * ni à mesurer pour les outils d'accessibilité, le nom du bouton dit déjà qu'il dort) ;
 * immobile en mouvement réduit.
 */
export function Zzz({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      data-zzz
      className={`font-titre text-encre animate-zzz pointer-events-none block leading-none after:content-['Zzz'] motion-reduce:animate-none ${className}`}
    />
  );
}

/**
 * Portrait de l'animal (décoratif : le nom est dans l'étiquette). Coins arrondis en CSS
 * (rayon 32 sur 240, comme le cadre dessiné : les fichiers n'ont pas de découpe). Les trois expressions sont
 * superposées et chargées d'avance : changer d'expression est un fondu court, sans rien en
 * mouvement réduit.
 */
export function Portrait({
  talker,
  expr,
  className = "",
}: {
  talker: TalkerId;
  expr: Expression;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      data-portrait={talker}
      data-expr={expr}
      className={`relative shrink-0 ${className}`}
    >
      {EXPRESSIONS.map((candidate) => (
        <Image
          key={candidate}
          src={portraitSrc(talker, candidate)}
          alt=""
          width={240}
          height={240}
          unoptimized
          className={`absolute inset-0 size-full rounded-[13.333%] transition-opacity duration-200 motion-reduce:transition-none ${candidate === expr ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}
