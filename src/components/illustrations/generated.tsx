// Généré par scripts/build-illustrations.ts depuis public/illustrations : ne pas modifier.
// Régénérer avec `pnpm illustrations`.
import type { ComponentType, ReactNode, SVGProps } from "react";
import type { IllustrationName } from "@/lib/illustrations/specs";

export type GeneratedSvgProps = {
  /** Préfixe propre à l'instance, pour les id référencés (dégradés, masques). */
  uid: string;
  svgProps?: SVGProps<SVGSVGElement>;
  /** Rendu en premier dans <svg> (ex. <title>). */
  children?: ReactNode;
};

function Abeille({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="aile-gauche"><ellipse cx="26" cy="14" rx="8" ry="12" transform="rotate(-20 26 14)" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="aile-droite"><ellipse cx="37" cy="13" rx="8" ry="12" transform="rotate(20 37 13)" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="dard"><path d="M17 29 L9 31 L17 34 Z" fill="#1F1A17" /></g><g data-part="corps"><ellipse cx="31" cy="31" rx="15" ry="11" fill="#FFC93C" /></g><g data-part="rayures"><path d="M25 21.5 Q23.5 31 25 40.5 M33 20 Q31.5 31 33 42" stroke="#1F1A17" strokeWidth="4" strokeLinecap="round" /></g><g data-part="tete"><circle cx="47" cy="29" r="7" fill="#1F1A17" /></g><g data-part="oeil"><circle cx="49" cy="27" r="1.6" fill="#FFF3DC" /></g>
    </svg>
  );
}

function Arbre1Grand({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tronc"><rect x="56" y="76" width="8" height="80" fill="#1F1A17" /></g><g data-part="feuillage"><circle cx="60" cy="54" r="44" fill="#FFC93C" /></g>
    </svg>
  );
}

function Arbre1Jeune({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tronc"><rect x="57" y="100" width="6" height="56" fill="#1F1A17" /></g><g data-part="feuillage"><circle cx="60" cy="88" r="24" fill="#FFC93C" /></g>
    </svg>
  );
}

function Arbre1Pousse({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M60 156 V128" stroke="#1F1A17" strokeWidth="4" strokeLinecap="round" /></g><g data-part="feuilles"><ellipse cx="51" cy="131" rx="10" ry="6" transform="rotate(-25 51 131)" fill="#1B6B45" /><ellipse cx="69" cy="127" rx="10" ry="6" transform="rotate(25 69 127)" fill="#FFC93C" /></g>
    </svg>
  );
}

function Arbre2Grand({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tronc"><rect x="57" y="100" width="6" height="56" fill="#1F1A17" /></g><g data-part="feuillage"><ellipse cx="60" cy="64" rx="22" ry="54" fill="#FF4F2E" /></g>
    </svg>
  );
}

function Arbre2Jeune({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tronc"><rect x="58" y="112" width="5" height="44" fill="#1F1A17" /></g><g data-part="feuillage"><ellipse cx="60" cy="96" rx="13" ry="26" fill="#FF4F2E" /></g>
    </svg>
  );
}

function Arbre2Pousse({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M60 156 V128" stroke="#1F1A17" strokeWidth="4" strokeLinecap="round" /></g><g data-part="feuilles"><ellipse cx="51" cy="131" rx="10" ry="6" transform="rotate(-25 51 131)" fill="#1B6B45" /><ellipse cx="69" cy="127" rx="10" ry="6" transform="rotate(25 69 127)" fill="#FF4F2E" /></g>
    </svg>
  );
}

function Arbre3Grand({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tronc"><rect x="56" y="90" width="8" height="66" fill="#1F1A17" /></g><g data-part="feuillage"><circle cx="42" cy="76" r="28" fill="#FF8FB1" /><circle cx="78" cy="68" r="26" fill="#FF8FB1" /><circle cx="62" cy="42" r="26" fill="#FF8FB1" /></g>
    </svg>
  );
}

function Arbre3Jeune({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tronc"><rect x="57" y="104" width="6" height="52" fill="#1F1A17" /></g><g data-part="feuillage"><circle cx="52" cy="96" r="16" fill="#FF8FB1" /><circle cx="70" cy="90" r="14" fill="#FF8FB1" /></g>
    </svg>
  );
}

function Arbre3Pousse({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M60 156 V128" stroke="#1F1A17" strokeWidth="4" strokeLinecap="round" /></g><g data-part="feuilles"><ellipse cx="51" cy="131" rx="10" ry="6" transform="rotate(-25 51 131)" fill="#1B6B45" /><ellipse cx="69" cy="127" rx="10" ry="6" transform="rotate(25 69 127)" fill="#FF8FB1" /></g>
    </svg>
  );
}

function Balance({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={280} height={170} viewBox="0 0 280 170" fill="none" {...svgProps}>
      {children}
      <g data-part="socle"><path d="M114 168 L140 140 L166 168 Z" fill="#1F1A17" /></g><g data-part="mat"><rect x="137" y="40" width="6" height="112" fill="#1F1A17" /></g><g data-part="plateau-gauche"><path d="M40 40 L13 94 M40 40 L67 94" stroke="#1F1A17" strokeWidth="2" /><path d="M2 94 H78 Q40 122 2 94 Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="2" /></g><g data-part="plateau-droit"><path d="M240 40 L213 94 M240 40 L267 94" stroke="#1F1A17" strokeWidth="2" /><path d="M202 94 H278 Q240 122 202 94 Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="2" /></g><g data-part="fleau"><line x1="40" y1="40" x2="240" y2="40" stroke="#1F1A17" strokeWidth="6" strokeLinecap="round" /><circle cx="140" cy="40" r="8" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="3" /></g>
    </svg>
  );
}

function Brume({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={390} height={120} viewBox="0 0 390 120" fill="none" {...svgProps}>
      {children}
      <g data-part="brume-1"><ellipse cx="110" cy="60" rx="140" ry="22" fill="#FFF3DC" fillOpacity="0.85" /></g><g data-part="brume-2"><ellipse cx="280" cy="84" rx="130" ry="18" fill="#FFF3DC" fillOpacity="0.75" /></g><g data-part="brume-3"><ellipse cx="210" cy="36" rx="90" ry="12" fill="#FFF3DC" fillOpacity="0.65" /></g>
    </svg>
  );
}

function Coccinelle({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={48} height={40} viewBox="0 0 48 40" fill="none" {...svgProps}>
      {children}
      <g data-part="pattes"><path d="M12 22 L5 20 M12 28 L4 30 M36 22 L43 20 M36 28 L44 30" stroke="#1F1A17" strokeWidth="2" strokeLinecap="round" /></g><g data-part="corps"><ellipse cx="24" cy="25" rx="13" ry="12" fill="#1F1A17" /></g><g data-part="tete"><circle cx="24" cy="10" r="6" fill="#1F1A17" /></g><g data-part="elytre-gauche"><path d="M24 12 A13 13 0 0 0 11 25 Q11 35 24 37 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /><circle cx="17" cy="21" r="2.4" fill="#1F1A17" /><circle cx="18" cy="30" r="2" fill="#1F1A17" /></g><g data-part="elytre-droite"><path d="M24 12 A13 13 0 0 1 37 25 Q37 35 24 37 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /><circle cx="31" cy="21" r="2.4" fill="#1F1A17" /><circle cx="30" cy="30" r="2" fill="#1F1A17" /></g>
    </svg>
  );
}

function Eclat({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="eclat-traits"><path d="M18 30 L8 20 M40 22 L40 6 M62 30 L72 20 M16 50 L2 50 M64 50 L78 50" stroke="#FF4F2E" strokeWidth="4" strokeLinecap="round" /></g>
    </svg>
  );
}

function Escargot({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="corps"><path d="M4 43 C4 37 10 35 18 35 H44 C50 35 52 29 54 23 C56 19 61 21 60 27 C59 35 55 43 47 43 Z" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /></g><g data-part="antennes"><path d="M55 22 L52 11 M58 22 L61 12" stroke="#1F1A17" strokeWidth="2" strokeLinecap="round" /><circle cx="52" cy="10" r="2" fill="#1F1A17" /><circle cx="61" cy="11" r="2" fill="#1F1A17" /></g><g data-part="coquille"><circle cx="28" cy="25" r="15" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /><circle cx="30" cy="27" r="10" fill="#FF4F2E" /><circle cx="31.5" cy="28.5" r="5.5" fill="#FFC93C" /><circle cx="32.5" cy="29.5" r="2" fill="#FF4F2E" /></g>
    </svg>
  );
}

function EscargotEndormi({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="corps"><path d="M16 43 C16 39 20 37 26 37 H36 C40 37 42 41 42 43 Z" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /></g><g data-part="coquille"><circle cx="28" cy="25" r="15" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /><circle cx="30" cy="27" r="10" fill="#FF4F2E" /><circle cx="31.5" cy="28.5" r="5.5" fill="#FFC93C" /><circle cx="32.5" cy="29.5" r="2" fill="#FF4F2E" /></g>
    </svg>
  );
}

function Fleur1Fleurie({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M30 78 V34" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g><g data-part="feuilles"><ellipse cx="22" cy="58" rx="9" ry="5" transform="rotate(-25 22 58)" fill="#1B6B45" /></g><g data-part="petales"><circle cx="30" cy="16" r="8" fill="#FF8FB1" /><circle cx="41" cy="24" r="8" fill="#FF8FB1" /><circle cx="37" cy="37" r="8" fill="#FF8FB1" /><circle cx="23" cy="37" r="8" fill="#FF8FB1" /><circle cx="19" cy="24" r="8" fill="#FF8FB1" /></g><g data-part="coeur"><circle cx="30" cy="28" r="7" fill="#FFC93C" /></g>
    </svg>
  );
}

function Fleur1Pousse({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M30 78 V62" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g><g data-part="feuilles"><ellipse cx="24" cy="64" rx="7" ry="4" transform="rotate(-25 24 64)" fill="#1B6B45" /><ellipse cx="36" cy="62" rx="7" ry="4" transform="rotate(25 36 62)" fill="#1B6B45" /></g>
    </svg>
  );
}

function Fleur2Fleurie({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M30 78 V30" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g><g data-part="feuilles"><path d="M30 76 C 16 70, 14 56, 18 48 C 26 56, 30 64, 30 76 Z" fill="#1B6B45" /></g><g data-part="petales"><path d="M18 30 Q 17 12 24 6 L 30 14 L 36 6 Q 43 12 42 30 Q 30 40 18 30 Z" fill="#FF4F2E" /></g>
    </svg>
  );
}

function Fleur2Pousse({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M30 78 V60" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g><g data-part="feuilles"><ellipse cx="30" cy="58" rx="5" ry="9" fill="#1B6B45" /></g>
    </svg>
  );
}

function Fleur3Fleurie({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="brins"><path d="M20 78 Q 16 60 8 50 M26 78 Q 24 56 20 40 M32 78 Q 34 54 40 38 M38 78 Q 42 62 52 52 M30 78 Q 30 60 30 46" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" /></g><g data-part="baies"><circle cx="20" cy="38" r="5" fill="#FF4F2E" /><circle cx="40" cy="36" r="5" fill="#FF4F2E" /><circle cx="30" cy="44" r="4" fill="#FF4F2E" /></g>
    </svg>
  );
}

function Fleur3Pousse({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="brins"><path d="M26 78 Q 24 68 20 62 M32 78 Q 34 66 38 60" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" /></g>
    </svg>
  );
}

function Herisson({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="pattes"><path d="M18 42 L17 47 M28 43 L28 47 M38 43 L39 47 M46 41 L47 46" stroke="#1F1A17" strokeWidth="2.4" strokeLinecap="round" /></g><g data-part="corps"><ellipse cx="30" cy="35" rx="21" ry="9" fill="#FFF3DC" /></g><g data-part="piquants"><path d="M9 36 L5 28 L12 26 L9 18 L17 18 L17 10 L25 13 L29 5 L35 11 L41 7 L43 15 L50 15 L48 23 L53 27 L48 33 C40 30 20 31 9 36 Z" fill="#1F1A17" /></g><g data-part="museau"><path d="M45 29 C51 27 57 31 60 36 C56 38 50 40 45 38 Z" fill="#FFF3DC" /><circle cx="60" cy="36" r="2.2" fill="#1F1A17" /></g><g data-part="oeil"><circle cx="51" cy="31" r="1.8" fill="#1F1A17" /></g>
    </svg>
  );
}

function HerissonEndormi({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="piquants"><path d="M32.0 10.0 L34.5 15.2 L38.9 11.4 L39.2 17.2 L44.7 15.3 L42.8 20.8 L48.6 21.1 L44.8 25.5 L50.0 28.0 L44.8 30.5 L48.6 34.9 L42.8 35.2 L44.7 40.7 L39.2 38.8 L38.9 44.6 L34.5 40.8 L32.0 46.0 L29.5 40.8 L25.1 44.6 L24.8 38.8 L19.3 40.7 L21.2 35.2 L15.4 34.9 L19.2 30.5 L14.0 28.0 L19.2 25.5 L15.4 21.1 L21.2 20.8 L19.3 15.3 L24.8 17.2 L25.1 11.4 L29.5 15.2 Z" fill="#1F1A17" /></g><g data-part="museau"><path d="M40 38 C44 36 48 38 49 41 C46 43 42 43 40 41 Z" fill="#FFF3DC" /><circle cx="49" cy="41" r="1.8" fill="#1F1A17" /></g>
    </svg>
  );
}

function Oiseau({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="queue"><path d="M14 28 L2 20 L5 33 Z" fill="#2D4BFF" /></g><g data-part="corps"><ellipse cx="28" cy="30" rx="18" ry="12" fill="#2D4BFF" /></g><g data-part="tete"><circle cx="46" cy="19" r="9" fill="#2D4BFF" /></g><g data-part="bec"><path d="M54 17 L62 20 L54 23 Z" fill="#FFC93C" /></g><g data-part="oeil"><circle cx="48" cy="17" r="2" fill="#1F1A17" /></g><g data-part="aile"><ellipse cx="25" cy="27" rx="12" ry="7" transform="rotate(-18 25 27)" fill="#FF8FB1" /></g><g data-part="pattes"><path d="M24 41 L22 47 M32 41 L33 47" stroke="#1F1A17" strokeWidth="2" strokeLinecap="round" /></g>
    </svg>
  );
}

function OiseauEndormi({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="queue"><path d="M14 28 L2 20 L5 33 Z" fill="#2D4BFF" /></g><g data-part="corps"><ellipse cx="28" cy="30" rx="18" ry="12" fill="#2D4BFF" /></g><g data-part="tete"><circle cx="42" cy="26" r="9" fill="#2D4BFF" /></g><g data-part="bec"><path d="M50 25 L57 28 L50 31 Z" fill="#FFC93C" /></g><g data-part="oeil"><path d="M41 24 Q44 26.5 47 24" stroke="#1F1A17" strokeWidth="1.8" strokeLinecap="round" /></g><g data-part="aile"><ellipse cx="25" cy="27" rx="12" ry="7" transform="rotate(-18 25 27)" fill="#FF8FB1" /></g><g data-part="pattes"><path d="M24 41 L22 47 M32 41 L33 47" stroke="#1F1A17" strokeWidth="2" strokeLinecap="round" /></g>
    </svg>
  );
}

function OiseauVol({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="aile-arriere"><path d="M30 28 C 26 16, 30 6, 40 2 C 42 12, 38 22, 34 29 Z" fill="#FF8FB1" /></g><g data-part="queue"><path d="M14 32 L1 28 L6 40 Z" fill="#2D4BFF" /></g><g data-part="corps"><ellipse cx="28" cy="32" rx="17" ry="10" transform="rotate(-8 28 32)" fill="#2D4BFF" /></g><g data-part="tete"><circle cx="46" cy="24" r="8.5" fill="#2D4BFF" /></g><g data-part="bec"><path d="M53.5 22 L62 24.5 L53.5 27.5 Z" fill="#FFC93C" /></g><g data-part="oeil"><circle cx="48" cy="22" r="2" fill="#1F1A17" /></g><g data-part="aile-avant"><path d="M26 30 C 18 20, 18 8, 26 1 C 32 10, 32 22, 31 31 Z" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.5" strokeLinejoin="round" /></g>
    </svg>
  );
}

function Papillon({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="aile-gauche"><ellipse cx="21" cy="17" rx="14" ry="11" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /><ellipse cx="24" cy="34" rx="10" ry="8" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /><circle cx="18" cy="16" r="3.5" fill="#FF8FB1" /></g><g data-part="aile-droite"><ellipse cx="43" cy="17" rx="14" ry="11" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /><ellipse cx="40" cy="34" rx="10" ry="8" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /><circle cx="46" cy="16" r="3.5" fill="#FF8FB1" /></g><g data-part="corps"><ellipse cx="32" cy="26" rx="3" ry="14" fill="#1F1A17" /><path d="M31 13 Q27 5 23 4 M33 13 Q37 5 41 4" stroke="#1F1A17" strokeWidth="1.8" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoAvion({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2D4BFF" /></g><g data-part="objet"><path d="M32 10 C35 10 36 14 36 18 V27 L52 35 V40 L36 36 V45 L42 49 V52 L32 50 L22 52 V49 L28 45 V36 L12 40 V35 L28 27 V18 C28 14 29 10 32 10 Z" fill="#FFF3DC" /></g>
    </svg>
  );
}

function PictoBiere({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2FBF71" /></g><g data-part="objet"><rect x="18" y="20" width="22" height="30" rx="3" fill="#FFC93C" /><path d="M40 26 H45 C47 26 48 28 48 30 V38 C48 40 47 42 45 42 H40" stroke="#FFF3DC" strokeWidth="4" /><path d="M16 23 C15 16 21 14 24 16 C26 12 32 12 34 15 C38 13 44 16 42 23 Z" fill="#FFF3DC" /></g>
    </svg>
  );
}

function PictoBoissonSoja({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2FBF71" /></g><g data-part="objet"><path d="M22 22 L26 12 H38 L42 22 V52 H22 Z" fill="#FFF3DC" /><path d="M22 22 H42" stroke="#1F1A17" strokeWidth="2" /><path d="M25 46 C25 37 31 31 39 31 C39 40 33 46 25 46 Z" fill="#1B6B45" /><path d="M25 46 L35 35" stroke="#FFF3DC" strokeWidth="1.5" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoBus({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2D4BFF" /></g><g data-part="objet"><rect x="16" y="13" width="32" height="34" rx="6" fill="#FFF3DC" /><rect x="20" y="18" width="24" height="11" rx="2" fill="#2D4BFF" /><rect x="20" y="33" width="24" height="3" rx="1.5" fill="#FFC93C" /><circle cx="23" cy="48" r="4" fill="#1F1A17" /><circle cx="41" cy="48" r="4" fill="#1F1A17" /></g>
    </svg>
  );
}

function PictoCafe({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2FBF71" /></g><g data-part="objet"><path d="M16 26 H42 V38 C42 45 37 50 29 50 C21 50 16 45 16 38 Z" fill="#FFF3DC" /><path d="M42 30 C49 30 49 40 42 40" stroke="#FFF3DC" strokeWidth="4" /><ellipse cx="29" cy="27" rx="12" ry="3" fill="#1F1A17" /><path d="M24 20 Q22 16 24 12 M32 20 Q30 16 32 12" stroke="#FFF3DC" strokeWidth="2.5" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoChaussures({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FF8FB1" /></g><g data-part="objet"><path d="M12 38 C12 30 16 26 20 26 L26 30 L34 24 C38 30 46 32 52 36 V42 H12 Z" fill="#FFF3DC" /><rect x="11" y="42" width="42" height="5" rx="2.5" fill="#1F1A17" /><path d="M26 30 L30 34 M30 27 L34 31" stroke="#1F1A17" strokeWidth="2" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoEauBouteille({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2FBF71" /></g><g data-part="objet"><path d="M28 12 H36 V17 C40 19 42 23 42 27 V50 C42 52 40 54 38 54 H26 C24 54 22 52 22 50 V27 C22 23 24 19 28 17 Z" fill="#FFF3DC" /><rect x="22" y="32" width="20" height="10" fill="#2D4BFF" /><rect x="27" y="9" width="10" height="4" rx="1" fill="#1F1A17" /></g>
    </svg>
  );
}

function PictoEauRobinet({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2FBF71" /></g><g data-part="objet"><path d="M12 22 H36 C42 22 46 26 46 32 V36 H40 V32 C40 30 39 28 36 28 H12 Z" fill="#FFF3DC" /><rect x="21" y="15" width="8" height="7" rx="2" fill="#FFF3DC" /><path d="M43 41 C43 41 39 46 39 48 C39 50.5 41 52 43 52 C45 52 47 50.5 47 48 C47 46 43 41 43 41 Z" fill="#2D4BFF" /></g>
    </svg>
  );
}

function PictoGarder({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2FBF71" /></g><g data-part="objet"><path d="M32 46 C20 38 14 31 14 24 C14 18 19 15 23 15 C27 15 30 17 32 20 C34 17 37 15 41 15 C45 15 50 18 50 24 C50 31 44 38 32 46 Z" fill="#FFF3DC" /></g>
    </svg>
  );
}

function PictoGenerique({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2FBF71" /></g><g data-part="objet"><path d="M20 44 C20 28 30 18 46 18 C46 34 36 44 20 44 Z" fill="#FFF3DC" /><path d="M20 44 L36 28" stroke="#1F1A17" strokeWidth="2.5" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoJean({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FF8FB1" /></g><g data-part="objet"><path d="M21 13 H43 L46 52 H36 L32 28 L28 52 H18 Z" fill="#2D4BFF" /><path d="M21 19 H43" stroke="#FFF3DC" strokeWidth="2" strokeDasharray="2 2" /><path d="M32 19 V28" stroke="#FFF3DC" strokeWidth="2" /></g>
    </svg>
  );
}

function PictoLaitVache({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2FBF71" /></g><g data-part="objet"><path d="M22 22 L26 12 H38 L42 22 V52 H22 Z" fill="#FFF3DC" /><path d="M22 22 H42" stroke="#1F1A17" strokeWidth="2" /><ellipse cx="30" cy="35" rx="5" ry="4" fill="#1F1A17" /><ellipse cx="37" cy="44" rx="3.5" ry="3" fill="#1F1A17" /><ellipse cx="27" cy="46" rx="2.5" ry="2" fill="#1F1A17" /></g>
    </svg>
  );
}

function PictoLivraisonDomicile({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#1F1A17" /></g><g data-part="objet"><path d="M12 30 L28 16 L44 30 V50 H12 Z" fill="#FFF3DC" /><rect x="22" y="38" width="8" height="12" fill="#1F1A17" /><rect x="38" y="40" width="12" height="10" rx="1.5" fill="#FFC93C" /><path d="M44 40 V50" stroke="#1F1A17" strokeWidth="2" /></g>
    </svg>
  );
}

function PictoMagasinPied({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#1F1A17" /></g><g data-part="objet"><rect x="18" y="18" width="28" height="16" fill="#FFF3DC" /><path d="M15 10 H49 L47 18 H17 Z" fill="#FF4F2E" /><path d="M24 10 L23 18 M32 10 V18 M40 10 L41 18" stroke="#FFF3DC" strokeWidth="2" /><rect x="28" y="24" width="8" height="10" fill="#1F1A17" /><ellipse cx="27" cy="46" rx="3.5" ry="6" transform="rotate(-12 27 46)" fill="#FFF3DC" /><ellipse cx="37" cy="44" rx="3.5" ry="6" transform="rotate(12 37 44)" fill="#FFF3DC" /></g>
    </svg>
  );
}

function PictoMagasinVoiture({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#1F1A17" /></g><g data-part="objet"><rect x="18" y="18" width="28" height="16" fill="#FFF3DC" /><path d="M15 10 H49 L47 18 H17 Z" fill="#FF4F2E" /><path d="M24 10 L23 18 M32 10 V18 M40 10 L41 18" stroke="#FFF3DC" strokeWidth="2" /><rect x="28" y="24" width="8" height="10" fill="#1F1A17" /><path d="M18 49 L21 42 C22 40 23 39 25 39 H39 C41 39 42 40 43 42 L46 49 V52 H18 Z" fill="#FFF3DC" /><circle cx="24" cy="52" r="3" fill="#FFC93C" /><circle cx="40" cy="52" r="3" fill="#FFC93C" /></g>
    </svg>
  );
}

function PictoMarche({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2D4BFF" /></g><g data-part="objet"><ellipse cx="25" cy="40" rx="6" ry="10" transform="rotate(-12 25 40)" fill="#FFF3DC" /><ellipse cx="39" cy="26" rx="6" ry="10" transform="rotate(12 39 26)" fill="#FFF3DC" /><circle cx="21" cy="27" r="2.2" fill="#FFF3DC" /><circle cx="26" cy="26" r="2.2" fill="#FFF3DC" /><circle cx="41" cy="13" r="2.2" fill="#FFF3DC" /><circle cx="36" cy="12" r="2.2" fill="#FFF3DC" /></g>
    </svg>
  );
}

function PictoMetro({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2D4BFF" /></g><g data-part="objet"><rect x="18" y="12" width="28" height="34" rx="13" fill="#FFF3DC" /><rect x="22" y="18" width="20" height="12" rx="5" fill="#2D4BFF" /><circle cx="32" cy="38" r="3" fill="#FF4F2E" /><path d="M22 46 L18 54 M42 46 L46 54 M20 51 H44" stroke="#FFF3DC" strokeWidth="3" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoOccasion({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2FBF71" /></g><g data-part="objet"><path d="M19 30 A13 13 0 0 1 42 22" stroke="#FFF3DC" strokeWidth="4" strokeLinecap="round" /><path d="M45 34 A13 13 0 0 1 22 42" stroke="#FFF3DC" strokeWidth="4" strokeLinecap="round" /><path d="M45 15 L46 26 L36 23 Z" fill="#FFF3DC" /><path d="M19 49 L18 38 L28 41 Z" fill="#FFF3DC" /></g>
    </svg>
  );
}

function PictoOrdinateur({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FFC93C" /></g><g data-part="objet"><rect x="15" y="16" width="34" height="23" rx="3" fill="#FFF3DC" /><rect x="19" y="20" width="26" height="15" rx="1.5" fill="#2D4BFF" /><path d="M10 43 H54 L50 48 H14 Z" fill="#1F1A17" /></g>
    </svg>
  );
}

function PictoPointRelaisPied({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#1F1A17" /></g><g data-part="objet"><rect x="20" y="10" width="24" height="22" rx="2" fill="#FFC93C" /><path d="M32 10 V32" stroke="#1F1A17" strokeWidth="3" /><path d="M20 18 H44" stroke="#1F1A17" strokeWidth="1.5" /><ellipse cx="27" cy="46" rx="3.5" ry="6" transform="rotate(-12 27 46)" fill="#FFF3DC" /><ellipse cx="37" cy="44" rx="3.5" ry="6" transform="rotate(12 37 44)" fill="#FFF3DC" /></g>
    </svg>
  );
}

function PictoPointRelaisVoiture({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#1F1A17" /></g><g data-part="objet"><rect x="20" y="10" width="24" height="22" rx="2" fill="#FFC93C" /><path d="M32 10 V32" stroke="#1F1A17" strokeWidth="3" /><path d="M20 18 H44" stroke="#1F1A17" strokeWidth="1.5" /><path d="M18 49 L21 42 C22 40 23 39 25 39 H39 C41 39 42 40 43 42 L46 49 V52 H18 Z" fill="#FFF3DC" /><circle cx="24" cy="52" r="3" fill="#FFC93C" /><circle cx="40" cy="52" r="3" fill="#FFC93C" /></g>
    </svg>
  );
}

function PictoPull({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FF8FB1" /></g><g data-part="objet"><path d="M24 14 L12 20 L10 40 L17 41 L19 27 V50 H45 V27 L47 41 L54 40 L52 20 L40 14 C38 18 35 19 32 19 C29 19 26 18 24 14 Z" fill="#FFC93C" /><path d="M19 46 H45 M24 14 C26 18 29 19 32 19 C35 19 38 18 40 14" stroke="#1F1A17" strokeWidth="2" /></g>
    </svg>
  );
}

function PictoRepasBoeuf({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FF4F2E" /></g><g data-part="objet"><circle cx="32" cy="33" r="18" fill="#FFF3DC" /><path d="M22 30 C22 23 30 21 36 23 C43 25 45 31 42 37 C39 42 31 44 26 41 C23 39 22 35 22 30 Z" fill="#1F1A17" /><circle cx="37" cy="30" r="3.5" fill="#FFF3DC" /></g>
    </svg>
  );
}

function PictoRepasPoisson({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FF4F2E" /></g><g data-part="objet"><circle cx="32" cy="33" r="18" fill="#FFF3DC" /><ellipse cx="30" cy="33" rx="11" ry="7" fill="#2D4BFF" /><path d="M40 33 L48 27 L48 39 Z" fill="#2D4BFF" /><circle cx="25" cy="31" r="1.8" fill="#FFF3DC" /></g>
    </svg>
  );
}

function PictoRepasPoulet({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FF4F2E" /></g><g data-part="objet"><circle cx="32" cy="33" r="18" fill="#FFF3DC" /><ellipse cx="29" cy="31" rx="9" ry="7" transform="rotate(-35 29 31)" fill="#FFC93C" /><path d="M34 36 L41 43" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /><circle cx="42" cy="45" r="2.5" fill="#1F1A17" /></g>
    </svg>
  );
}

function PictoRepasVegetalien({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FF4F2E" /></g><g data-part="objet"><circle cx="32" cy="33" r="18" fill="#FFF3DC" /><path d="M22 40 C22 28 30 21 42 21 C42 33 34 40 22 40 Z" fill="#2FBF71" /><path d="M22 40 L34 28" stroke="#1F1A17" strokeWidth="2" strokeLinecap="round" /><circle cx="38" cy="40" r="2.5" fill="#FFC93C" /><circle cx="43" cy="36" r="2.5" fill="#FFC93C" /></g>
    </svg>
  );
}

function PictoRepasVegetarien({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FF4F2E" /></g><g data-part="objet"><circle cx="32" cy="33" r="18" fill="#FFF3DC" /><ellipse cx="27" cy="31" rx="8" ry="5" transform="rotate(-30 27 31)" fill="#2FBF71" /><ellipse cx="37" cy="29" rx="7" ry="4.5" transform="rotate(25 37 29)" fill="#2FBF71" /><circle cx="35" cy="39" r="4.5" fill="#FF4F2E" /><circle cx="27" cy="40" r="3" fill="#FFC93C" /></g>
    </svg>
  );
}

function PictoSmartphone({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FFC93C" /></g><g data-part="objet"><rect x="22" y="11" width="20" height="40" rx="5" fill="#1F1A17" /><rect x="25" y="15" width="14" height="27" rx="2" fill="#FFF3DC" /><circle cx="32" cy="46.5" r="2" fill="#FFF3DC" /></g>
    </svg>
  );
}

function PictoSoda({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2FBF71" /></g><g data-part="objet"><rect x="22" y="12" width="20" height="40" rx="4" fill="#FF4F2E" /><rect x="22" y="22" width="20" height="16" fill="#FFF3DC" /><rect x="24" y="10" width="16" height="4" rx="2" fill="#1F1A17" /><path d="M27 28 Q32 34 37 28" stroke="#FF4F2E" strokeWidth="2.5" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoStreaming({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FFC93C" /></g><g data-part="objet"><rect x="12" y="16" width="40" height="27" rx="4" fill="#FFF3DC" /><path d="M28 23 L39 29.5 L28 36 Z" fill="#FF4F2E" /><path d="M24 49 H40" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoTelevision({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FFC93C" /></g><g data-part="objet"><rect x="10" y="14" width="44" height="30" rx="4" fill="#1F1A17" /><rect x="14" y="18" width="36" height="22" rx="2" fill="#FFF3DC" /><path d="M26 50 H38 M32 44 V50" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoTer({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2D4BFF" /></g><g data-part="objet"><rect x="19" y="14" width="26" height="30" rx="8" fill="#FFF3DC" /><rect x="23" y="19" width="18" height="10" rx="3" fill="#2D4BFF" /><circle cx="25" cy="37" r="2.5" fill="#FFC93C" /><circle cx="39" cy="37" r="2.5" fill="#FFC93C" /><path d="M23 45 L18 53 M41 45 L46 53" stroke="#FFF3DC" strokeWidth="3" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoTgv({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2D4BFF" /></g><g data-part="objet"><path d="M12 42 C12 25 25 16 46 16 H50 V42 Z" fill="#FFF3DC" /><path d="M24 21 H46 V29 H18 C19 25 21 23 24 21 Z" fill="#2D4BFF" /><rect x="13" y="35" width="37" height="3" fill="#FFC93C" /><path d="M18 43 L14 51 M44 43 L48 51" stroke="#FFF3DC" strokeWidth="3" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoThe({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2FBF71" /></g><g data-part="objet"><path d="M16 26 H42 V38 C42 45 37 50 29 50 C21 50 16 45 16 38 Z" fill="#FFF3DC" /><path d="M42 30 C49 30 49 40 42 40" stroke="#FFF3DC" strokeWidth="4" /><ellipse cx="29" cy="27" rx="12" ry="3" fill="#FFC93C" /><path d="M25 27 L20 15" stroke="#1F1A17" strokeWidth="1.5" /><rect x="15" y="10" width="8" height="7" rx="1" fill="#FF4F2E" /></g>
    </svg>
  );
}

function PictoTshirt({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FF8FB1" /></g><g data-part="objet"><path d="M24 14 L18 17 L10 26 L17 32 L21 29 V51 H43 V29 L47 32 L54 26 L46 17 L40 14 C38 18 35 19 32 19 C29 19 26 18 24 14 Z" fill="#FFF3DC" /><path d="M24 14 C26 18 29 19 32 19 C35 19 38 18 40 14" stroke="#1F1A17" strokeWidth="2" /></g>
    </svg>
  );
}

function PictoVelo({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2D4BFF" /></g><g data-part="objet"><circle cx="20" cy="40" r="9" stroke="#FFF3DC" strokeWidth="3.5" /><circle cx="44" cy="40" r="9" stroke="#FFF3DC" strokeWidth="3.5" /><path d="M20 40 L28 26 H40 L44 40 M28 26 L33 40 H20 M38 22 H44" stroke="#FFF3DC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="M25 22 H31" stroke="#FFC93C" strokeWidth="3" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoVin({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2FBF71" /></g><g data-part="objet"><path d="M22 12 H42 C42 26 38 32 32 33 C26 32 22 26 22 12 Z" fill="#FFF3DC" /><path d="M23 20 H41 C40 27 37 31 32 31 C27 31 24 27 23 20 Z" fill="#FF4F2E" /><path d="M32 33 V48 M24 50 H40" stroke="#FFF3DC" strokeWidth="3.5" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoVisio({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#FFC93C" /></g><g data-part="objet"><rect x="15" y="16" width="34" height="23" rx="3" fill="#FFF3DC" /><circle cx="32" cy="25" r="4" fill="#1F1A17" /><path d="M25 35 C25 30 39 30 39 35 Z" fill="#1F1A17" /><path d="M10 43 H54 L50 48 H14 Z" fill="#1F1A17" /></g>
    </svg>
  );
}

function PictoVoiture({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2D4BFF" /></g><g data-part="objet"><path d="M13 39 L17 29 C18 26 20 25 23 25 H41 C44 25 46 26 47 29 L51 39 V44 H13 Z" fill="#FFF3DC" /><path d="M20 34 L22 29 H42 L44 34 Z" fill="#2D4BFF" /><circle cx="22" cy="45" r="5" fill="#1F1A17" /><circle cx="42" cy="45" r="5" fill="#1F1A17" /></g>
    </svg>
  );
}

function ScenePaysage({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={390} height={300} viewBox="0 0 390 300" fill="none" {...svgProps}>
      {children}
      <g data-part="ciel"><rect width="390" height="300" fill="#FFF3DC" /></g><g data-part="halo-soleil" opacity="0"><circle cx="318" cy="66" r="50" fill="#FFC93C" /></g><g data-part="soleil"><circle cx="318" cy="66" r="42" fill="#FF4F2E" /></g><g data-part="nuage-1"><ellipse cx="86" cy="56" rx="44" ry="15" fill="#FF8FB1" /><ellipse cx="116" cy="44" rx="24" ry="12" fill="#FF8FB1" /></g><g data-part="nuage-2"><ellipse cx="226" cy="96" rx="26" ry="9" fill="#FF8FB1" /></g><g data-part="colline-arriere"><path d="M-30 250 C 60 150, 170 150, 250 250 Z" fill="#2D4BFF" /></g><g data-part="colline-avant"><path d="M140 255 C 230 165, 330 165, 430 250 Z" fill="#2FBF71" /></g><g data-part="sol"><rect y="240" width="390" height="60" fill="#2FBF71" /></g>
    </svg>
  );
}

function Vent({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={390} height={120} viewBox="0 0 390 120" fill="none" {...svgProps}>
      {children}
      <g data-part="traits-1"><path d="M10 40 C80 20 140 60 210 40 C240 32 262 30 282 38 C292 42 290 52 282 50" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g><g data-part="traits-2"><path d="M60 78 C130 58 190 98 260 78 C300 68 330 68 360 76" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g><g data-part="traits-3"><path d="M140 106 C180 96 220 112 250 102 C262 98 268 104 262 108" stroke="#1F1A17" strokeWidth="2.5" strokeLinecap="round" /></g>
    </svg>
  );
}

export const generatedIllustrations: Record<IllustrationName, ComponentType<GeneratedSvgProps>> = {
  "abeille": Abeille,
  "arbre-1-grand": Arbre1Grand,
  "arbre-1-jeune": Arbre1Jeune,
  "arbre-1-pousse": Arbre1Pousse,
  "arbre-2-grand": Arbre2Grand,
  "arbre-2-jeune": Arbre2Jeune,
  "arbre-2-pousse": Arbre2Pousse,
  "arbre-3-grand": Arbre3Grand,
  "arbre-3-jeune": Arbre3Jeune,
  "arbre-3-pousse": Arbre3Pousse,
  "balance": Balance,
  "brume": Brume,
  "coccinelle": Coccinelle,
  "eclat": Eclat,
  "escargot": Escargot,
  "escargot-endormi": EscargotEndormi,
  "fleur-1-fleurie": Fleur1Fleurie,
  "fleur-1-pousse": Fleur1Pousse,
  "fleur-2-fleurie": Fleur2Fleurie,
  "fleur-2-pousse": Fleur2Pousse,
  "fleur-3-fleurie": Fleur3Fleurie,
  "fleur-3-pousse": Fleur3Pousse,
  "herisson": Herisson,
  "herisson-endormi": HerissonEndormi,
  "oiseau": Oiseau,
  "oiseau-endormi": OiseauEndormi,
  "oiseau-vol": OiseauVol,
  "papillon": Papillon,
  "picto-avion": PictoAvion,
  "picto-biere": PictoBiere,
  "picto-boisson-soja": PictoBoissonSoja,
  "picto-bus": PictoBus,
  "picto-cafe": PictoCafe,
  "picto-chaussures": PictoChaussures,
  "picto-eau-bouteille": PictoEauBouteille,
  "picto-eau-robinet": PictoEauRobinet,
  "picto-garder": PictoGarder,
  "picto-generique": PictoGenerique,
  "picto-jean": PictoJean,
  "picto-lait-vache": PictoLaitVache,
  "picto-livraison-domicile": PictoLivraisonDomicile,
  "picto-magasin-pied": PictoMagasinPied,
  "picto-magasin-voiture": PictoMagasinVoiture,
  "picto-marche": PictoMarche,
  "picto-metro": PictoMetro,
  "picto-occasion": PictoOccasion,
  "picto-ordinateur": PictoOrdinateur,
  "picto-point-relais-pied": PictoPointRelaisPied,
  "picto-point-relais-voiture": PictoPointRelaisVoiture,
  "picto-pull": PictoPull,
  "picto-repas-boeuf": PictoRepasBoeuf,
  "picto-repas-poisson": PictoRepasPoisson,
  "picto-repas-poulet": PictoRepasPoulet,
  "picto-repas-vegetalien": PictoRepasVegetalien,
  "picto-repas-vegetarien": PictoRepasVegetarien,
  "picto-smartphone": PictoSmartphone,
  "picto-soda": PictoSoda,
  "picto-streaming": PictoStreaming,
  "picto-television": PictoTelevision,
  "picto-ter": PictoTer,
  "picto-tgv": PictoTgv,
  "picto-the": PictoThe,
  "picto-tshirt": PictoTshirt,
  "picto-velo": PictoVelo,
  "picto-vin": PictoVin,
  "picto-visio": PictoVisio,
  "picto-voiture": PictoVoiture,
  "scene-paysage": ScenePaysage,
  "vent": Vent,
};
