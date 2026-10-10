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

function Arbre1GrandEpanoui({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="epanoui-1"><circle cx="40.0" cy="32.8" r="2.7" fill="#FFF3DC" /><circle cx="43.0" cy="35.0" r="2.7" fill="#FFF3DC" /><circle cx="41.9" cy="38.6" r="2.7" fill="#FFF3DC" /><circle cx="38.1" cy="38.6" r="2.7" fill="#FFF3DC" /><circle cx="37.0" cy="35.0" r="2.7" fill="#FFF3DC" /><circle cx="40" cy="36" r="2.2" fill="#FFC93C" /><circle cx="76.0" cy="36.8" r="2.7" fill="#FFF3DC" /><circle cx="79.0" cy="39.0" r="2.7" fill="#FFF3DC" /><circle cx="77.9" cy="42.6" r="2.7" fill="#FFF3DC" /><circle cx="74.1" cy="42.6" r="2.7" fill="#FFF3DC" /><circle cx="73.0" cy="39.0" r="2.7" fill="#FFF3DC" /><circle cx="76" cy="40" r="2.2" fill="#FFC93C" /><circle cx="58.0" cy="60.8" r="2.7" fill="#FFF3DC" /><circle cx="61.0" cy="63.0" r="2.7" fill="#FFF3DC" /><circle cx="59.9" cy="66.6" r="2.7" fill="#FFF3DC" /><circle cx="56.1" cy="66.6" r="2.7" fill="#FFF3DC" /><circle cx="55.0" cy="63.0" r="2.7" fill="#FFF3DC" /><circle cx="58" cy="64" r="2.2" fill="#FFC93C" /><circle cx="32.0" cy="58.8" r="2.7" fill="#FFF3DC" /><circle cx="35.0" cy="61.0" r="2.7" fill="#FFF3DC" /><circle cx="33.9" cy="64.6" r="2.7" fill="#FFF3DC" /><circle cx="30.1" cy="64.6" r="2.7" fill="#FFF3DC" /><circle cx="29.0" cy="61.0" r="2.7" fill="#FFF3DC" /><circle cx="32" cy="62" r="2.2" fill="#FFC93C" /><circle cx="84.0" cy="62.8" r="2.7" fill="#FFF3DC" /><circle cx="87.0" cy="65.0" r="2.7" fill="#FFF3DC" /><circle cx="85.9" cy="68.6" r="2.7" fill="#FFF3DC" /><circle cx="82.1" cy="68.6" r="2.7" fill="#FFF3DC" /><circle cx="81.0" cy="65.0" r="2.7" fill="#FFF3DC" /><circle cx="84" cy="66" r="2.2" fill="#FFC93C" /></g><g data-part="epanoui-2"><circle cx="40.0" cy="32.8" r="2.7" fill="#FFF3DC" /><circle cx="43.0" cy="35.0" r="2.7" fill="#FFF3DC" /><circle cx="41.9" cy="38.6" r="2.7" fill="#FFF3DC" /><circle cx="38.1" cy="38.6" r="2.7" fill="#FFF3DC" /><circle cx="37.0" cy="35.0" r="2.7" fill="#FFF3DC" /><circle cx="40" cy="36" r="2.2" fill="#FFC93C" /><circle cx="76.0" cy="36.8" r="2.7" fill="#FFF3DC" /><circle cx="79.0" cy="39.0" r="2.7" fill="#FFF3DC" /><circle cx="77.9" cy="42.6" r="2.7" fill="#FFF3DC" /><circle cx="74.1" cy="42.6" r="2.7" fill="#FFF3DC" /><circle cx="73.0" cy="39.0" r="2.7" fill="#FFF3DC" /><circle cx="76" cy="40" r="2.2" fill="#FFC93C" /><circle cx="58.0" cy="60.8" r="2.7" fill="#FFF3DC" /><circle cx="61.0" cy="63.0" r="2.7" fill="#FFF3DC" /><circle cx="59.9" cy="66.6" r="2.7" fill="#FFF3DC" /><circle cx="56.1" cy="66.6" r="2.7" fill="#FFF3DC" /><circle cx="55.0" cy="63.0" r="2.7" fill="#FFF3DC" /><circle cx="58" cy="64" r="2.2" fill="#FFC93C" /><circle cx="32.0" cy="58.8" r="2.7" fill="#FFF3DC" /><circle cx="35.0" cy="61.0" r="2.7" fill="#FFF3DC" /><circle cx="33.9" cy="64.6" r="2.7" fill="#FFF3DC" /><circle cx="30.1" cy="64.6" r="2.7" fill="#FFF3DC" /><circle cx="29.0" cy="61.0" r="2.7" fill="#FFF3DC" /><circle cx="32" cy="62" r="2.2" fill="#FFC93C" /><circle cx="84.0" cy="62.8" r="2.7" fill="#FFF3DC" /><circle cx="87.0" cy="65.0" r="2.7" fill="#FFF3DC" /><circle cx="85.9" cy="68.6" r="2.7" fill="#FFF3DC" /><circle cx="82.1" cy="68.6" r="2.7" fill="#FFF3DC" /><circle cx="81.0" cy="65.0" r="2.7" fill="#FFF3DC" /><circle cx="84" cy="66" r="2.2" fill="#FFC93C" /><circle cx="52.0" cy="20.4" r="3.1" fill="#FF8FB1" /><circle cx="55.4" cy="22.9" r="3.1" fill="#FF8FB1" /><circle cx="54.1" cy="26.9" r="3.1" fill="#FF8FB1" /><circle cx="49.9" cy="26.9" r="3.1" fill="#FF8FB1" /><circle cx="48.6" cy="22.9" r="3.1" fill="#FF8FB1" /><circle cx="52" cy="24" r="2.5" fill="#FF4F2E" /><circle cx="70.0" cy="18.4" r="3.1" fill="#FF8FB1" /><circle cx="73.4" cy="20.9" r="3.1" fill="#FF8FB1" /><circle cx="72.1" cy="24.9" r="3.1" fill="#FF8FB1" /><circle cx="67.9" cy="24.9" r="3.1" fill="#FF8FB1" /><circle cx="66.6" cy="20.9" r="3.1" fill="#FF8FB1" /><circle cx="70" cy="22" r="2.5" fill="#FF4F2E" /><circle cx="44.0" cy="44.4" r="3.1" fill="#FF8FB1" /><circle cx="47.4" cy="46.9" r="3.1" fill="#FF8FB1" /><circle cx="46.1" cy="50.9" r="3.1" fill="#FF8FB1" /><circle cx="41.9" cy="50.9" r="3.1" fill="#FF8FB1" /><circle cx="40.6" cy="46.9" r="3.1" fill="#FF8FB1" /><circle cx="44" cy="48" r="2.5" fill="#FF4F2E" /><circle cx="80.0" cy="46.4" r="3.1" fill="#FF8FB1" /><circle cx="83.4" cy="48.9" r="3.1" fill="#FF8FB1" /><circle cx="82.1" cy="52.9" r="3.1" fill="#FF8FB1" /><circle cx="77.9" cy="52.9" r="3.1" fill="#FF8FB1" /><circle cx="76.6" cy="48.9" r="3.1" fill="#FF8FB1" /><circle cx="80" cy="50" r="2.5" fill="#FF4F2E" /><circle cx="62.0" cy="76.4" r="3.1" fill="#FF8FB1" /><circle cx="65.4" cy="78.9" r="3.1" fill="#FF8FB1" /><circle cx="64.1" cy="82.9" r="3.1" fill="#FF8FB1" /><circle cx="59.9" cy="82.9" r="3.1" fill="#FF8FB1" /><circle cx="58.6" cy="78.9" r="3.1" fill="#FF8FB1" /><circle cx="62" cy="80" r="2.5" fill="#FF4F2E" /><circle cx="26.0" cy="42.4" r="3.1" fill="#FF8FB1" /><circle cx="29.4" cy="44.9" r="3.1" fill="#FF8FB1" /><circle cx="28.1" cy="48.9" r="3.1" fill="#FF8FB1" /><circle cx="23.9" cy="48.9" r="3.1" fill="#FF8FB1" /><circle cx="22.6" cy="44.9" r="3.1" fill="#FF8FB1" /><circle cx="26" cy="46" r="2.5" fill="#FF4F2E" /><circle cx="92.0" cy="36.4" r="3.1" fill="#FF8FB1" /><circle cx="95.4" cy="38.9" r="3.1" fill="#FF8FB1" /><circle cx="94.1" cy="42.9" r="3.1" fill="#FF8FB1" /><circle cx="89.9" cy="42.9" r="3.1" fill="#FF8FB1" /><circle cx="88.6" cy="38.9" r="3.1" fill="#FF8FB1" /><circle cx="92" cy="40" r="2.5" fill="#FF4F2E" /></g><g data-part="epanoui-3"><path d="M36 71 V66" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" fill="none" /><circle cx="36" cy="76" r="5" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><path d="M60 85 V80" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" fill="none" /><circle cx="60" cy="90" r="5" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><path d="M86 73 V68" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" fill="none" /><circle cx="86" cy="78" r="5" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><path d="M54 47 V42" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" fill="none" /><circle cx="54" cy="52" r="5" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><path d="M74 59 V54" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" fill="none" /><circle cx="74" cy="64" r="5" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /></g>
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

function Arbre2GrandEpanoui({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="epanoui-1"><circle cx="52.0" cy="27.2" r="2.4" fill="#FFF3DC" /><circle cx="54.7" cy="29.1" r="2.4" fill="#FFF3DC" /><circle cx="53.6" cy="32.3" r="2.4" fill="#FFF3DC" /><circle cx="50.4" cy="32.3" r="2.4" fill="#FFF3DC" /><circle cx="49.3" cy="29.1" r="2.4" fill="#FFF3DC" /><circle cx="52" cy="30" r="2.0" fill="#FFC93C" /><circle cx="68.0" cy="41.2" r="2.4" fill="#FFF3DC" /><circle cx="70.7" cy="43.1" r="2.4" fill="#FFF3DC" /><circle cx="69.6" cy="46.3" r="2.4" fill="#FFF3DC" /><circle cx="66.4" cy="46.3" r="2.4" fill="#FFF3DC" /><circle cx="65.3" cy="43.1" r="2.4" fill="#FFF3DC" /><circle cx="68" cy="44" r="2.0" fill="#FFC93C" /><circle cx="50.0" cy="59.2" r="2.4" fill="#FFF3DC" /><circle cx="52.7" cy="61.1" r="2.4" fill="#FFF3DC" /><circle cx="51.6" cy="64.3" r="2.4" fill="#FFF3DC" /><circle cx="48.4" cy="64.3" r="2.4" fill="#FFF3DC" /><circle cx="47.3" cy="61.1" r="2.4" fill="#FFF3DC" /><circle cx="50" cy="62" r="2.0" fill="#FFC93C" /><circle cx="70.0" cy="77.2" r="2.4" fill="#FFF3DC" /><circle cx="72.7" cy="79.1" r="2.4" fill="#FFF3DC" /><circle cx="71.6" cy="82.3" r="2.4" fill="#FFF3DC" /><circle cx="68.4" cy="82.3" r="2.4" fill="#FFF3DC" /><circle cx="67.3" cy="79.1" r="2.4" fill="#FFF3DC" /><circle cx="70" cy="80" r="2.0" fill="#FFC93C" /><circle cx="56.0" cy="95.2" r="2.4" fill="#FFF3DC" /><circle cx="58.7" cy="97.1" r="2.4" fill="#FFF3DC" /><circle cx="57.6" cy="100.3" r="2.4" fill="#FFF3DC" /><circle cx="54.4" cy="100.3" r="2.4" fill="#FFF3DC" /><circle cx="53.3" cy="97.1" r="2.4" fill="#FFF3DC" /><circle cx="56" cy="98" r="2.0" fill="#FFC93C" /></g><g data-part="epanoui-2"><circle cx="52.0" cy="27.2" r="2.4" fill="#FFF3DC" /><circle cx="54.7" cy="29.1" r="2.4" fill="#FFF3DC" /><circle cx="53.6" cy="32.3" r="2.4" fill="#FFF3DC" /><circle cx="50.4" cy="32.3" r="2.4" fill="#FFF3DC" /><circle cx="49.3" cy="29.1" r="2.4" fill="#FFF3DC" /><circle cx="52" cy="30" r="2.0" fill="#FFC93C" /><circle cx="68.0" cy="41.2" r="2.4" fill="#FFF3DC" /><circle cx="70.7" cy="43.1" r="2.4" fill="#FFF3DC" /><circle cx="69.6" cy="46.3" r="2.4" fill="#FFF3DC" /><circle cx="66.4" cy="46.3" r="2.4" fill="#FFF3DC" /><circle cx="65.3" cy="43.1" r="2.4" fill="#FFF3DC" /><circle cx="68" cy="44" r="2.0" fill="#FFC93C" /><circle cx="50.0" cy="59.2" r="2.4" fill="#FFF3DC" /><circle cx="52.7" cy="61.1" r="2.4" fill="#FFF3DC" /><circle cx="51.6" cy="64.3" r="2.4" fill="#FFF3DC" /><circle cx="48.4" cy="64.3" r="2.4" fill="#FFF3DC" /><circle cx="47.3" cy="61.1" r="2.4" fill="#FFF3DC" /><circle cx="50" cy="62" r="2.0" fill="#FFC93C" /><circle cx="70.0" cy="77.2" r="2.4" fill="#FFF3DC" /><circle cx="72.7" cy="79.1" r="2.4" fill="#FFF3DC" /><circle cx="71.6" cy="82.3" r="2.4" fill="#FFF3DC" /><circle cx="68.4" cy="82.3" r="2.4" fill="#FFF3DC" /><circle cx="67.3" cy="79.1" r="2.4" fill="#FFF3DC" /><circle cx="70" cy="80" r="2.0" fill="#FFC93C" /><circle cx="56.0" cy="95.2" r="2.4" fill="#FFF3DC" /><circle cx="58.7" cy="97.1" r="2.4" fill="#FFF3DC" /><circle cx="57.6" cy="100.3" r="2.4" fill="#FFF3DC" /><circle cx="54.4" cy="100.3" r="2.4" fill="#FFF3DC" /><circle cx="53.3" cy="97.1" r="2.4" fill="#FFF3DC" /><circle cx="56" cy="98" r="2.0" fill="#FFC93C" /><circle cx="60.0" cy="14.8" r="2.7" fill="#FFC93C" /><circle cx="63.0" cy="17.0" r="2.7" fill="#FFC93C" /><circle cx="61.9" cy="20.6" r="2.7" fill="#FFC93C" /><circle cx="58.1" cy="20.6" r="2.7" fill="#FFC93C" /><circle cx="57.0" cy="17.0" r="2.7" fill="#FFC93C" /><circle cx="60" cy="18" r="2.2" fill="#FFF3DC" /><circle cx="46.0" cy="42.8" r="2.7" fill="#FFC93C" /><circle cx="49.0" cy="45.0" r="2.7" fill="#FFC93C" /><circle cx="47.9" cy="48.6" r="2.7" fill="#FFC93C" /><circle cx="44.1" cy="48.6" r="2.7" fill="#FFC93C" /><circle cx="43.0" cy="45.0" r="2.7" fill="#FFC93C" /><circle cx="46" cy="46" r="2.2" fill="#FFF3DC" /><circle cx="73.0" cy="58.8" r="2.7" fill="#FFC93C" /><circle cx="76.0" cy="61.0" r="2.7" fill="#FFC93C" /><circle cx="74.9" cy="64.6" r="2.7" fill="#FFC93C" /><circle cx="71.1" cy="64.6" r="2.7" fill="#FFC93C" /><circle cx="70.0" cy="61.0" r="2.7" fill="#FFC93C" /><circle cx="73" cy="62" r="2.2" fill="#FFF3DC" /><circle cx="49.0" cy="82.8" r="2.7" fill="#FFC93C" /><circle cx="52.0" cy="85.0" r="2.7" fill="#FFC93C" /><circle cx="50.9" cy="88.6" r="2.7" fill="#FFC93C" /><circle cx="47.1" cy="88.6" r="2.7" fill="#FFC93C" /><circle cx="46.0" cy="85.0" r="2.7" fill="#FFC93C" /><circle cx="49" cy="86" r="2.2" fill="#FFF3DC" /><circle cx="66.0" cy="102.8" r="2.7" fill="#FFC93C" /><circle cx="69.0" cy="105.0" r="2.7" fill="#FFC93C" /><circle cx="67.9" cy="108.6" r="2.7" fill="#FFC93C" /><circle cx="64.1" cy="108.6" r="2.7" fill="#FFC93C" /><circle cx="63.0" cy="105.0" r="2.7" fill="#FFC93C" /><circle cx="66" cy="106" r="2.2" fill="#FFF3DC" /><circle cx="62.0" cy="30.8" r="2.7" fill="#FFC93C" /><circle cx="65.0" cy="33.0" r="2.7" fill="#FFC93C" /><circle cx="63.9" cy="36.6" r="2.7" fill="#FFC93C" /><circle cx="60.1" cy="36.6" r="2.7" fill="#FFC93C" /><circle cx="59.0" cy="33.0" r="2.7" fill="#FFC93C" /><circle cx="62" cy="34" r="2.2" fill="#FFF3DC" /></g><g data-part="epanoui-3"><path d="M48 65 V60" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" fill="none" /><circle cx="48" cy="70" r="5" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.2" /><path d="M72 87 V82" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" fill="none" /><circle cx="72" cy="92" r="5" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.2" /><path d="M60 47 V42" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" fill="none" /><circle cx="60" cy="52" r="5" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.2" /></g>
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

function Arbre3GrandEpanoui({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="epanoui-1"><circle cx="36.0" cy="67.0" r="2.5" fill="#FFF3DC" /><circle cx="38.9" cy="69.1" r="2.5" fill="#FFF3DC" /><circle cx="37.8" cy="72.4" r="2.5" fill="#FFF3DC" /><circle cx="34.2" cy="72.4" r="2.5" fill="#FFF3DC" /><circle cx="33.1" cy="69.1" r="2.5" fill="#FFF3DC" /><circle cx="36" cy="70" r="2.1" fill="#FFC93C" /><circle cx="50.0" cy="81.0" r="2.5" fill="#FFF3DC" /><circle cx="52.9" cy="83.1" r="2.5" fill="#FFF3DC" /><circle cx="51.8" cy="86.4" r="2.5" fill="#FFF3DC" /><circle cx="48.2" cy="86.4" r="2.5" fill="#FFF3DC" /><circle cx="47.1" cy="83.1" r="2.5" fill="#FFF3DC" /><circle cx="50" cy="84" r="2.1" fill="#FFC93C" /><circle cx="80.0" cy="59.0" r="2.5" fill="#FFF3DC" /><circle cx="82.9" cy="61.1" r="2.5" fill="#FFF3DC" /><circle cx="81.8" cy="64.4" r="2.5" fill="#FFF3DC" /><circle cx="78.2" cy="64.4" r="2.5" fill="#FFF3DC" /><circle cx="77.1" cy="61.1" r="2.5" fill="#FFF3DC" /><circle cx="80" cy="62" r="2.1" fill="#FFC93C" /><circle cx="86.0" cy="75.0" r="2.5" fill="#FFF3DC" /><circle cx="88.9" cy="77.1" r="2.5" fill="#FFF3DC" /><circle cx="87.8" cy="80.4" r="2.5" fill="#FFF3DC" /><circle cx="84.2" cy="80.4" r="2.5" fill="#FFF3DC" /><circle cx="83.1" cy="77.1" r="2.5" fill="#FFF3DC" /><circle cx="86" cy="78" r="2.1" fill="#FFC93C" /><circle cx="56.0" cy="31.0" r="2.5" fill="#FFF3DC" /><circle cx="58.9" cy="33.1" r="2.5" fill="#FFF3DC" /><circle cx="57.8" cy="36.4" r="2.5" fill="#FFF3DC" /><circle cx="54.2" cy="36.4" r="2.5" fill="#FFF3DC" /><circle cx="53.1" cy="33.1" r="2.5" fill="#FFF3DC" /><circle cx="56" cy="34" r="2.1" fill="#FFC93C" /><circle cx="68.0" cy="43.0" r="2.5" fill="#FFF3DC" /><circle cx="70.9" cy="45.1" r="2.5" fill="#FFF3DC" /><circle cx="69.8" cy="48.4" r="2.5" fill="#FFF3DC" /><circle cx="66.2" cy="48.4" r="2.5" fill="#FFF3DC" /><circle cx="65.1" cy="45.1" r="2.5" fill="#FFF3DC" /><circle cx="68" cy="46" r="2.1" fill="#FFC93C" /></g><g data-part="epanoui-2"><circle cx="36.0" cy="67.0" r="2.5" fill="#FFF3DC" /><circle cx="38.9" cy="69.1" r="2.5" fill="#FFF3DC" /><circle cx="37.8" cy="72.4" r="2.5" fill="#FFF3DC" /><circle cx="34.2" cy="72.4" r="2.5" fill="#FFF3DC" /><circle cx="33.1" cy="69.1" r="2.5" fill="#FFF3DC" /><circle cx="36" cy="70" r="2.1" fill="#FFC93C" /><circle cx="50.0" cy="81.0" r="2.5" fill="#FFF3DC" /><circle cx="52.9" cy="83.1" r="2.5" fill="#FFF3DC" /><circle cx="51.8" cy="86.4" r="2.5" fill="#FFF3DC" /><circle cx="48.2" cy="86.4" r="2.5" fill="#FFF3DC" /><circle cx="47.1" cy="83.1" r="2.5" fill="#FFF3DC" /><circle cx="50" cy="84" r="2.1" fill="#FFC93C" /><circle cx="80.0" cy="59.0" r="2.5" fill="#FFF3DC" /><circle cx="82.9" cy="61.1" r="2.5" fill="#FFF3DC" /><circle cx="81.8" cy="64.4" r="2.5" fill="#FFF3DC" /><circle cx="78.2" cy="64.4" r="2.5" fill="#FFF3DC" /><circle cx="77.1" cy="61.1" r="2.5" fill="#FFF3DC" /><circle cx="80" cy="62" r="2.1" fill="#FFC93C" /><circle cx="86.0" cy="75.0" r="2.5" fill="#FFF3DC" /><circle cx="88.9" cy="77.1" r="2.5" fill="#FFF3DC" /><circle cx="87.8" cy="80.4" r="2.5" fill="#FFF3DC" /><circle cx="84.2" cy="80.4" r="2.5" fill="#FFF3DC" /><circle cx="83.1" cy="77.1" r="2.5" fill="#FFF3DC" /><circle cx="86" cy="78" r="2.1" fill="#FFC93C" /><circle cx="56.0" cy="31.0" r="2.5" fill="#FFF3DC" /><circle cx="58.9" cy="33.1" r="2.5" fill="#FFF3DC" /><circle cx="57.8" cy="36.4" r="2.5" fill="#FFF3DC" /><circle cx="54.2" cy="36.4" r="2.5" fill="#FFF3DC" /><circle cx="53.1" cy="33.1" r="2.5" fill="#FFF3DC" /><circle cx="56" cy="34" r="2.1" fill="#FFC93C" /><circle cx="68.0" cy="43.0" r="2.5" fill="#FFF3DC" /><circle cx="70.9" cy="45.1" r="2.5" fill="#FFF3DC" /><circle cx="69.8" cy="48.4" r="2.5" fill="#FFF3DC" /><circle cx="66.2" cy="48.4" r="2.5" fill="#FFF3DC" /><circle cx="65.1" cy="45.1" r="2.5" fill="#FFF3DC" /><circle cx="68" cy="46" r="2.1" fill="#FFC93C" /><circle cx="28.0" cy="78.6" r="2.9" fill="#FF4F2E" /><circle cx="31.2" cy="80.9" r="2.9" fill="#FF4F2E" /><circle cx="30.0" cy="84.8" r="2.9" fill="#FF4F2E" /><circle cx="26.0" cy="84.8" r="2.9" fill="#FF4F2E" /><circle cx="24.8" cy="80.9" r="2.9" fill="#FF4F2E" /><circle cx="28" cy="82" r="2.4" fill="#FFC93C" /><circle cx="44.0" cy="56.6" r="2.9" fill="#FF4F2E" /><circle cx="47.2" cy="58.9" r="2.9" fill="#FF4F2E" /><circle cx="46.0" cy="62.8" r="2.9" fill="#FF4F2E" /><circle cx="42.0" cy="62.8" r="2.9" fill="#FF4F2E" /><circle cx="40.8" cy="58.9" r="2.9" fill="#FF4F2E" /><circle cx="44" cy="60" r="2.4" fill="#FFC93C" /><circle cx="72.0" cy="72.6" r="2.9" fill="#FF4F2E" /><circle cx="75.2" cy="74.9" r="2.9" fill="#FF4F2E" /><circle cx="74.0" cy="78.8" r="2.9" fill="#FF4F2E" /><circle cx="70.0" cy="78.8" r="2.9" fill="#FF4F2E" /><circle cx="68.8" cy="74.9" r="2.9" fill="#FF4F2E" /><circle cx="72" cy="76" r="2.4" fill="#FFC93C" /><circle cx="92.0" cy="62.6" r="2.9" fill="#FF4F2E" /><circle cx="95.2" cy="64.9" r="2.9" fill="#FF4F2E" /><circle cx="94.0" cy="68.8" r="2.9" fill="#FF4F2E" /><circle cx="90.0" cy="68.8" r="2.9" fill="#FF4F2E" /><circle cx="88.8" cy="64.9" r="2.9" fill="#FF4F2E" /><circle cx="92" cy="66" r="2.4" fill="#FFC93C" /><circle cx="62.0" cy="20.6" r="2.9" fill="#FF4F2E" /><circle cx="65.2" cy="22.9" r="2.9" fill="#FF4F2E" /><circle cx="64.0" cy="26.8" r="2.9" fill="#FF4F2E" /><circle cx="60.0" cy="26.8" r="2.9" fill="#FF4F2E" /><circle cx="58.8" cy="22.9" r="2.9" fill="#FF4F2E" /><circle cx="62" cy="24" r="2.4" fill="#FFC93C" /><circle cx="48.0" cy="36.6" r="2.9" fill="#FF4F2E" /><circle cx="51.2" cy="38.9" r="2.9" fill="#FF4F2E" /><circle cx="50.0" cy="42.8" r="2.9" fill="#FF4F2E" /><circle cx="46.0" cy="42.8" r="2.9" fill="#FF4F2E" /><circle cx="44.8" cy="38.9" r="2.9" fill="#FF4F2E" /><circle cx="48" cy="40" r="2.4" fill="#FFC93C" /><circle cx="76.0" cy="36.6" r="2.9" fill="#FF4F2E" /><circle cx="79.2" cy="38.9" r="2.9" fill="#FF4F2E" /><circle cx="78.0" cy="42.8" r="2.9" fill="#FF4F2E" /><circle cx="74.0" cy="42.8" r="2.9" fill="#FF4F2E" /><circle cx="72.8" cy="38.9" r="2.9" fill="#FF4F2E" /><circle cx="76" cy="40" r="2.4" fill="#FFC93C" /></g><g data-part="epanoui-3"><path d="M32 96 L27 108 M32 96 L37 108" stroke="#1F1A17" strokeWidth="1.4" strokeLinecap="round" fill="none" /><circle cx="27" cy="110" r="4" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="37" cy="110" r="4" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><path d="M84 86 L79 98 M84 86 L89 98" stroke="#1F1A17" strokeWidth="1.4" strokeLinecap="round" fill="none" /><circle cx="79" cy="100" r="4" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="89" cy="100" r="4" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><path d="M58 82 L53 94 M58 82 L63 94" stroke="#1F1A17" strokeWidth="1.4" strokeLinecap="round" fill="none" /><circle cx="53" cy="96" r="4" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="63" cy="96" r="4" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /></g>
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

function Arbre4Grand({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tronc"><path transform="translate(11.4 29.64) scale(0.81)" d="M58 156 C 52 142, 66 130, 58 114 C 54 106, 48 98, 42 90" stroke="#1F1A17" strokeWidth="9.88" strokeLinecap="round" fill="none" /><path transform="translate(11.4 29.64) scale(0.81)" d="M60 118 C 68 110, 74 102, 80 92" stroke="#1F1A17" strokeWidth="7.41" strokeLinecap="round" fill="none" /></g><g data-part="feuillage"><ellipse transform="translate(11.4 29.64) scale(0.81)" cx="32.5" cy="75" rx="27.5" ry="18.8" fill="#1B6B45" /><ellipse transform="translate(11.4 29.64) scale(0.81)" cx="85" cy="72.5" rx="30" ry="20" fill="#1B6B45" /><ellipse transform="translate(11.4 29.64) scale(0.81)" cx="60" cy="57.5" rx="32.5" ry="22.5" fill="#1B6B45" /><ellipse transform="translate(11.4 29.64) scale(0.81)" cx="52.5" cy="82.5" rx="25" ry="15" fill="#1B6B45" /><ellipse transform="translate(11.4 29.64) scale(0.81)" cx="75" cy="85" rx="22.5" ry="13.8" fill="#1B6B45" /><ellipse cx="90.1" cy="70" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(-15 90.1 70)" fill="#FFF3DC" /><ellipse cx="100.1" cy="75.2" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(-7 100.1 75.2)" fill="#FFF3DC" /><ellipse cx="29.4" cy="68.5" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(-2 29.4 68.5)" fill="#FFF3DC" /><ellipse cx="55.8" cy="79.2" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(17 55.8 79.2)" fill="#FFF3DC" /><ellipse cx="77.6" cy="79.5" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(7 77.6 79.5)" fill="#FFF3DC" /><ellipse cx="72.9" cy="59" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(-33 72.9 59)" fill="#FFF3DC" /><ellipse cx="67.8" cy="86.8" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(7 67.8 86.8)" fill="#FFF3DC" /><ellipse cx="30.7" cy="65.4" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(-21 30.7 65.4)" fill="#FFF3DC" /><ellipse cx="45.7" cy="86.7" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(-39 45.7 86.7)" fill="#FFF3DC" /><ellipse cx="71.9" cy="84.2" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(17 71.9 84.2)" fill="#FFF3DC" /><ellipse cx="87.8" cy="71.1" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(31 87.8 71.1)" fill="#FFF3DC" /><ellipse cx="46.1" cy="69.1" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(9 46.1 69.1)" fill="#FFF3DC" /><ellipse cx="84.6" cy="67.1" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(32 84.6 67.1)" fill="#FFF3DC" /><ellipse cx="97.9" cy="72" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(25 97.9 72)" fill="#FFF3DC" /><ellipse cx="82.9" cy="66.6" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(-27 82.9 66.6)" fill="#FFF3DC" /><ellipse cx="73.4" cy="51.5" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(19 73.4 51.5)" fill="#FFF3DC" /><ellipse cx="100.3" cy="70" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(-5 100.3 70)" fill="#FFF3DC" /><ellipse cx="58.9" cy="85.7" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(-38 58.9 85.7)" fill="#FFF3DC" /><ellipse cx="99.2" cy="64.6" rx="4.5" ry="1.3" transform="translate(11.4 29.64) scale(0.81) rotate(-12 99.2 64.6)" fill="#FFF3DC" /></g>
    </svg>
  );
}

function Arbre4GrandEpanoui({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="epanoui-1"><circle transform="translate(11.4 29.64) scale(0.81)" cx="34" cy="63.4" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="36.5" cy="65.2" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="35.5" cy="68.1" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="32.5" cy="68.1" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="31.5" cy="65.2" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="34" cy="66" r="1.8" fill="#FFC93C" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="60" cy="49.4" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="62.5" cy="51.2" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="61.5" cy="54.1" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="58.5" cy="54.1" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="57.5" cy="51.2" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="60" cy="52" r="1.8" fill="#FFC93C" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="84" cy="59.4" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="86.5" cy="61.2" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="85.5" cy="64.1" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="82.5" cy="64.1" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="81.5" cy="61.2" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="84" cy="62" r="1.8" fill="#FFC93C" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="48" cy="79.4" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="50.5" cy="81.2" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="49.5" cy="84.1" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="46.5" cy="84.1" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="45.5" cy="81.2" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="48" cy="82" r="1.8" fill="#FFC93C" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="74" cy="81.4" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="76.5" cy="83.2" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="75.5" cy="86.1" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="72.5" cy="86.1" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="71.5" cy="83.2" r="2.2" fill="#FFF3DC" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="74" cy="84" r="1.8" fill="#FFC93C" /></g><g data-part="epanoui-2"><circle transform="translate(11.4 29.64) scale(0.81)" cx="26" cy="71" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="28.9" cy="73.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="27.8" cy="76.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="24.2" cy="76.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="23.1" cy="73.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="26" cy="74" r="2.1" fill="#FFC93C" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="44" cy="55" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="46.9" cy="57.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="45.8" cy="60.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="42.2" cy="60.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="41.1" cy="57.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="44" cy="58" r="2.1" fill="#FFC93C" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="70" cy="47" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="72.9" cy="49.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="71.8" cy="52.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="68.2" cy="52.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="67.1" cy="49.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="70" cy="50" r="2.1" fill="#FFC93C" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="92" cy="69" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="94.9" cy="71.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="93.8" cy="74.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="90.2" cy="74.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="89.1" cy="71.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="92" cy="72" r="2.1" fill="#FFC93C" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="58" cy="85" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="60.9" cy="87.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="59.8" cy="90.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="56.2" cy="90.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="55.1" cy="87.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="58" cy="88" r="2.1" fill="#FFC93C" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="38" cy="87" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="40.9" cy="89.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="39.8" cy="92.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="36.2" cy="92.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="35.1" cy="89.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="38" cy="90" r="2.1" fill="#FFC93C" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="82" cy="83" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="84.9" cy="85.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="83.8" cy="88.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="80.2" cy="88.4" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="79.1" cy="85.1" r="2.5" fill="#FFFFFF" /><circle transform="translate(11.4 29.64) scale(0.81)" cx="82" cy="86" r="2.1" fill="#FFC93C" /></g><g data-part="epanoui-3"><ellipse cx="30" cy="86" rx="3.6" ry="4.8" transform="translate(11.4 29.64) scale(0.81) rotate(-20 30 86)" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.48" /><ellipse cx="38" cy="90" rx="3.6" ry="4.8" transform="translate(11.4 29.64) scale(0.81) rotate(-20 38 90)" fill="#1F1A17" stroke="#1F1A17" strokeWidth="1.48" /><ellipse cx="62" cy="92" rx="3.6" ry="4.8" transform="translate(11.4 29.64) scale(0.81) rotate(-20 62 92)" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.48" /><ellipse cx="68" cy="90" rx="3.6" ry="4.8" transform="translate(11.4 29.64) scale(0.81) rotate(-20 68 90)" fill="#1F1A17" stroke="#1F1A17" strokeWidth="1.48" /><ellipse cx="88" cy="84" rx="3.6" ry="4.8" transform="translate(11.4 29.64) scale(0.81) rotate(-20 88 84)" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.48" /><ellipse cx="50" cy="62" rx="3.6" ry="4.8" transform="translate(11.4 29.64) scale(0.81) rotate(-20 50 62)" fill="#1F1A17" stroke="#1F1A17" strokeWidth="1.48" /><ellipse cx="78" cy="60" rx="3.6" ry="4.8" transform="translate(11.4 29.64) scale(0.81) rotate(-20 78 60)" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.48" /></g>
    </svg>
  );
}

function Arbre4Jeune({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tronc"><path d="M60 156 C 60 140, 54 132, 58 118 M58 126 C 62 122, 66 120, 68 112" stroke="#1F1A17" strokeWidth="5" strokeLinecap="round" /></g><g data-part="feuillage"><ellipse cx="48.8" cy="102.4" rx="13.2" ry="9" fill="#1B6B45" /><ellipse cx="74" cy="101.2" rx="14.4" ry="9.6" fill="#1B6B45" /><ellipse cx="62" cy="94" rx="15.6" ry="10.8" fill="#1B6B45" /><ellipse cx="58.4" cy="106" rx="12" ry="7.2" fill="#1B6B45" /><ellipse cx="69.2" cy="107.2" rx="10.8" ry="6.6" fill="#1B6B45" /><ellipse cx="76.4" cy="100" rx="2.5" ry="1.3" transform="rotate(-15 76.4 100)" fill="#FFF3DC" /><ellipse cx="81.2" cy="102.5" rx="2.5" ry="1.3" transform="rotate(-7 81.2 102.5)" fill="#FFF3DC" /><ellipse cx="47.3" cy="99.3" rx="2.5" ry="1.3" transform="rotate(-2 47.3 99.3)" fill="#FFF3DC" /><ellipse cx="60" cy="104.4" rx="2.5" ry="1.3" transform="rotate(17 60 104.4)" fill="#FFF3DC" /><ellipse cx="70.5" cy="104.6" rx="2.5" ry="1.3" transform="rotate(7 70.5 104.6)" fill="#FFF3DC" /><ellipse cx="68.2" cy="94.7" rx="2.5" ry="1.3" transform="rotate(-33 68.2 94.7)" fill="#FFF3DC" /><ellipse cx="65.7" cy="108.1" rx="2.5" ry="1.3" transform="rotate(7 65.7 108.1)" fill="#FFF3DC" /></g>
    </svg>
  );
}

function Arbre4Pousse({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M60 156 V128" stroke="#1F1A17" strokeWidth="4" strokeLinecap="round" /></g><g data-part="feuilles"><ellipse cx="51" cy="131" rx="10" ry="6" transform="rotate(-25 51 131)" fill="#1B6B45" /><ellipse cx="69" cy="127" rx="10" ry="6" transform="rotate(25 69 127)" fill="#2FBF71" /></g>
    </svg>
  );
}

function Arbre5Grand({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tronc"><rect x="56.6" y="132.2" width="6.8" height="23.8" fill="#1F1A17" /></g><g data-part="feuillage"><path d="M 19.2 137.3 L 60 91.4 L 100.8 137.3 Q 60 129.06 19.2 137.3 Z" fill="#1B6B45" /><path d="M 28.21 108.83 L 60 62.92 L 91.79 108.83 Q 60 100.58 28.21 108.83 Z" fill="#1B6B45" /><path d="M 37.14 80.35 L 60 34.45 L 82.87 80.35 Q 60 72.11 37.14 80.35 Z" fill="#1B6B45" /><path d="M 46.15 51.96 L 60 6.06 L 73.85 51.96 Q 60 43.63 46.15 51.96 Z" fill="#1B6B45" /></g>
    </svg>
  );
}

function Arbre5GrandEpanoui({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="epanoui-1"><ellipse cx="46.4" cy="127.1" rx="1.87" ry="2.89" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="73.6" cy="125.4" rx="1.87" ry="2.89" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="53.2" cy="105" rx="1.87" ry="2.89" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="68.5" cy="103.3" rx="1.87" ry="2.89" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /></g><g data-part="epanoui-2"><path d="M 47.67 84.6 Q 47.25 79.5 49.8 76.95 Q 52.35 79.5 51.92 84.6 Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.1" /><path d="M 68.08 82.9 Q 67.65 77.8 70.2 75.25 Q 72.75 77.8 72.33 82.9 Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.1" /><path d="M 57.88 60.8 Q 57.45 55.7 60 53.15 Q 62.55 55.7 62.12 60.8 Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.1" /></g><g data-part="epanoui-3"><path d="M 45.12 96.5 Q 44.7 88.85 48.1 85.45 Q 51.5 88.85 51.08 96.5 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><path d="M 45.55 93.1 H 50.65 M 45.55 89.7 H 50.65" stroke="#1F1A17" strokeWidth="1" fill="none" /><path d="M 68.92 94.8 Q 68.5 87.15 71.9 83.75 Q 75.3 87.15 74.88 94.8 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><path d="M 69.35 91.4 H 74.45 M 69.35 88 H 74.45" stroke="#1F1A17" strokeWidth="1" fill="none" /><path d="M 51.92 74.4 Q 51.5 66.75 54.9 63.35 Q 58.3 66.75 57.88 74.4 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><path d="M 52.35 71 H 57.45 M 52.35 67.6 H 57.45" stroke="#1F1A17" strokeWidth="1" fill="none" /><path d="M 63.83 72.7 Q 63.4 65.05 66.8 61.65 Q 70.2 65.05 69.78 72.7 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><path d="M 64.25 69.3 H 69.35 M 64.25 65.9 H 69.35" stroke="#1F1A17" strokeWidth="1" fill="none" /><path d="M 57.02 54 Q 56.6 46.35 60 42.95 Q 63.4 46.35 62.98 54 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /><path d="M 57.45 50.6 H 62.55 M 57.45 47.2 H 62.55" stroke="#1F1A17" strokeWidth="1" fill="none" /></g>
    </svg>
  );
}

function Arbre5Jeune({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tronc"><rect x="57" y="128" width="6" height="28" fill="#1F1A17" /></g><g data-part="feuillage"><path d="M34 134 L60 100 L86 134 Q 60 127.9 34 134 Z" fill="#1B6B45" /><path d="M39.7 112.9 L60 78.9 L80.3 112.9 Q 60 106.8 39.7 112.9 Z" fill="#1B6B45" /><path d="M45.4 91.8 L60 57.8 L74.6 91.8 Q 60 85.7 45.4 91.8 Z" fill="#1B6B45" /></g>
    </svg>
  );
}

function Arbre5Pousse({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M60 156 V136" stroke="#1F1A17" strokeWidth="4" strokeLinecap="round" /></g><g data-part="feuilles"><path d="M48 140 L60 118 L72 140 Q60 136 48 140 Z" fill="#1B6B45" /></g>
    </svg>
  );
}

function Arbre6Grand({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tronc"><path transform="translate(9 23.4) scale(0.85)" d="M60 156 V110 M60 126 L34 94 M60 120 L88 90 M60 110 L56 72" stroke="#1F1A17" strokeWidth="7.06" strokeLinecap="round" /></g><g data-part="feuillage"><path transform="translate(9 23.4) scale(0.85) translate(26 86) rotate(0) scale(1.25)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#1B6B45" /><path transform="translate(9 23.4) scale(0.85) translate(42 72) rotate(-20) scale(1.25)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#2FBF71" /><path transform="translate(9 23.4) scale(0.85) translate(60 60) rotate(5) scale(1.25)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#1B6B45" /><path transform="translate(9 23.4) scale(0.85) translate(80 70) rotate(20) scale(1.25)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#2FBF71" /><path transform="translate(9 23.4) scale(0.85) translate(94 84) rotate(10) scale(1.25)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#1B6B45" /><path transform="translate(9 23.4) scale(0.85) translate(34 98) rotate(-30) scale(1.25)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#2FBF71" /><path transform="translate(9 23.4) scale(0.85) translate(86 96) rotate(30) scale(1.25)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#1B6B45" /><path transform="translate(9 23.4) scale(0.85) translate(52 86) rotate(-10) scale(1.25)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#2FBF71" /><path transform="translate(9 23.4) scale(0.85) translate(70 84) rotate(12) scale(1.25)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#1B6B45" /><path transform="translate(9 23.4) scale(0.85) translate(60 74) rotate(0) scale(1.25)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#2FBF71" /></g>
    </svg>
  );
}

function Arbre6GrandEpanoui({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="epanoui-1"><path transform="translate(9 23.4) scale(0.85) translate(40 80) scale(0.6)" d="M0 -9 Q 1 -6 3 -4 Q 7 2 2 5 Q 0 6 -2 5 Q -7 2 -3 -4 Q -1 -6 0 -9 Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="2.35" /><path transform="translate(9 23.4) scale(0.85) translate(78 76) scale(0.6)" d="M0 -9 Q 1 -6 3 -4 Q 7 2 2 5 Q 0 6 -2 5 Q -7 2 -3 -4 Q -1 -6 0 -9 Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="2.35" /></g><g data-part="epanoui-2"><path transform="translate(9 23.4) scale(0.85) translate(30 92) scale(0.75)" d="M0 -9 Q 1 -6 3 -4 Q 7 2 2 5 Q 0 6 -2 5 Q -7 2 -3 -4 Q -1 -6 0 -9 Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.88" /><path transform="translate(9 23.4) scale(0.85) translate(56 66) scale(0.75)" d="M0 -9 Q 1 -6 3 -4 Q 7 2 2 5 Q 0 6 -2 5 Q -7 2 -3 -4 Q -1 -6 0 -9 Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.88" /><path transform="translate(9 23.4) scale(0.85) translate(88 90) scale(0.75)" d="M0 -9 Q 1 -6 3 -4 Q 7 2 2 5 Q 0 6 -2 5 Q -7 2 -3 -4 Q -1 -6 0 -9 Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.88" /><path transform="translate(9 23.4) scale(0.85) translate(66 86) scale(0.75)" d="M0 -9 Q 1 -6 3 -4 Q 7 2 2 5 Q 0 6 -2 5 Q -7 2 -3 -4 Q -1 -6 0 -9 Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.88" /></g><g data-part="epanoui-3"><path transform="translate(9 23.4) scale(0.85) translate(34 96) scale(1)" d="M0 -9 Q 1 -6 3 -4 Q 7 2 2 5 Q 0 6 -2 5 Q -7 2 -3 -4 Q -1 -6 0 -9 Z" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.41" /><path transform="translate(9 23.4) scale(0.85) translate(50 80) scale(1)" d="M0 -9 Q 1 -6 3 -4 Q 7 2 2 5 Q 0 6 -2 5 Q -7 2 -3 -4 Q -1 -6 0 -9 Z" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.41" /><path transform="translate(9 23.4) scale(0.85) translate(70 72) scale(1)" d="M0 -9 Q 1 -6 3 -4 Q 7 2 2 5 Q 0 6 -2 5 Q -7 2 -3 -4 Q -1 -6 0 -9 Z" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.41" /><path transform="translate(9 23.4) scale(0.85) translate(86 94) scale(1)" d="M0 -9 Q 1 -6 3 -4 Q 7 2 2 5 Q 0 6 -2 5 Q -7 2 -3 -4 Q -1 -6 0 -9 Z" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.41" /><path transform="translate(9 23.4) scale(0.85) translate(60 98) scale(1)" d="M0 -9 Q 1 -6 3 -4 Q 7 2 2 5 Q 0 6 -2 5 Q -7 2 -3 -4 Q -1 -6 0 -9 Z" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.41" /></g>
    </svg>
  );
}

function Arbre6Jeune({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tronc"><path d="M60 156 V130.7 M60 139.5 L45.7 121.9 M60 136.2 L75.4 119.7 M60 130.7 L57.8 109.8" stroke="#1F1A17" strokeWidth="4.7" strokeLinecap="round" /></g><g data-part="feuillage"><path transform="translate(41.3 117.5) rotate(0) scale(0.6875)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#1B6B45" /><path transform="translate(50.1 109.8) rotate(-20) scale(0.6875)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#2FBF71" /><path transform="translate(60 103.2) rotate(5) scale(0.6875)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#1B6B45" /><path transform="translate(71 108.7) rotate(20) scale(0.6875)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#2FBF71" /><path transform="translate(78.7 116.4) rotate(10) scale(0.6875)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#1B6B45" /><path transform="translate(45.7 124.1) rotate(-30) scale(0.6875)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#2FBF71" /><path transform="translate(74.3 123) rotate(30) scale(0.6875)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#1B6B45" /><path transform="translate(55.6 117.5) rotate(-10) scale(0.6875)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#2FBF71" /><path transform="translate(65.5 116.4) rotate(12) scale(0.6875)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#1B6B45" /><path transform="translate(60 110.9) rotate(0) scale(0.6875)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#2FBF71" /></g>
    </svg>
  );
}

function Arbre6Pousse({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={120} height={160} viewBox="0 0 120 160" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M60 156 V130" stroke="#1F1A17" strokeWidth="4" strokeLinecap="round" /></g><g data-part="feuilles"><path transform="translate(52 130) rotate(-30) scale(0.7)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#1B6B45" /><path transform="translate(68 126) rotate(30) scale(0.7)" d="M0 10 C -4 6, -14 6, -14 -2 C -10 -4, -8 -2, -6 -4 C -8 -10, -4 -16, 0 -16 C 4 -16, 8 -10, 6 -4 C 8 -2, 10 -4, 14 -2 C 14 6, 4 6, 0 10 Z" fill="#2FBF71" /></g>
    </svg>
  );
}

function Arrosage({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="arrosoir"><g transform="rotate(72 30 36)"><path d="M14 30 C 8 30, 8 42, 16 42" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" fill="none" /><path d="M20 22 C 22 14, 34 14, 36 22" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" fill="none" /><rect x="16" y="22" width="22" height="24" rx="3" fill="#FFC93C" /><path d="M36 40 L50 26" stroke="#1F1A17" strokeWidth="4" strokeLinecap="round" /><ellipse cx="51.5" cy="24.5" rx="3" ry="6.5" transform="rotate(45 51.5 24.5)" fill="#1F1A17" /><rect x="16" y="22" width="22" height="24" rx="3" stroke="#1F1A17" strokeWidth="1.5" fill="none" /></g></g><g data-part="gouttes"><g data-part="goutte-1"><path d="M48 57 Q 51.5 62 48 65 Q 44.5 62 48 57 Z" fill="#8FB2FF" stroke="#1F1A17" strokeWidth="1" /></g><g data-part="goutte-2"><path d="M54 61 Q 57.5 66 54 69 Q 50.5 66 54 61 Z" fill="#8FB2FF" stroke="#1F1A17" strokeWidth="1" /></g><g data-part="goutte-3"><path d="M45 64 Q 48.5 69 45 72 Q 41.5 69 45 64 Z" fill="#8FB2FF" stroke="#1F1A17" strokeWidth="1" /></g><g data-part="goutte-4"><path d="M51 69 Q 54.5 74 51 77 Q 47.5 74 51 69 Z" fill="#8FB2FF" stroke="#1F1A17" strokeWidth="1" /></g><g data-part="goutte-5"><path d="M57 67 Q 60.5 72 57 75 Q 53.5 72 57 67 Z" fill="#8FB2FF" stroke="#1F1A17" strokeWidth="1" /></g></g>
    </svg>
  );
}

function BadgeArrosage({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="12" cy="12" r="11" fill="#2D4BFF" /></g><g data-part="objet"><g transform="translate(-0.5 -0.5) scale(0.39)"><path d="M14 30 C 8 30, 8 42, 16 42" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" fill="none" /><path d="M20 22 C 22 14, 34 14, 36 22" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" fill="none" /><rect x="16" y="22" width="22" height="24" rx="3" fill="#FFC93C" /><path d="M36 40 L50 26" stroke="#FFF3DC" strokeWidth="4" strokeLinecap="round" /><ellipse cx="51.5" cy="24.5" rx="3" ry="6.5" transform="rotate(45 51.5 24.5)" fill="#FFF3DC" /></g><path d="M17.5 15.5 Q 19 17.5 17.5 19 Q 16 17.5 17.5 15.5 Z" fill="#FFF3DC" /></g>
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

function Champignons({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="pieds"><rect x="16" y="56" width="8" height="22" rx="3" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /><rect x="36" y="64" width="6" height="14" rx="3" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="chapeaux"><path d="M6 58 C 6 40, 34 40, 34 58 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /><path d="M30 66 C 30 54, 48 54, 48 66 Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="points"><circle cx="14" cy="50" r="2.2" fill="#FFF3DC" /><circle cx="24" cy="48" r="2.6" fill="#FFF3DC" /><circle cx="28" cy="54" r="1.8" fill="#FFF3DC" /><circle cx="38" cy="60" r="1.6" fill="#FFF3DC" /></g>
    </svg>
  );
}

function Cigale({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="ailes"><path d="M22 18 C 34 8, 54 10, 60 22 C 50 30, 34 30, 22 26 Z" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" fillOpacity="0.9" /><path d="M28 16 L56 20 M30 22 L54 24" stroke="#1F1A17" strokeWidth="1" fill="none" /></g><g data-part="corps"><path d="M8 24 C 8 16, 18 14, 28 18 C 34 22, 32 30, 26 32 C 18 34, 8 32, 8 24 Z" fill="#1B6B45" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="tete"><circle cx="10" cy="24" r="6" fill="#1B6B45" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="7" cy="20" r="2" fill="#FFC93C" /><circle cx="7" cy="28" r="2" fill="#FFC93C" /></g><g data-part="pattes"><path d="M18 32 L16 38 M24 32 L26 38" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" fill="none" /></g>
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

function Coquelicot({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M30 78 Q 28 56 32 34" stroke="#2FBF71" strokeWidth="2.5" strokeLinecap="round" fill="none" /></g><g data-part="feuille"><path d="M30 64 C 22 60, 16 62, 14 56 C 20 54, 26 56, 30 62 Z" fill="#2FBF71" /></g><g data-part="petales"><path d="M32 34 C 16 36, 12 18, 24 12 C 28 18, 30 22, 32 34 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /><path d="M32 34 C 48 36, 52 18, 40 12 C 36 18, 34 22, 32 34 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /><path d="M32 34 C 24 22, 26 10, 32 8 C 38 10, 40 22, 32 34 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="coeur"><circle cx="32" cy="28" r="4" fill="#1F1A17" /></g>
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

function Ecureuil({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="queue"><path d="M20 38 C 2 36, 2 12, 14 6 C 22 2, 26 12, 20 16 C 16 20, 22 30, 26 34 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="corps"><ellipse cx="34" cy="32" rx="12" ry="11" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="ventre"><ellipse cx="40" cy="34" rx="5" ry="7" fill="#FFF3DC" /></g><g data-part="tete"><circle cx="46" cy="18" r="8" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /><path d="M42 10 L44 4 L47 10 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="oeil"><circle cx="48" cy="16" r="1.8" fill="#1F1A17" /></g><g data-part="noisette"><ellipse cx="50" cy="28" rx="4" ry="5" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="pattes"><path d="M30 42 L28 47 M38 42 L40 47" stroke="#1F1A17" strokeWidth="2" strokeLinecap="round" fill="none" /></g>
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

function Etoiles({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={390} height={300} viewBox="0 0 390 300" fill="none" {...svgProps}>
      {children}
      <g data-part="etoiles"><path d="M24 11 L26.7 17.3 L33 20 L26.7 22.7 L24 29 L21.3 22.7 L15 20 L21.3 17.3 Z" fill="#FFF3DC" /><path d="M70 42 L71.8 46.2 L76 48 L71.8 49.8 L70 54 L68.2 49.8 L64 48 L68.2 46.2 Z" fill="#FFF3DC" /><path d="M120 10 L121.8 14.2 L126 16 L121.8 17.8 L120 22 L118.2 17.8 L114 16 L118.2 14.2 Z" fill="#FFF3DC" /><path d="M180 31 L182.7 37.3 L189 40 L182.7 42.7 L180 49 L177.3 42.7 L171 40 L177.3 37.3 Z" fill="#FFF3DC" /><path d="M230 12 L231.8 16.2 L236 18 L231.8 19.8 L230 24 L228.2 19.8 L224 18 L228.2 16.2 Z" fill="#FFF3DC" /><path d="M150 74 L151.8 78.2 L156 80 L151.8 81.8 L150 86 L148.2 81.8 L144 80 L148.2 78.2 Z" fill="#FFF3DC" /><path d="M60 91 L62.7 97.3 L69 100 L62.7 102.7 L60 109 L57.3 102.7 L51 100 L57.3 97.3 Z" fill="#FFF3DC" /><path d="M260 64 L261.8 68.2 L266 70 L261.8 71.8 L260 76 L258.2 71.8 L254 70 L258.2 68.2 Z" fill="#FFF3DC" /><path d="M200 104 L201.8 108.2 L206 110 L201.8 111.8 L200 116 L198.2 111.8 L194 110 L198.2 108.2 Z" fill="#FFF3DC" /><path d="M20 131 L22.7 137.3 L29 140 L22.7 142.7 L20 149 L17.3 142.7 L11 140 L17.3 137.3 Z" fill="#FFF3DC" /><path d="M110 124 L111.8 128.2 L116 130 L111.8 131.8 L110 136 L108.2 131.8 L104 130 L108.2 128.2 Z" fill="#FFF3DC" /><path d="M240 144 L241.8 148.2 L246 150 L241.8 151.8 L240 156 L238.2 151.8 L234 150 L238.2 148.2 Z" fill="#FFF3DC" /></g>
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

function Fleur1FleurieEpanoui({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="epanoui-1"><path d="M30 62 Q 40 56 46 44" stroke="#1F1A17" strokeWidth="2.4" strokeLinecap="round" fill="none" /><ellipse cx="47" cy="40" rx="4" ry="6" transform="rotate(25 47 40)" fill="#FF8FB1" /><ellipse cx="45" cy="45" rx="3" ry="2" fill="#1B6B45" /></g><g data-part="epanoui-2"><path d="M30 62 Q 40 56 46 44" stroke="#1F1A17" strokeWidth="2.4" strokeLinecap="round" fill="none" /><ellipse cx="47" cy="40" rx="4" ry="6" transform="rotate(25 47 40)" fill="#FF8FB1" /><ellipse cx="45" cy="45" rx="3" ry="2" fill="#1B6B45" /><circle cx="47.0" cy="35.6" r="3.7" fill="#FF8FB1" /><circle cx="51.2" cy="38.6" r="3.7" fill="#FF8FB1" /><circle cx="49.6" cy="43.6" r="3.7" fill="#FF8FB1" /><circle cx="44.4" cy="43.6" r="3.7" fill="#FF8FB1" /><circle cx="42.8" cy="38.6" r="3.7" fill="#FF8FB1" /><circle cx="47" cy="40" r="3.1" fill="#FFC93C" /></g><g data-part="epanoui-3"><path d="M30 62 Q 40 56 46 44" stroke="#1F1A17" strokeWidth="2.4" strokeLinecap="round" fill="none" /><ellipse cx="47" cy="40" rx="4" ry="6" transform="rotate(25 47 40)" fill="#FF8FB1" /><ellipse cx="45" cy="45" rx="3" ry="2" fill="#1B6B45" /><circle cx="47.0" cy="35.6" r="3.7" fill="#FF8FB1" /><circle cx="51.2" cy="38.6" r="3.7" fill="#FF8FB1" /><circle cx="49.6" cy="43.6" r="3.7" fill="#FF8FB1" /><circle cx="44.4" cy="43.6" r="3.7" fill="#FF8FB1" /><circle cx="42.8" cy="38.6" r="3.7" fill="#FF8FB1" /><circle cx="47" cy="40" r="3.1" fill="#FFC93C" /><path d="M30 56 Q 20 50 14 40" stroke="#1F1A17" strokeWidth="2.4" strokeLinecap="round" fill="none" /><circle cx="13.0" cy="33.0" r="3.4" fill="#FFF3DC" /><circle cx="16.8" cy="35.8" r="3.4" fill="#FFF3DC" /><circle cx="15.4" cy="40.2" r="3.4" fill="#FFF3DC" /><circle cx="10.6" cy="40.2" r="3.4" fill="#FFF3DC" /><circle cx="9.2" cy="35.8" r="3.4" fill="#FFF3DC" /><circle cx="13" cy="37" r="2.8" fill="#FFC93C" /><ellipse cx="38" cy="66" rx="8" ry="4" transform="rotate(25 38 66)" fill="#1B6B45" /></g>
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

function Fleur2FleurieEpanoui({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="epanoui-1"><path d="M30 76 C 44 70, 46 56, 42 48 C 34 56, 30 64, 30 76 Z" fill="#2FBF71" /></g><g data-part="epanoui-2"><path d="M30 76 C 44 70, 46 56, 42 48 C 34 56, 30 64, 30 76 Z" fill="#2FBF71" /><path d="M30 60 Q 42 52 46 40" stroke="#1F1A17" strokeWidth="2.4" strokeLinecap="round" fill="none" /><path d="M41 40 Q 41 30 46 26 Q 51 30 51 40 Q 46 44 41 40 Z" fill="#FF8FB1" /></g><g data-part="epanoui-3"><path d="M30 76 C 44 70, 46 56, 42 48 C 34 56, 30 64, 30 76 Z" fill="#2FBF71" /><path d="M30 60 Q 42 52 46 40" stroke="#1F1A17" strokeWidth="2.4" strokeLinecap="round" fill="none" /><path d="M41 40 Q 41 30 46 26 Q 51 30 51 40 Q 46 44 41 40 Z" fill="#FF8FB1" /><path d="M30 66 Q 18 58 14 46" stroke="#1F1A17" strokeWidth="2.4" strokeLinecap="round" fill="none" /><path d="M7 46 Q 7 36 11 32 L 14 36 L 17 32 Q 21 36 21 46 Q 14 50 7 46 Z" fill="#FFC93C" /></g>
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

function Fleur3FleurieEpanoui({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="epanoui-1"><circle cx="8" cy="50" r="4" fill="#FF4F2E" /><circle cx="52" cy="52" r="4" fill="#FF4F2E" /></g><g data-part="epanoui-2"><circle cx="8" cy="50" r="4" fill="#FF4F2E" /><circle cx="52" cy="52" r="4" fill="#FF4F2E" /><circle cx="22" cy="52" r="3.5" fill="#FF8FB1" /><circle cx="36" cy="50" r="3.5" fill="#FF8FB1" /><circle cx="14" cy="62" r="3" fill="#FF8FB1" /><circle cx="46" cy="62" r="3" fill="#FF8FB1" /></g><g data-part="epanoui-3"><circle cx="8" cy="50" r="4" fill="#FF4F2E" /><circle cx="52" cy="52" r="4" fill="#FF4F2E" /><circle cx="22" cy="52" r="3.5" fill="#FF8FB1" /><circle cx="36" cy="50" r="3.5" fill="#FF8FB1" /><circle cx="14" cy="62" r="3" fill="#FF8FB1" /><circle cx="46" cy="62" r="3" fill="#FF8FB1" /><circle cx="30.0" cy="37.0" r="2.5" fill="#FFF3DC" /><circle cx="32.9" cy="39.1" r="2.5" fill="#FFF3DC" /><circle cx="31.8" cy="42.4" r="2.5" fill="#FFF3DC" /><circle cx="28.2" cy="42.4" r="2.5" fill="#FFF3DC" /><circle cx="27.1" cy="39.1" r="2.5" fill="#FFF3DC" /><circle cx="30" cy="40" r="2.1" fill="#FFC93C" /><circle cx="20.0" cy="31.4" r="2.2" fill="#FFF3DC" /><circle cx="22.5" cy="33.2" r="2.2" fill="#FFF3DC" /><circle cx="21.5" cy="36.1" r="2.2" fill="#FFF3DC" /><circle cx="18.5" cy="36.1" r="2.2" fill="#FFF3DC" /><circle cx="17.5" cy="33.2" r="2.2" fill="#FFF3DC" /><circle cx="20" cy="34" r="1.8" fill="#FFC93C" /><circle cx="41.0" cy="29.4" r="2.2" fill="#FFF3DC" /><circle cx="43.5" cy="31.2" r="2.2" fill="#FFF3DC" /><circle cx="42.5" cy="34.1" r="2.2" fill="#FFF3DC" /><circle cx="39.5" cy="34.1" r="2.2" fill="#FFF3DC" /><circle cx="38.5" cy="31.2" r="2.2" fill="#FFF3DC" /><circle cx="41" cy="32" r="1.8" fill="#FFC93C" /></g>
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

function Fleur4Fleurie({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M30 78 V32" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g><g data-part="feuilles"><path transform="translate(30 64) rotate(-160) scale(1)" d="M0 0 C 3 -2, 4 -6, 7 -5 C 7 -8, 10 -9, 12 -8 C 13 -10, 16 -10, 18 -8 C 14 -2, 6 2, 0 0 Z" fill="#1B6B45" /><path transform="translate(30 54) rotate(-25) scale(0.9)" d="M0 0 C 3 -2, 4 -6, 7 -5 C 7 -8, 10 -9, 12 -8 C 13 -10, 16 -10, 18 -8 C 14 -2, 6 2, 0 0 Z" fill="#1B6B45" /></g><g data-part="petales"><ellipse cx="30" cy="12" rx="3.8" ry="7.4" transform="rotate(0 30 24)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="30" cy="12" rx="3.8" ry="7.4" transform="rotate(30 30 24)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="30" cy="12" rx="3.8" ry="7.4" transform="rotate(60 30 24)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="30" cy="12" rx="3.8" ry="7.4" transform="rotate(90 30 24)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="30" cy="12" rx="3.8" ry="7.4" transform="rotate(120 30 24)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="30" cy="12" rx="3.8" ry="7.4" transform="rotate(150 30 24)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="30" cy="12" rx="3.8" ry="7.4" transform="rotate(180 30 24)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="30" cy="12" rx="3.8" ry="7.4" transform="rotate(210 30 24)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="30" cy="12" rx="3.8" ry="7.4" transform="rotate(240 30 24)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="30" cy="12" rx="3.8" ry="7.4" transform="rotate(270 30 24)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="30" cy="12" rx="3.8" ry="7.4" transform="rotate(300 30 24)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="30" cy="12" rx="3.8" ry="7.4" transform="rotate(330 30 24)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /></g><g data-part="coeur"><circle cx="30" cy="24" r="5.8" fill="#FFC93C" /></g>
    </svg>
  );
}

function Fleur4FleurieEpanoui({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="epanoui-1"><path d="M30 60 Q 42 54 46 44" stroke="#1F1A17" strokeWidth="2.4" strokeLinecap="round" fill="none" /><circle cx="46" cy="42" r="4" fill="#2FBF71" /><path d="M43 39 Q 46 35 49 39" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" /></g><g data-part="epanoui-2"><ellipse cx="46" cy="33" rx="2.2" ry="4.3" transform="rotate(0 46 40)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="46" cy="33" rx="2.2" ry="4.3" transform="rotate(36 46 40)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="46" cy="33" rx="2.2" ry="4.3" transform="rotate(72 46 40)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="46" cy="33" rx="2.2" ry="4.3" transform="rotate(108 46 40)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="46" cy="33" rx="2.2" ry="4.3" transform="rotate(144 46 40)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="46" cy="33" rx="2.2" ry="4.3" transform="rotate(180 46 40)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="46" cy="33" rx="2.2" ry="4.3" transform="rotate(216 46 40)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="46" cy="33" rx="2.2" ry="4.3" transform="rotate(252 46 40)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="46" cy="33" rx="2.2" ry="4.3" transform="rotate(288 46 40)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="46" cy="33" rx="2.2" ry="4.3" transform="rotate(324 46 40)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><circle cx="46" cy="40" r="3.4" fill="#FFC93C" /></g><g data-part="epanoui-3"><path d="M30 66 Q 18 60 13 50" stroke="#1F1A17" strokeWidth="2.4" strokeLinecap="round" fill="none" /><ellipse cx="12" cy="39.5" rx="2.1" ry="4" transform="rotate(0 12 46)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="12" cy="39.5" rx="2.1" ry="4" transform="rotate(36 12 46)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="12" cy="39.5" rx="2.1" ry="4" transform="rotate(72 12 46)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="12" cy="39.5" rx="2.1" ry="4" transform="rotate(108 12 46)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="12" cy="39.5" rx="2.1" ry="4" transform="rotate(144 12 46)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="12" cy="39.5" rx="2.1" ry="4" transform="rotate(180 12 46)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="12" cy="39.5" rx="2.1" ry="4" transform="rotate(216 12 46)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="12" cy="39.5" rx="2.1" ry="4" transform="rotate(252 12 46)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="12" cy="39.5" rx="2.1" ry="4" transform="rotate(288 12 46)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><ellipse cx="12" cy="39.5" rx="2.1" ry="4" transform="rotate(324 12 46)" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="0.8" /><circle cx="12" cy="46" r="3.1" fill="#FFC93C" /></g>
    </svg>
  );
}

function Fleur4Pousse({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M30 78 V64" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g><g data-part="feuilles"><path transform="translate(30 70) rotate(-160) scale(0.9)" d="M0 0 C 3 -2, 4 -6, 7 -5 C 7 -8, 10 -9, 12 -8 C 13 -10, 16 -10, 18 -8 C 14 -2, 6 2, 0 0 Z" fill="#1B6B45" /><path transform="translate(30 68) rotate(-20) scale(0.9)" d="M0 0 C 3 -2, 4 -6, 7 -5 C 7 -8, 10 -9, 12 -8 C 13 -10, 16 -10, 18 -8 C 14 -2, 6 2, 0 0 Z" fill="#1B6B45" /></g>
    </svg>
  );
}

function Fleur5Fleurie({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M30 72 Q 30 47 30 31" stroke="#1B6B45" strokeWidth="2" strokeLinecap="round" fill="none" /><path d="M26 72 Q 21 51 16 39" stroke="#1B6B45" strokeWidth="2" strokeLinecap="round" fill="none" /><path d="M34 72 Q 39 50 44 37" stroke="#1B6B45" strokeWidth="2" strokeLinecap="round" fill="none" /><path d="M28 72 Q 25 54 22 45" stroke="#1B6B45" strokeWidth="2" strokeLinecap="round" fill="none" /><path d="M32 72 Q 35 54 38 45" stroke="#1B6B45" strokeWidth="2" strokeLinecap="round" fill="none" /></g><g data-part="feuilles"><path d="M30 78 Q 21.6 72 16 66" stroke="#1B6B45" strokeWidth="3" strokeLinecap="round" fill="none" /><path d="M30 78 Q 26.4 72 24 66" stroke="#1B6B45" strokeWidth="3" strokeLinecap="round" fill="none" /><path d="M30 78 Q 33.6 72 36 66" stroke="#1B6B45" strokeWidth="3" strokeLinecap="round" fill="none" /><path d="M30 78 Q 38.4 72 44 66" stroke="#1B6B45" strokeWidth="3" strokeLinecap="round" fill="none" /></g><g data-part="petales"><g transform="rotate(0 30 22.5)"><rect x="26.6" y="14" width="6.8" height="17" rx="3.4" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.2" /><path d="M27.6 18.8 H32.4 M27.6 22.5 H32.4 M27.6 26.2 H32.4" stroke="#1F1A17" strokeWidth="0.9" /></g><g transform="rotate(-11.3 16 30.5)"><rect x="12.6" y="22" width="6.8" height="17" rx="3.4" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.2" /><path d="M13.6 26.8 H18.4 M13.6 30.5 H18.4 M13.6 34.2 H18.4" stroke="#1F1A17" strokeWidth="0.9" /></g><g transform="rotate(10.9 44 28.5)"><rect x="40.6" y="20" width="6.8" height="17" rx="3.4" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.2" /><path d="M41.6 24.8 H46.4 M41.6 28.5 H46.4 M41.6 32.2 H46.4" stroke="#1F1A17" strokeWidth="0.9" /></g><g transform="rotate(-7.8 22 36.5)"><rect x="18.6" y="28" width="6.8" height="17" rx="3.4" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.2" /><path d="M19.6 32.8 H24.4 M19.6 36.5 H24.4 M19.6 40.2 H24.4" stroke="#1F1A17" strokeWidth="0.9" /></g><g transform="rotate(7.8 38 36.5)"><rect x="34.6" y="28" width="6.8" height="17" rx="3.4" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.2" /><path d="M35.6 32.8 H40.4 M35.6 36.5 H40.4 M35.6 40.2 H40.4" stroke="#1F1A17" strokeWidth="0.9" /></g></g>
    </svg>
  );
}

function Fleur5FleurieEpanoui({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="epanoui-1"><path d="M22 74 Q 15 57 8 49" stroke="#1B6B45" strokeWidth="2" strokeLinecap="round" fill="none" /><g transform="rotate(-18.4 8 40.5)"><rect x="4.6" y="32" width="6.8" height="17" rx="3.4" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.2" /><path d="M5.6 36.8 H10.4 M5.6 40.5 H10.4 M5.6 44.2 H10.4" stroke="#1F1A17" strokeWidth="0.9" /></g></g><g data-part="epanoui-2"><path d="M38 74 Q 45 56 52 47" stroke="#1B6B45" strokeWidth="2" strokeLinecap="round" fill="none" /><g transform="rotate(17.7 52 38.5)"><rect x="48.6" y="30" width="6.8" height="17" rx="3.4" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.2" /><path d="M49.6 34.8 H54.4 M49.6 38.5 H54.4 M49.6 42.2 H54.4" stroke="#1F1A17" strokeWidth="0.9" /></g></g><g data-part="epanoui-3"><path d="M30 74 Q 27 44 24 23" stroke="#1B6B45" strokeWidth="2" strokeLinecap="round" fill="none" /><path d="M30 74 Q 33 45 36 25" stroke="#1B6B45" strokeWidth="2" strokeLinecap="round" fill="none" /><g transform="rotate(-5 24 14.5)"><rect x="20.6" y="6" width="6.8" height="17" rx="3.4" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.2" /><path d="M21.6 10.8 H26.4 M21.6 14.5 H26.4 M21.6 18.2 H26.4" stroke="#1F1A17" strokeWidth="0.9" /></g><g transform="rotate(5.2 36 16.5)"><rect x="32.6" y="8" width="6.8" height="17" rx="3.4" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.2" /><path d="M33.6 12.8 H38.4 M33.6 16.5 H38.4 M33.6 20.2 H38.4" stroke="#1F1A17" strokeWidth="0.9" /></g></g>
    </svg>
  );
}

function Fleur5Pousse({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="feuilles"><path d="M30 78 Q 21 70 15 62" stroke="#1B6B45" strokeWidth="3" strokeLinecap="round" fill="none" /><path d="M30 78 Q 26.4 70 24 62" stroke="#1B6B45" strokeWidth="3" strokeLinecap="round" fill="none" /><path d="M30 78 Q 30 70 30 62" stroke="#1B6B45" strokeWidth="3" strokeLinecap="round" fill="none" /><path d="M30 78 Q 34.2 70 37 62" stroke="#1B6B45" strokeWidth="3" strokeLinecap="round" fill="none" /><path d="M30 78 Q 39 70 45 62" stroke="#1B6B45" strokeWidth="3" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function Fleur6Fleurie({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M30 76 Q 28 52 30 30" stroke="#2FBF71" strokeWidth="3" strokeLinecap="round" /></g><g data-part="feuilles"><path transform="translate(30 76) rotate(-170) scale(1.15)" d="M0 0 C 3 -2, 4 -6, 7 -5 C 7 -8, 10 -9, 12 -8 C 13 -10, 16 -10, 18 -8 C 14 -2, 6 2, 0 0 Z" fill="#1B6B45" /><path transform="translate(30 76) rotate(-10) scale(1.15)" d="M0 0 C 3 -2, 4 -6, 7 -5 C 7 -8, 10 -9, 12 -8 C 13 -10, 16 -10, 18 -8 C 14 -2, 6 2, 0 0 Z" fill="#1B6B45" /><path transform="translate(30 76) rotate(-140) scale(0.9199999999999999)" d="M0 0 C 3 -2, 4 -6, 7 -5 C 7 -8, 10 -9, 12 -8 C 13 -10, 16 -10, 18 -8 C 14 -2, 6 2, 0 0 Z" fill="#1B6B45" /><path transform="translate(30 76) rotate(-40) scale(0.9199999999999999)" d="M0 0 C 3 -2, 4 -6, 7 -5 C 7 -8, 10 -9, 12 -8 C 13 -10, 16 -10, 18 -8 C 14 -2, 6 2, 0 0 Z" fill="#1B6B45" /></g><g data-part="petales"><circle cx="30" cy="24" r="10" fill="#FFC93C" /><path d="M35.5 24 L41.8 24" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M35 26.4 L40.6 29.1" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M33.4 28.3 L37.4 33.2" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M31.2 29.4 L32.6 35.5" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M28.8 29.4 L27.4 35.5" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M26.6 28.3 L22.6 33.2" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M25 26.4 L19.4 29.1" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M24.5 24 L18.2 24" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M25 21.6 L19.4 18.9" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M26.6 19.7 L22.6 14.8" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M28.8 18.6 L27.4 12.5" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M31.2 18.6 L32.6 12.5" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M33.4 19.7 L37.4 14.8" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /><path d="M35 21.6 L40.6 18.9" stroke="#FFC93C" strokeWidth="3.2" strokeLinecap="round" /></g><g data-part="coeur"><circle cx="30" cy="24" r="4.5" fill="#FF4F2E" fillOpacity="0.35" /></g>
    </svg>
  );
}

function Fleur6FleurieEpanoui({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="epanoui-1"><path d="M32 76 Q 42 64 44 54" stroke="#2FBF71" strokeWidth="2.4" strokeLinecap="round" fill="none" /><ellipse cx="44" cy="50" rx="3.4" ry="5" fill="#2FBF71" /><path d="M42 46 Q 44 43 46 46" stroke="#FFC93C" strokeWidth="2" fill="none" strokeLinecap="round" /></g><g data-part="epanoui-2"><circle cx="45" cy="48" r="6.5" fill="#FFC93C" /><path d="M48.6 48 L52.7 48" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M48.2 49.6 L51.9 51.3" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M47.2 50.8 L49.8 54" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M45.8 51.5 L46.7 55.5" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M44.2 51.5 L43.3 55.5" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M42.8 50.8 L40.2 54" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M41.8 49.6 L38.1 51.3" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M41.4 48 L37.3 48" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M41.8 46.4 L38.1 44.7" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M42.8 45.2 L40.2 42" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M44.2 44.5 L43.3 40.5" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M45.8 44.5 L46.7 40.5" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M47.2 45.2 L49.8 42" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><path d="M48.2 46.4 L51.9 44.7" stroke="#FFC93C" strokeWidth="2.1" strokeLinecap="round" /><circle cx="45" cy="48" r="2.9" fill="#FF4F2E" fillOpacity="0.35" /></g><g data-part="epanoui-3"><path d="M28 76 Q 16 60 13 44" stroke="#2FBF71" strokeWidth="2.4" strokeLinecap="round" fill="none" /><circle cx="13" cy="38" r="8" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1" /><path d="M13 38 L19.8 38" stroke="#1F1A17" strokeWidth="0.7" /><path d="M13 38 L18.9 41.4" stroke="#1F1A17" strokeWidth="0.7" /><path d="M13 38 L16.4 43.9" stroke="#1F1A17" strokeWidth="0.7" /><path d="M13 38 L13 44.8" stroke="#1F1A17" strokeWidth="0.7" /><path d="M13 38 L9.6 43.9" stroke="#1F1A17" strokeWidth="0.7" /><path d="M13 38 L7.1 41.4" stroke="#1F1A17" strokeWidth="0.7" /><path d="M13 38 L6.2 38" stroke="#1F1A17" strokeWidth="0.7" /><path d="M13 38 L7.1 34.6" stroke="#1F1A17" strokeWidth="0.7" /><path d="M13 38 L9.6 32.1" stroke="#1F1A17" strokeWidth="0.7" /><path d="M13 38 L13 31.2" stroke="#1F1A17" strokeWidth="0.7" /><path d="M13 38 L16.4 32.1" stroke="#1F1A17" strokeWidth="0.7" /><path d="M13 38 L18.9 34.6" stroke="#1F1A17" strokeWidth="0.7" /><circle cx="13" cy="38" r="1.6" fill="#1F1A17" /></g>
    </svg>
  );
}

function Fleur6Pousse({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="feuilles"><path transform="translate(30 76) rotate(-170) scale(0.9)" d="M0 0 C 3 -2, 4 -6, 7 -5 C 7 -8, 10 -9, 12 -8 C 13 -10, 16 -10, 18 -8 C 14 -2, 6 2, 0 0 Z" fill="#1B6B45" /><path transform="translate(30 76) rotate(-10) scale(0.9)" d="M0 0 C 3 -2, 4 -6, 7 -5 C 7 -8, 10 -9, 12 -8 C 13 -10, 16 -10, 18 -8 C 14 -2, 6 2, 0 0 Z" fill="#1B6B45" /><path transform="translate(30 76) rotate(-140) scale(0.7200000000000001)" d="M0 0 C 3 -2, 4 -6, 7 -5 C 7 -8, 10 -9, 12 -8 C 13 -10, 16 -10, 18 -8 C 14 -2, 6 2, 0 0 Z" fill="#1B6B45" /><path transform="translate(30 76) rotate(-40) scale(0.7200000000000001)" d="M0 0 C 3 -2, 4 -6, 7 -5 C 7 -8, 10 -9, 12 -8 C 13 -10, 16 -10, 18 -8 C 14 -2, 6 2, 0 0 Z" fill="#1B6B45" /></g>
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

function Hibou({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={48} height={56} viewBox="0 0 48 56" fill="none" {...svgProps}>
      {children}
      <g data-part="corps"><path d="M8 26 C 8 10, 40 10, 40 26 L 40 44 C 40 52, 8 52, 8 44 Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="aigrettes"><path d="M10 16 L8 4 L18 12 Z M38 16 L40 4 L30 12 Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="ventre"><path d="M16 34 C 16 28, 32 28, 32 34 L 32 44 C 32 48, 16 48, 16 44 Z" fill="#FFF3DC" /><path d="M20 36 l2 2 l2 -2 M26 36 l2 2 l2 -2 M22 42 l2 2 l2 -2" stroke="#1F1A17" strokeWidth="1.2" strokeLinecap="round" fill="none" /></g><g data-part="ailes"><path d="M8 28 C 4 34, 4 42, 10 46 L 12 30 Z M40 28 C 44 34, 44 42, 38 46 L 36 30 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="yeux"><circle cx="17" cy="21" r="6" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="31" cy="21" r="6" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="17" cy="21" r="2.6" fill="#1F1A17" /><circle cx="31" cy="21" r="2.6" fill="#1F1A17" /></g><g data-part="bec"><path d="M22 24 L24 29 L26 24 Z" fill="#FF4F2E" /></g><g data-part="pattes"><path d="M18 50 V54 M30 50 V54" stroke="#1F1A17" strokeWidth="2" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function HibouEndormi({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={48} height={56} viewBox="0 0 48 56" fill="none" {...svgProps}>
      {children}
      <g data-part="corps"><path d="M8 26 C 8 10, 40 10, 40 26 L 40 44 C 40 52, 8 52, 8 44 Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="aigrettes"><path d="M10 16 L8 4 L18 12 Z M38 16 L40 4 L30 12 Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="ventre"><path d="M16 34 C 16 28, 32 28, 32 34 L 32 44 C 32 48, 16 48, 16 44 Z" fill="#FFF3DC" /><path d="M20 36 l2 2 l2 -2 M26 36 l2 2 l2 -2 M22 42 l2 2 l2 -2" stroke="#1F1A17" strokeWidth="1.2" strokeLinecap="round" fill="none" /></g><g data-part="ailes"><path d="M8 28 C 4 34, 4 42, 10 46 L 12 30 Z M40 28 C 44 34, 44 42, 38 46 L 36 30 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="yeux"><circle cx="17" cy="21" r="6" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="31" cy="21" r="6" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /><path d="M13 21 Q 17 24 21 21 M27 21 Q 31 24 35 21" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" fill="none" /></g><g data-part="bec"><path d="M22 24 L24 29 L26 24 Z" fill="#FF4F2E" /></g><g data-part="pattes"><path d="M18 50 V54 M30 50 V54" stroke="#1F1A17" strokeWidth="2" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function Hirondelle({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="aile-arriere"><path d="M30 24 C 24 12, 30 4, 44 2 C 42 12, 38 20, 34 26 Z" fill="#2D4BFF" /></g><g data-part="queue"><path d="M16 26 L2 20 L10 28 L2 36 L16 30 Z" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="corps"><path d="M14 28 C 22 20, 44 20, 54 24 C 46 32, 26 34, 14 28 Z" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="ventre"><path d="M22 29 C 32 33, 44 30, 52 25 C 44 31, 30 33, 22 29 Z" fill="#FFF3DC" /></g><g data-part="gorge"><circle cx="50" cy="26" r="3" fill="#FF4F2E" /></g><g data-part="oeil"><circle cx="50" cy="22" r="1.6" fill="#FFF3DC" /></g><g data-part="aile-avant"><path d="M26 26 C 18 16, 20 6, 30 0 C 34 10, 34 20, 32 27 Z" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /></g>
    </svg>
  );
}

function Houx({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="feuilles"><path d="M30 78 L18 62 L24 60 L14 48 L22 46 L16 34 L30 42 Z" fill="#1B6B45" stroke="#1F1A17" strokeWidth="1.5" /><path d="M30 78 L42 62 L36 60 L46 48 L38 46 L44 34 L30 42 Z" fill="#1B6B45" stroke="#1F1A17" strokeWidth="1.5" /><path d="M30 42 L22 30 L28 28 L30 16 L32 28 L38 30 Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="baies"><circle cx="27" cy="44" r="4" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="34" cy="46" r="4" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="30" cy="38" r="4" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g>
    </svg>
  );
}

function Jonquille({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="feuilles"><path d="M26 78 C 20 60, 18 46, 16 36 C 24 48, 28 62, 28 78 Z" fill="#2FBF71" /><path d="M34 78 C 40 60, 42 48, 46 40 C 38 50, 34 62, 32 78 Z" fill="#1B6B45" /></g><g data-part="tige"><path d="M30 78 V32" stroke="#1B6B45" strokeWidth="3" strokeLinecap="round" fill="none" /></g><g data-part="petales"><ellipse cx="30" cy="16" rx="5" ry="9" transform="rotate(0 30 24)" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="16" rx="5" ry="9" transform="rotate(60 30 24)" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="16" rx="5" ry="9" transform="rotate(120 30 24)" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="16" rx="5" ry="9" transform="rotate(180 30 24)" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="16" rx="5" ry="9" transform="rotate(240 30 24)" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="16" rx="5" ry="9" transform="rotate(300 30 24)" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1" /></g><g data-part="coeur"><circle cx="30" cy="24" r="6" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="30" cy="24" r="3" fill="#FF4F2E" /></g>
    </svg>
  );
}

function Libellule({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="ailes-arriere"><ellipse cx="30" cy="14" rx="12" ry="5" transform="rotate(-20 30 14)" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /><ellipse cx="30" cy="30" rx="12" ry="5" transform="rotate(20 30 30)" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="ailes-avant"><ellipse cx="40" cy="14" rx="12" ry="5" transform="rotate(20 40 14)" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /><ellipse cx="40" cy="30" rx="12" ry="5" transform="rotate(-20 40 30)" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="corps"><rect x="4" y="20" width="34" height="4" rx="2" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><ellipse cx="38" cy="22" rx="5" ry="4" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="tete"><circle cx="46" cy="22" r="4.5" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.5" /></g>
    </svg>
  );
}

function Lune({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="lune"><path d="M40 8 C 22 8, 10 22, 10 36 C 10 50, 22 60, 36 60 C 46 60, 54 54, 58 46 C 40 50, 26 38, 28 22 C 30 16, 34 11, 40 8 Z" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="cratere"><circle cx="22" cy="42" r="3" fill="#FFC93C" fillOpacity="0.5" /><circle cx="32" cy="52" r="2" fill="#FFC93C" fillOpacity="0.5" /></g>
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
      <g data-part="aile-arriere"><path d="M30 28 C 26 16, 30 6, 40 2 C 42 12, 38 22, 34 29 Z" fill="#FF8FB1" /></g><g data-part="queue"><path d="M14 32 L1 28 L6 40 Z" fill="#2D4BFF" /></g><g data-part="corps"><ellipse cx="28" cy="32" rx="17" ry="10" transform="rotate(-8 28 32)" fill="#2D4BFF" /></g><g data-part="tete"><circle cx="46" cy="24" r="8.5" fill="#2D4BFF" /></g><g data-part="bec"><path d="M53.5 22 L62 24.5 L53.5 27.5 Z" fill="#FFC93C" /></g><g data-part="oeil"><circle cx="48" cy="22" r="2" fill="#1F1A17" /></g><g data-part="aile-avant"><path d="M26 30 C 18 20, 18 8, 26 1 C 32 10, 32 22, 31 31 Z" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /></g>
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

function PerceNeige({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="feuilles"><path d="M28 78 C 22 60, 22 46, 24 36 C 28 48, 30 62, 30 78 Z" fill="#2FBF71" /><path d="M32 78 C 38 62, 38 50, 36 42 C 32 52, 30 64, 30 78 Z" fill="#1B6B45" /></g><g data-part="tige"><path d="M30 78 V30 Q 30 22 38 22" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" fill="none" /></g><g data-part="clochette"><path d="M38 22 C 30 24, 30 38, 34 42 L 38 38 L 42 42 C 46 38, 46 24, 38 22 Z" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="38" cy="24" r="2.5" fill="#2FBF71" /></g>
    </svg>
  );
}

function PictoArmoire({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#8F7BEA" /><g data-part="objet" fill="none"><rect x="15" y="8" width="34" height="44" rx="3" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="2" /><path d="M32 8V52" stroke="#1F1A17" strokeWidth="2" /><rect x="13" y="7" width="38" height="5" rx="2" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.6" /><circle cx="29" cy="31" r="1.8" fill="#1F1A17" /><circle cx="35" cy="31" r="1.8" fill="#1F1A17" /><path d="M19 52V56M45 52V56" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoArrosoir({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <g data-part="fond"><circle cx="32" cy="32" r="30" fill="#2D4BFF" /></g><g data-part="objet"><path d="M14 30 C 8 30, 8 42, 16 42" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" fill="none" /><path d="M20 22 C 22 14, 34 14, 36 22" stroke="#FFC93C" strokeWidth="4" strokeLinecap="round" fill="none" /><rect x="16" y="22" width="22" height="24" rx="3" fill="#FFC93C" /><path d="M36 40 L50 26" stroke="#FFF3DC" strokeWidth="4" strokeLinecap="round" /><ellipse cx="51.5" cy="24.5" rx="3" ry="6.5" transform="rotate(45 51.5 24.5)" fill="#FFF3DC" /></g>
    </svg>
  );
}

function PictoAspirateur({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#8F7BEA" /><g data-part="objet" fill="none"><path d="M31 44V37C31 29 37 25 44 25C50 25 54 30 54 37V44H31Z" fill="#FFF3DC" /><circle cx="37" cy="46" r="4" fill="#1F1A17" /><circle cx="49" cy="46" r="4" fill="#1F1A17" /><rect x="40" y="30" width="9" height="4" rx="2" fill="#FFC93C" /><path d="M33 33C24 30 21 22 23 14" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /><path d="M23 14L15 45" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /><rect x="8" y="45" width="13" height="4.5" rx="2.25" fill="#1F1A17" /></g>
    </svg>
  );
}

function PictoAutocar({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#2D4BFF" /><g data-part="objet" fill="none"><rect x="8" y="19" width="48" height="24" rx="5" fill="#FFF3DC" /><rect x="12" y="23" width="40" height="9" rx="2" fill="#2D4BFF" /><path d="M22 23V32M32 23V32M42 23V32" stroke="#FFF3DC" strokeWidth="2" /><rect x="8" y="35" width="48" height="3" fill="#FFC93C" /><circle cx="19" cy="44" r="5" fill="#1F1A17" /><circle cx="45" cy="44" r="5" fill="#1F1A17" /></g>
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

function PictoBoxInternet({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#FFC93C" /><g data-part="objet" fill="none"><rect x="12" y="31" width="40" height="15" rx="4" fill="#1F1A17" /><circle cx="20" cy="38.5" r="2" fill="#2FBF71" /><circle cx="26" cy="38.5" r="2" fill="#FFF3DC" /><circle cx="32" cy="38.5" r="2" fill="#FFF3DC" /><path d="M16 46V50M48 46V50" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /><path d="M26 24C29.5 20.5 34.5 20.5 38 24M21 19C27.5 13 36.5 13 43 19" stroke="#2D4BFF" strokeWidth="3" strokeLinecap="round" /></g>
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

function PictoCanape({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#8F7BEA" /><g data-part="objet" fill="none"><rect x="15" y="18" width="34" height="17" rx="5" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="2" /><rect x="16" y="31" width="32" height="11" rx="3" fill="#FFC93C" stroke="#1F1A17" strokeWidth="2" /><rect x="8" y="27" width="10" height="19" rx="4" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="2" /><rect x="46" y="27" width="10" height="19" rx="4" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="2" /><path d="M13 46V51M51 46V51" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoCasqueVr({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#FFC93C" /><g data-part="objet" fill="none"><path d="M10 30C10 24 14 22 20 22H44C50 22 54 24 54 30V36C54 41 51 43 46 43H40C37 43 35.5 38 32 38C28.5 38 27 43 24 43H18C13 43 10 41 10 36V30Z" fill="#1F1A17" /><path d="M17 28H30M34 28H47" stroke="#FFF3DC" strokeWidth="2.5" strokeLinecap="round" /><path d="M10 31H7M54 31H57" stroke="#1F1A17" strokeWidth="3.5" strokeLinecap="round" /><rect x="26" y="17" width="12" height="5" rx="2" fill="#2D4BFF" /></g>
    </svg>
  );
}

function PictoChaise({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#8F7BEA" /><g data-part="objet" fill="none"><path d="M22 9V45" stroke="#FFF3DC" strokeWidth="4" strokeLinecap="round" /><path d="M22 32H42" stroke="#FFF3DC" strokeWidth="4.5" strokeLinecap="round" /><path d="M24 33V53M41 33V53" stroke="#FFF3DC" strokeWidth="4" strokeLinecap="round" /><rect x="19.5" y="12" width="5" height="15" rx="2" fill="#FFC93C" /></g>
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

function PictoChemise({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#FF8FB1" /><g data-part="objet" fill="none"><path d="M19 17L26 12H38L45 17L50 30L45 32L44 29V53H20V29L19 32L14 30L19 17Z" fill="#FFF3DC" /><path d="M26 12L32 20L28 23L26 12Z M38 12L32 20L36 23L38 12Z" fill="#2D4BFF" /><path d="M32 20V53" stroke="#2D4BFF" strokeWidth="1.6" /><circle cx="32" cy="28" r="1.5" fill="#2D4BFF" /><circle cx="32" cy="35" r="1.5" fill="#2D4BFF" /><circle cx="32" cy="42" r="1.5" fill="#2D4BFF" /><rect x="36" y="27" width="5" height="5" rx="1" stroke="#2D4BFF" strokeWidth="1.4" /></g>
    </svg>
  );
}

function PictoCovoiturage({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#2D4BFF" /><g data-part="objet" fill="none"><path d="M12 40L16 28C17 25 19 24 22 24H42C45 24 47 25 48 28L52 40V45H12V40Z" fill="#FFF3DC" /><path d="M19 35L21 28H43L45 35H19Z" fill="#2D4BFF" /><circle cx="25" cy="31.5" r="3" fill="#FFC93C" /><circle cx="32" cy="31.5" r="3" fill="#FFC93C" /><circle cx="39" cy="31.5" r="3" fill="#FFC93C" /><circle cx="21" cy="46" r="5" fill="#1F1A17" /><circle cx="43" cy="46" r="5" fill="#1F1A17" /></g>
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

function PictoEcran({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#FFC93C" /><g data-part="objet" fill="none"><rect x="11" y="13" width="42" height="29" rx="3" fill="#1F1A17" /><rect x="14.5" y="16.5" width="35" height="22" rx="1.5" fill="#FFF3DC" /><path d="M28 42L26 49H38L36 42H28Z" fill="#1F1A17" /><path d="M21 51H43" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /><path d="M20 33L27 26L32 30L38 23L44 29" stroke="#2D4BFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></g>
    </svg>
  );
}

function PictoFour({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#8F7BEA" /><g data-part="objet" fill="none"><rect x="12" y="11" width="40" height="42" rx="5" fill="#FFF3DC" /><path d="M12 20H52" stroke="#1F1A17" strokeWidth="2" /><circle cx="19" cy="15.5" r="2.1" fill="#1F1A17" /><circle cx="26" cy="15.5" r="2.1" fill="#1F1A17" /><rect x="38" y="13.5" width="9" height="4" rx="1" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><rect x="20" y="23" width="24" height="2.6" rx="1.3" fill="#1F1A17" /><rect x="17" y="28" width="30" height="20" rx="3" fill="#1F1A17" /><path d="M21 43H43" stroke="#FF4F2E" strokeWidth="2.5" strokeLinecap="round" /></g>
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

function PictoIntercites({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#2D4BFF" /><g data-part="objet" fill="none"><path d="M9 22H50C53 22 55 25 55 28V40H9V22Z" fill="#FFF3DC" /><rect x="13" y="26" width="7" height="6" rx="1.5" fill="#2D4BFF" /><rect x="24" y="26" width="7" height="6" rx="1.5" fill="#2D4BFF" /><rect x="35" y="26" width="7" height="6" rx="1.5" fill="#2D4BFF" /><path d="M46 26H51V32H46V26Z" fill="#2D4BFF" /><rect x="9" y="35" width="46" height="2.5" fill="#FFC93C" /><circle cx="17" cy="43" r="3.5" fill="#1F1A17" /><circle cx="26" cy="43" r="3.5" fill="#1F1A17" /><circle cx="38" cy="43" r="3.5" fill="#1F1A17" /><circle cx="47" cy="43" r="3.5" fill="#1F1A17" /><path d="M8 49H56" stroke="#FFF3DC" strokeWidth="2.5" strokeLinecap="round" /></g>
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

function PictoLaveLinge({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#8F7BEA" /><g data-part="objet" fill="none"><rect x="15" y="10" width="34" height="44" rx="5" fill="#FFF3DC" /><path d="M15 19H49" stroke="#1F1A17" strokeWidth="2" /><circle cx="20.5" cy="14.5" r="1.6" fill="#1F1A17" /><circle cx="25.5" cy="14.5" r="1.6" fill="#1F1A17" /><circle cx="42" cy="14.5" r="2.6" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="32" cy="36" r="11.5" fill="#1F1A17" /><circle cx="32" cy="36" r="8" fill="#2D4BFF" /><path d="M26 37C28 34 30 39 32 36C34 33 36 38 38 35" stroke="#FFF3DC" strokeWidth="2" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoLaveVaisselle({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#8F7BEA" /><g data-part="objet" fill="none"><rect x="15" y="10" width="34" height="44" rx="5" fill="#FFF3DC" /><path d="M15 18H49" stroke="#1F1A17" strokeWidth="2" /><circle cx="42" cy="14" r="1.6" fill="#1F1A17" /><circle cx="37" cy="14" r="1.6" fill="#1F1A17" /><rect x="24" y="21" width="16" height="3" rx="1.5" fill="#1F1A17" /><rect x="20" y="28" width="24" height="20" rx="3" fill="#2D4BFF" /><ellipse cx="26" cy="38" rx="2.4" ry="7" fill="#FFF3DC" /><ellipse cx="32" cy="38" rx="2.4" ry="7" fill="#FFC93C" /><ellipse cx="38" cy="38" rx="2.4" ry="7" fill="#FFF3DC" /></g>
    </svg>
  );
}

function PictoLit({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#8F7BEA" /><g data-part="objet" fill="none"><rect x="9" y="16" width="6" height="32" rx="2" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="2" /><rect x="13" y="33" width="42" height="9" rx="2" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="2" /><ellipse cx="21.5" cy="29.5" rx="6" ry="3.6" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="2" /><rect x="28" y="27" width="28" height="10" rx="3" fill="#FFC93C" stroke="#1F1A17" strokeWidth="2" /><path d="M15 42V49M54 42V49" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g>
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

function PictoManteau({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#FF8FB1" /><g data-part="objet" fill="none"><path d="M20 13L26 10L32 15L38 10L44 13L49 26L44 28V53H20V28L15 26L20 13Z" fill="#2D4BFF" /><path d="M26 10L32 24L38 10" stroke="#FFF3DC" strokeWidth="2" strokeLinejoin="round" /><path d="M32 24V53" stroke="#FFF3DC" strokeWidth="1.6" /><circle cx="35.5" cy="31" r="1.7" fill="#FFF3DC" /><circle cx="35.5" cy="38" r="1.7" fill="#FFF3DC" /><circle cx="35.5" cy="45" r="1.7" fill="#FFF3DC" /><rect x="20" y="35" width="24" height="3" fill="#FFC93C" /></g>
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

function PictoMicroOndes({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#8F7BEA" /><g data-part="objet" fill="none"><rect x="9" y="16" width="46" height="31" rx="5" fill="#FFF3DC" /><rect x="13" y="20" width="29" height="23" rx="3" fill="#1F1A17" /><ellipse cx="27.5" cy="37" rx="9" ry="2.6" fill="#FFC93C" /><circle cx="48.5" cy="24" r="2.4" fill="#1F1A17" /><circle cx="48.5" cy="31" r="2.4" fill="#1F1A17" /><rect x="45.5" y="36" width="6" height="5" rx="1" fill="#2D4BFF" /><path d="M15 47V50M49 47V50" stroke="#1F1A17" strokeWidth="2.5" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoMoto({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#2D4BFF" /><g data-part="objet" fill="none"><circle cx="17" cy="42" r="7.5" stroke="#FFF3DC" strokeWidth="3.5" /><circle cx="47" cy="42" r="7.5" stroke="#FFF3DC" strokeWidth="3.5" /><path d="M17 42L22 33H30L34 40H42L47 42" stroke="#FFF3DC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 33H42L45 27" fill="none" /><path d="M24 34C24 30 27 28 31 28H38L42 34L38 40H30L24 34Z" fill="#FFF3DC" /><ellipse cx="34" cy="28.5" rx="6.5" ry="3.8" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.4" /><rect x="20" y="26.5" width="9" height="3.5" rx="1.75" fill="#1F1A17" /><path d="M40 30L44 21H50" stroke="#FFF3DC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="31" cy="35" r="2.6" fill="#1F1A17" /></g>
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

function PictoRefrigerateur({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#8F7BEA" /><g data-part="objet" fill="none"><rect x="18" y="7" width="28" height="48" rx="5" fill="#FFF3DC" /><path d="M18 23H46" stroke="#1F1A17" strokeWidth="2.5" /><rect x="22" y="12" width="3.2" height="7" rx="1.6" fill="#1F1A17" /><rect x="22" y="27" width="3.2" height="12" rx="1.6" fill="#1F1A17" /><rect x="35" y="30" width="6" height="6" rx="1" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.2" /><path d="M22 55V58M42 55V58" stroke="#1F1A17" strokeWidth="2.5" strokeLinecap="round" /></g>
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

function PictoRer({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#2D4BFF" /><g data-part="objet" fill="none"><rect x="18" y="10" width="28" height="38" rx="6" fill="#FFF3DC" /><rect x="22" y="15" width="20" height="8" rx="2" fill="#2D4BFF" /><rect x="22" y="26" width="20" height="8" rx="2" fill="#2D4BFF" /><rect x="18" y="37" width="28" height="3" fill="#FFC93C" /><circle cx="24" cy="44" r="2" fill="#1F1A17" /><circle cx="40" cy="44" r="2" fill="#1F1A17" /><path d="M22 49L18 55M42 49L46 55" stroke="#FFF3DC" strokeWidth="3" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoRobe({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#FF8FB1" /><g data-part="objet" fill="none"><path d="M27 10V16M37 10V16" stroke="#FFF3DC" strokeWidth="2.5" strokeLinecap="round" /><path d="M26 16H38L36 25L47 52H17L28 25L26 16Z" fill="#FFF3DC" /><path d="M28 25H36" stroke="#2D4BFF" strokeWidth="3.5" strokeLinecap="round" /><circle cx="26" cy="42" r="1.8" fill="#FF4F2E" /><circle cx="34" cy="36" r="1.8" fill="#FF4F2E" /><circle cx="38" cy="46" r="1.8" fill="#FF4F2E" /></g>
    </svg>
  );
}

function PictoScooter({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#2D4BFF" /><g data-part="objet" fill="none"><circle cx="19" cy="45" r="5.5" stroke="#FFF3DC" strokeWidth="3.5" /><circle cx="45" cy="45" r="5.5" stroke="#FFF3DC" strokeWidth="3.5" /><path d="M13 40C13 33 18 31 30 31V40H13Z" fill="#FFF3DC" /><path d="M24 40H38C42 40 44 36 43 30L41 19H48" stroke="#FFF3DC" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /><rect x="15" y="26" width="14" height="5" rx="2.5" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.4" /></g>
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

function PictoSweat({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#FF8FB1" /><g data-part="objet" fill="none"><path d="M21 20L14 31L18 45H22V53H42V45H46L50 31L43 20H21Z" fill="#2D4BFF" /><path d="M24 21C24 12 40 12 40 21L36 25H28L24 21Z" fill="#2D4BFF" stroke="#FFF3DC" strokeWidth="2" strokeLinejoin="round" /><path d="M30 25V31M34 25V31" stroke="#FFF3DC" strokeWidth="1.8" strokeLinecap="round" /><path d="M26 41H38L36 47H28L26 41Z" fill="#FFF3DC" /><path d="M22 45H42" stroke="#FFC93C" strokeWidth="2" /></g>
    </svg>
  );
}

function PictoTable({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#8F7BEA" /><g data-part="objet" fill="none"><rect x="9" y="27" width="46" height="6" rx="2" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="2" /><rect x="14" y="33" width="5" height="19" rx="1.5" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="2" /><rect x="45" y="33" width="5" height="19" rx="1.5" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="2" /><path d="M28 19H36L35 27H29L28 19Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.6" strokeLinejoin="round" /><path d="M32 19C32 15 29 13 26 13C26 16 28 19 32 19ZM32 19C32 14 35 11 39 11C39 15 36 19 32 19Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.4" /></g>
    </svg>
  );
}

function PictoTablette({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#FFC93C" /><g data-part="objet" fill="none"><rect x="16" y="11" width="32" height="42" rx="5" fill="#1F1A17" /><rect x="20" y="15" width="24" height="31" rx="2" fill="#FFF3DC" /><circle cx="32" cy="49.5" r="1.6" fill="#FFF3DC" /><rect x="24" y="20" width="16" height="9" rx="1.5" fill="#2D4BFF" /><path d="M24 34H40M24 39H34" stroke="#1F1A17" strokeWidth="2" strokeLinecap="round" /></g>
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

function PictoTram({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#2D4BFF" /><g data-part="objet" fill="none"><path d="M21 9.5H43" stroke="#FFF3DC" strokeWidth="2" strokeLinecap="round" /><path d="M32 20L27 15L35 10" stroke="#FFF3DC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><rect x="17" y="20" width="30" height="29" rx="7" fill="#FFF3DC" /><rect x="21" y="24" width="22" height="11" rx="3" fill="#2D4BFF" /><rect x="17" y="38" width="30" height="3" fill="#FFC93C" /><circle cx="23" cy="45" r="2" fill="#1F1A17" /><circle cx="41" cy="45" r="2" fill="#1F1A17" /><path d="M22 50L19 55M42 50L45 55" stroke="#FFF3DC" strokeWidth="3" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoTrottinette({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#2D4BFF" /><g data-part="objet" fill="none"><circle cx="18" cy="46" r="4.5" stroke="#FFF3DC" strokeWidth="3" /><circle cx="45" cy="46" r="4.5" stroke="#FFF3DC" strokeWidth="3" /><path d="M18 46H40L46 14" stroke="#FFF3DC" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M41 14H51" stroke="#FFF3DC" strokeWidth="3.5" strokeLinecap="round" /><path transform="translate(23 22) scale(1)" d="M6 0L0 9H4.5L2 17L10 6H5.5L8 0Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.4" strokeLinejoin="round" /></g>
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

function PictoVeloCargo({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#2D4BFF" /><g data-part="objet" fill="none"><circle cx="16" cy="42" r="7.5" stroke="#FFF3DC" strokeWidth="3.5" /><circle cx="48" cy="42" r="7.5" stroke="#FFF3DC" strokeWidth="3.5" /><path d="M16 42L24 29H30M24 29L28 42H40L48 42M36 29V24H41" stroke="#FFF3DC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><rect x="33" y="29" width="17" height="11" rx="2" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.6" /><path d="M20 25H27" stroke="#FFC93C" strokeWidth="3" strokeLinecap="round" /></g>
    </svg>
  );
}

function PictoVeloElectrique({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#2D4BFF" /><g data-part="objet" fill="none"><circle cx="20" cy="40" r="9" stroke="#FFF3DC" strokeWidth="3.5" /><circle cx="44" cy="40" r="9" stroke="#FFF3DC" strokeWidth="3.5" /><path d="M28 26L20 40H33L28 26ZM28 26H40L44 40M38 22H44" stroke="#FFF3DC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="M25 22H31" stroke="#FFC93C" strokeWidth="3" strokeLinecap="round" /><path transform="translate(43 6) scale(1)" d="M6 0L0 9H4.5L2 17L10 6H5.5L8 0Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.4" strokeLinejoin="round" /></g>
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

function PictoVoitureElectrique({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#2D4BFF" /><g data-part="objet" fill="none"><path d="M13 39L17 29C18 26 20 25 23 25H41C44 25 46 26 47 29L51 39V44H13V39Z" fill="#FFF3DC" /><path d="M20 34L22 29H42L44 34H20Z" fill="#2D4BFF" /><circle cx="22" cy="45" r="5" fill="#1F1A17" /><circle cx="42" cy="45" r="5" fill="#1F1A17" /><path transform="translate(28 7) scale(1)" d="M6 0L0 9H4.5L2 17L10 6H5.5L8 0Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.4" strokeLinejoin="round" /></g>
    </svg>
  );
}

function PictoVoitureHybride({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...svgProps}>
      {children}
      <circle data-part="fond" cx="32" cy="32" r="30" fill="#2D4BFF" /><g data-part="objet" fill="none"><path d="M13 39L17 29C18 26 20 25 23 25H41C44 25 46 26 47 29L51 39V44H13V39Z" fill="#FFF3DC" /><path d="M20 34L22 29H42L44 34H20Z" fill="#2D4BFF" /><circle cx="22" cy="45" r="5" fill="#1F1A17" /><circle cx="42" cy="45" r="5" fill="#1F1A17" /><path d="M22 8C22 8 17 14 17 17.5C17 20.3 19.2 22 22 22C24.8 22 27 20.3 27 17.5C27 14 22 8 22 8Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.4" /><path transform="translate(36 6) scale(0.95)" d="M6 0L0 9H4.5L2 17L10 6H5.5L8 0Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.4" strokeLinejoin="round" /></g>
    </svg>
  );
}

function Primevere({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="feuilles"><ellipse cx="18" cy="70" rx="12" ry="6" transform="rotate(-20 18 70)" fill="#2FBF71" /><ellipse cx="42" cy="70" rx="12" ry="6" transform="rotate(20 42 70)" fill="#1B6B45" /></g><g data-part="tiges"><path d="M30 74 L22 52 M30 74 L30 46 M30 74 L38 52" stroke="#2FBF71" strokeWidth="2.5" strokeLinecap="round" fill="none" /></g><g data-part="fleurs"><circle cx="22.0" cy="46.0" r="3.6" fill="#FFC93C" /><circle cx="25.8" cy="48.8" r="3.6" fill="#FFC93C" /><circle cx="24.4" cy="53.2" r="3.6" fill="#FFC93C" /><circle cx="19.6" cy="53.2" r="3.6" fill="#FFC93C" /><circle cx="18.2" cy="48.8" r="3.6" fill="#FFC93C" /><circle cx="22" cy="50" r="2" fill="#FF4F2E" /><circle cx="30.0" cy="40.0" r="3.6" fill="#FFC93C" /><circle cx="33.8" cy="42.8" r="3.6" fill="#FFC93C" /><circle cx="32.4" cy="47.2" r="3.6" fill="#FFC93C" /><circle cx="27.6" cy="47.2" r="3.6" fill="#FFC93C" /><circle cx="26.2" cy="42.8" r="3.6" fill="#FFC93C" /><circle cx="30" cy="44" r="2" fill="#FF4F2E" /><circle cx="38.0" cy="46.0" r="3.6" fill="#FFC93C" /><circle cx="41.8" cy="48.8" r="3.6" fill="#FFC93C" /><circle cx="40.4" cy="53.2" r="3.6" fill="#FFC93C" /><circle cx="35.6" cy="53.2" r="3.6" fill="#FFC93C" /><circle cx="34.2" cy="48.8" r="3.6" fill="#FFC93C" /><circle cx="38" cy="50" r="2" fill="#FF4F2E" /></g>
    </svg>
  );
}

function Renard({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="queue"><path d="M14 32 C 2 30, 0 14, 8 10 C 14 18, 16 30, 20 30 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /><path d="M8 10 C 4 12, 3 16, 5 18 C 8 15, 9 12, 8 10 Z" fill="#FFF3DC" /></g><g data-part="corps"><path d="M16 26 C 22 20, 40 20, 46 26 L 44 38 L 18 38 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="pattes"><path d="M20 38 V46 M26 38 V46 M38 38 V46 M43 37 V46" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g><g data-part="tete"><path d="M42 26 L46 10 L51 18 L56 10 L58 26 L64 32 L54 36 C 48 36, 42 32, 42 26 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /><path d="M52 30 L64 32 L54 36 Z" fill="#FFF3DC" /><circle cx="63" cy="32" r="1.6" fill="#1F1A17" /></g><g data-part="oeil"><circle cx="52" cy="24" r="1.8" fill="#1F1A17" /></g>
    </svg>
  );
}

function RenardEndormi({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="corps"><path d="M8 40 C 6 24, 20 14, 34 14 C 48 14, 58 24, 56 40 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="queue"><path d="M10 40 C 12 30, 24 30, 34 34 C 42 37, 50 38, 54 34 C 56 40, 50 46, 40 46 L 16 46 C 12 46, 10 44, 10 40 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /><path d="M54 34 C 56 40, 50 46, 42 46 C 46 42, 50 38, 54 34 Z" fill="#FFF3DC" /></g><g data-part="tete"><path d="M14 34 C 14 26, 22 22, 30 26 L 34 32 C 30 36, 20 38, 14 34 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /><path d="M16 26 L18 18 L23 24 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /><path d="M28 30 L34 32 L30 35 Z" fill="#FFF3DC" /><circle cx="34" cy="32" r="1.4" fill="#1F1A17" /></g><g data-part="oeil"><path d="M19 29 Q 22 31 25 29" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function RougeGorge({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="queue"><path d="M14 30 L2 24 L4 36 Z" fill="#1B6B45" /></g><g data-part="corps"><ellipse cx="28" cy="30" rx="17" ry="13" fill="#1B6B45" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="poitrail"><path d="M30 20 C 44 20, 46 36, 34 42 C 28 36, 26 26, 30 20 Z" fill="#FF4F2E" /></g><g data-part="tete"><circle cx="44" cy="18" r="9" fill="#1B6B45" stroke="#1F1A17" strokeWidth="1.5" /><path d="M38 20 C 40 26, 46 28, 50 24 C 48 20, 42 18, 38 20 Z" fill="#FF4F2E" /></g><g data-part="bec"><path d="M52 16 L60 18 L52 21 Z" fill="#1F1A17" /></g><g data-part="oeil"><circle cx="46" cy="15" r="2" fill="#1F1A17" /></g><g data-part="pattes"><path d="M24 42 L22 47 M32 42 L33 47" stroke="#1F1A17" strokeWidth="2" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function RougeGorgeEndormi({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={64} height={48} viewBox="0 0 64 48" fill="none" {...svgProps}>
      {children}
      <g data-part="queue"><path d="M14 30 L2 24 L4 36 Z" fill="#1B6B45" /></g><g data-part="corps"><ellipse cx="28" cy="30" rx="17" ry="13" fill="#1B6B45" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="poitrail"><path d="M30 20 C 44 20, 46 36, 34 42 C 28 36, 26 26, 30 20 Z" fill="#FF4F2E" /></g><g data-part="tete"><circle cx="44" cy="18" r="9" fill="#1B6B45" stroke="#1F1A17" strokeWidth="1.5" /><path d="M38 20 C 40 26, 46 28, 50 24 C 48 20, 42 18, 38 20 Z" fill="#FF4F2E" /></g><g data-part="bec"><path d="M52 16 L60 18 L52 21 Z" fill="#1F1A17" /></g><g data-part="oeil"><path d="M43 16 Q 46 18 49 16" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" fill="none" /></g><g data-part="pattes"><path d="M24 42 L22 47 M32 42 L33 47" stroke="#1F1A17" strokeWidth="2" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function SaisonAbricot({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="fruit"><path d="M40 20 C 58 18, 70 32, 68 50 C 66 66, 52 72, 40 72 C 28 72, 14 66, 12 50 C 10 32, 22 18, 40 20 Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="joue"><ellipse cx="52" cy="40" rx="10" ry="12" fill="#FF4F2E" opacity="0.55" /></g><g data-part="sillon"><path d="M40 22 C 34 36, 34 56, 40 70" stroke="#1F1A17" strokeWidth="1.5" strokeLinecap="round" fill="none" /></g><g data-part="feuille"><path d="M41 21 C 44 12, 54 8, 60 10 C 56 18, 48 22, 41 21 Z" fill="#2FBF71" /></g>
    </svg>
  );
}

function SaisonAsperge({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="tiges"><path d="M30 76 V24" stroke="#2FBF71" strokeWidth="8" strokeLinecap="round" fill="none" /><path d="M42 76 V16" stroke="#2FBF71" strokeWidth="8" strokeLinecap="round" fill="none" /><path d="M54 76 V26" stroke="#2FBF71" strokeWidth="8" strokeLinecap="round" fill="none" /></g><g data-part="pointes"><path d="M26 26 C 26 16, 34 16, 34 26 Z M38 18 C 38 6, 46 6, 46 18 Z M50 28 C 50 18, 58 18, 58 28 Z" fill="#1B6B45" /></g><g data-part="ecailles"><path d="M28 40 L32 37 M40 34 L44 31 M52 42 L56 39 M28 56 L32 53 M40 50 L44 47 M52 58 L56 55" stroke="#1B6B45" strokeWidth="1.8" strokeLinecap="round" fill="none" /></g><g data-part="lien"><rect x="22" y="58" width="40" height="7" rx="2" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g>
    </svg>
  );
}

function SaisonAubergine({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="legume"><path d="M40 24 C 54 22, 62 34, 62 48 C 62 64, 52 74, 40 74 C 28 74, 18 64, 18 48 C 18 34, 26 22, 40 24 Z" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="calice"><path d="M26 30 C 30 22, 36 20, 40 20 C 44 20, 50 22, 54 30 L46 28 L40 34 L34 28 Z" fill="#2FBF71" /></g><g data-part="queue"><path d="M40 20 V8" stroke="#1B6B45" strokeWidth="5" strokeLinecap="round" fill="none" /></g><g data-part="reflet"><ellipse cx="30" cy="50" rx="4" ry="9" fill="#FFF3DC" opacity="0.4" /></g>
    </svg>
  );
}

function SaisonAutomneFeuille1({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...svgProps}>
      {children}
      <g data-part="feuille"><path d="M3 13 C 3 7, 7 3, 13 3 C 13 9, 9 13, 3 13 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.2" /></g><g data-part="nervure"><path d="M4 12 L 11 5" stroke="#1F1A17" strokeWidth="1.2" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function SaisonAutomneFeuille2({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...svgProps}>
      {children}
      <g data-part="feuille"><path d="M3 13 C 3 7, 7 3, 13 3 C 13 9, 9 13, 3 13 Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.2" /></g><g data-part="nervure"><path d="M4 12 L 11 5" stroke="#1F1A17" strokeWidth="1.2" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function SaisonBetterave({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="fanes"><path d="M38 30 C 32 18, 24 10, 16 8 C 18 20, 28 28, 38 30 Z" fill="#2FBF71" /><path d="M42 30 C 48 16, 58 8, 66 8 C 62 20, 52 28, 42 30 Z" fill="#1B6B45" /><path d="M38 30 C 36 22, 38 12, 42 6" stroke="#FF8FB1" strokeWidth="2.5" strokeLinecap="round" fill="none" /></g><g data-part="racine"><path d="M40 28 C 56 28, 64 40, 62 52 C 60 62, 50 68, 42 70 L40 78 L38 70 C 30 68, 20 62, 18 52 C 16 40, 24 28, 40 28 Z" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.5" /></g>
    </svg>
  );
}

function SaisonCarotte({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="fanes"><path d="M40 22 C 34 12, 30 6, 26 4 M40 22 C 40 12, 40 6, 41 2 M40 22 C 46 12, 52 6, 56 5" stroke="#2FBF71" strokeWidth="5" strokeLinecap="round" /></g><g data-part="racine"><path d="M28 24 C 34 20, 46 20, 52 24 C 50 40, 44 60, 40 76 C 36 60, 30 40, 28 24 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="stries"><path d="M33 34 H39 M43 44 H48 M35 52 H40 M41 62 H44" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" /></g>
    </svg>
  );
}

function SaisonCerise({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="queues"><path d="M30 52 C 32 34, 40 18, 52 10 M52 10 C 54 26, 54 40, 52 52" stroke="#1B6B45" strokeWidth="3" strokeLinecap="round" fill="none" /></g><g data-part="feuille"><path d="M52 10 C 60 4, 70 6, 72 12 C 66 16, 58 16, 52 10 Z" fill="#2FBF71" /></g><g data-part="fruits"><circle cx="28" cy="60" r="13" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="54" cy="60" r="13" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="reflets"><circle cx="23" cy="55" r="2.5" fill="#FFF3DC" opacity="0.7" /><circle cx="49" cy="55" r="2.5" fill="#FFF3DC" opacity="0.7" /></g>
    </svg>
  );
}

function SaisonChou({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="feuilles-ext"><path d="M10 46 C 8 30, 22 18, 40 18 C 58 18, 72 30, 70 46 C 68 64, 54 74, 40 74 C 26 74, 12 64, 10 46 Z" fill="#1B6B45" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="coeur"><circle cx="40" cy="46" r="20" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="nervures"><path d="M40 30 V64 M40 46 L28 36 M40 46 L52 36 M40 56 L30 50 M40 56 L50 50" stroke="#1B6B45" strokeWidth="1.8" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function SaisonClementine({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="fruit"><circle cx="40" cy="46" r="26" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="pores"><circle cx="30" cy="40" r="1.4" fill="#FF4F2E" /><circle cx="46" cy="36" r="1.4" fill="#FF4F2E" /><circle cx="52" cy="50" r="1.4" fill="#FF4F2E" /><circle cx="36" cy="56" r="1.4" fill="#FF4F2E" /><circle cx="44" cy="60" r="1.4" fill="#FF4F2E" /><circle cx="28" cy="52" r="1.4" fill="#FF4F2E" /></g><g data-part="feuilles"><path d="M40 21 C 34 12, 24 10, 18 12 C 22 20, 32 24, 40 21 Z" fill="#2FBF71" /><path d="M40 21 C 46 10, 56 8, 62 10 C 58 18, 48 22, 40 21 Z" fill="#1B6B45" /></g>
    </svg>
  );
}

function SaisonCourge({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="fruit"><path d="M40 28 C 52 24, 72 30, 72 50 C 72 68, 54 72, 40 70 C 26 72, 8 68, 8 50 C 8 30, 28 24, 40 28 Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="cotes"><path d="M28 30 C 20 40, 20 60, 28 70 M52 30 C 60 40, 60 60, 52 70 M40 28 V70" stroke="#FF4F2E" strokeWidth="2.5" strokeLinecap="round" /></g><g data-part="queue"><path d="M38 28 C 37 20, 40 14, 46 12 L48 16 C 43 18, 42 22, 43 28 Z" fill="#1B6B45" /></g>
    </svg>
  );
}

function SaisonCourgette({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="legume"><path d="M14 58 C 10 52, 14 44, 22 40 L58 20 C 66 16, 74 22, 70 30 C 66 36, 60 38, 30 60 C 24 64, 18 64, 14 58 Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="stries"><path d="M22 48 L58 28 M24 56 L62 34" stroke="#1B6B45" strokeWidth="2.5" strokeLinecap="round" fill="none" /></g><g data-part="pedoncule"><path d="M66 22 L74 14" stroke="#1B6B45" strokeWidth="5" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function SaisonEndive({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="feuilles"><path d="M40 6 C 54 14, 58 40, 52 70 C 46 76, 34 76, 28 70 C 22 40, 26 14, 40 6 Z" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="pointes"><path d="M40 6 C 48 10, 52 18, 54 26 C 46 22, 42 18, 40 12 C 38 18, 34 22, 26 26 C 28 18, 32 10, 40 6 Z" fill="#FFC93C" /></g><g data-part="lignes"><path d="M40 20 V70 M34 30 C 32 44, 32 58, 34 70 M46 30 C 48 44, 48 58, 46 70" stroke="#FFC93C" strokeWidth="1.8" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function SaisonFraise({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="fruit"><path d="M20 30 C 20 22, 30 20, 40 22 C 50 20, 60 22, 60 30 C 60 48, 48 66, 40 74 C 32 66, 20 48, 20 30 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="graines"><ellipse cx="30" cy="34" rx="1.4" ry="2.2" fill="#FFF3DC" /><ellipse cx="40" cy="32" rx="1.4" ry="2.2" fill="#FFF3DC" /><ellipse cx="50" cy="34" rx="1.4" ry="2.2" fill="#FFF3DC" /><ellipse cx="34" cy="44" rx="1.4" ry="2.2" fill="#FFF3DC" /><ellipse cx="46" cy="44" rx="1.4" ry="2.2" fill="#FFF3DC" /><ellipse cx="40" cy="54" rx="1.4" ry="2.2" fill="#FFF3DC" /><ellipse cx="30" cy="50" rx="1.4" ry="2.2" fill="#FFF3DC" /><ellipse cx="50" cy="50" rx="1.4" ry="2.2" fill="#FFF3DC" /><ellipse cx="40" cy="64" rx="1.4" ry="2.2" fill="#FFF3DC" /></g><g data-part="collerette"><path d="M40 24 L30 14 L38 20 L40 10 L42 20 L50 14 L44 24 L54 26 L40 28 L26 26 Z" fill="#2FBF71" /></g>
    </svg>
  );
}

function SaisonHiverFlocons({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={390} height={300} viewBox="0 0 390 300" fill="none" {...svgProps}>
      {children}
      <g data-part="flocons"><circle cx="30" cy="30" r="3.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="80" cy="90" r="2.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="140" cy="40" r="2.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="190" cy="120" r="3.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="240" cy="70" r="2.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="290" cy="140" r="2.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="340" cy="30" r="3.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="360" cy="110" r="2.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="60" cy="150" r="2.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="120" cy="180" r="3.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="210" cy="20" r="2.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="270" cy="190" r="2.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="20" cy="200" r="3.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="330" cy="180" r="2.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /><circle cx="160" cy="90" r="2.5" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /></g>
    </svg>
  );
}

function SaisonHiverNeige({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={390} height={300} viewBox="0 0 390 300" fill="none" {...svgProps}>
      {children}
      <g data-part="neige-colline-arriere"><path d="M 31.8 198.5 L 37.6 195.3 L 43.4 192.3 L 49.2 189.5 L 55.0 187.0 L 60.9 184.7 L 66.8 182.7 L 72.6 180.9 L 78.5 179.3 L 84.4 178.0 L 90.3 176.9 L 96.2 176.1 L 102.0 175.5 L 107.9 175.1 L 113.8 175.0 L 119.6 175.1 L 125.4 175.5 L 131.2 176.1 L 137.0 176.9 L 142.8 178.0 L 148.5 179.3 L 154.3 180.9 L 160.0 182.7 L 165.6 184.7 L 171.3 187.0 L 176.8 189.5 L 182.4 192.3 L 187.9 195.3 L 193.4 198.5 Q 177.2 208 161.1 200 Q 144.9 204 128.7 200 Q 112.6 208 96.4 200 Q 80.3 204 64.1 200 Q 47.9 208 31.8 200 Z" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /></g><g data-part="neige-colline-avant"><path d="M 206.4 205.7 L 212.1 203.0 L 217.7 200.5 L 223.4 198.2 L 229.1 196.1 L 234.9 194.2 L 240.6 192.6 L 246.4 191.1 L 252.2 189.9 L 258.0 188.9 L 263.8 188.0 L 269.6 187.4 L 275.4 187.1 L 281.3 186.9 L 287.1 186.9 L 293.0 187.1 L 298.9 187.6 L 304.7 188.3 L 310.6 189.1 L 316.5 190.2 L 322.5 191.5 L 328.4 193.0 L 334.3 194.7 L 340.3 196.6 L 346.2 198.7 L 352.2 201.0 L 358.1 203.6 L 364.1 206.3 Q 348.3 216 332.6 208 Q 316.8 212 301.0 208 Q 285.2 216 269.5 208 Q 253.7 212 237.9 208 Q 222.2 216 206.4 208 Z" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /></g><g data-part="neige-sol"><path d="M0 240 H390 V252 Q 375 247 360 253 Q 345 247 330 254 Q 312 246 296 253 Q 280 247 262 254 Q 245 246 228 253 Q 212 247 195 254 Q 178 246 160 253 Q 144 247 128 254 Q 110 246 94 253 Q 78 247 62 254 Q 45 246 30 253 Q 15 247 0 252 Z" fill="#FFFFFF" stroke="#1F1A17" strokeWidth="1.2" /></g>
    </svg>
  );
}

function SaisonKiwi({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="peau"><ellipse cx="40" cy="42" rx="30" ry="28" fill="#1B6B45" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="chair"><ellipse cx="40" cy="42" rx="25" ry="23" fill="#2FBF71" /></g><g data-part="coeur"><ellipse cx="40" cy="42" rx="9" ry="8" fill="#FFF3DC" /></g><g data-part="pepins"><ellipse cx="54.0" cy="42.0" rx="1.2" ry="2.2" transform="rotate(90 54.0 42.0)" fill="#1F1A17" /><ellipse cx="52.1" cy="48.5" rx="1.2" ry="2.2" transform="rotate(120 52.1 48.5)" fill="#1F1A17" /><ellipse cx="47.0" cy="53.3" rx="1.2" ry="2.2" transform="rotate(150 47.0 53.3)" fill="#1F1A17" /><ellipse cx="40.0" cy="55.0" rx="1.2" ry="2.2" transform="rotate(180 40.0 55.0)" fill="#1F1A17" /><ellipse cx="33.0" cy="53.3" rx="1.2" ry="2.2" transform="rotate(210 33.0 53.3)" fill="#1F1A17" /><ellipse cx="27.9" cy="48.5" rx="1.2" ry="2.2" transform="rotate(240 27.9 48.5)" fill="#1F1A17" /><ellipse cx="26.0" cy="42.0" rx="1.2" ry="2.2" transform="rotate(270 26.0 42.0)" fill="#1F1A17" /><ellipse cx="27.9" cy="35.5" rx="1.2" ry="2.2" transform="rotate(300 27.9 35.5)" fill="#1F1A17" /><ellipse cx="33.0" cy="30.7" rx="1.2" ry="2.2" transform="rotate(330 33.0 30.7)" fill="#1F1A17" /><ellipse cx="40.0" cy="29.0" rx="1.2" ry="2.2" transform="rotate(360 40.0 29.0)" fill="#1F1A17" /><ellipse cx="47.0" cy="30.7" rx="1.2" ry="2.2" transform="rotate(390 47.0 30.7)" fill="#1F1A17" /><ellipse cx="52.1" cy="35.5" rx="1.2" ry="2.2" transform="rotate(420 52.1 35.5)" fill="#1F1A17" /></g>
    </svg>
  );
}

function SaisonMelon({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="ecorce"><path d="M8 40 C 8 62, 22 72, 40 72 C 58 72, 72 62, 72 40 Z" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="chair"><path d="M14 40 C 14 58, 26 66, 40 66 C 54 66, 66 58, 66 40 Z" fill="#FFC93C" /></g><g data-part="graines"><ellipse cx="28" cy="46" rx="1.6" ry="2.6" fill="#1F1A17" /><ellipse cx="34" cy="50" rx="1.6" ry="2.6" fill="#1F1A17" /><ellipse cx="40" cy="52" rx="1.6" ry="2.6" fill="#1F1A17" /><ellipse cx="46" cy="50" rx="1.6" ry="2.6" fill="#1F1A17" /><ellipse cx="52" cy="46" rx="1.6" ry="2.6" fill="#1F1A17" /></g><g data-part="bord"><path d="M8 40 H72" stroke="#1F1A17" strokeWidth="1.5" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function SaisonPetitsPois({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="cosse"><path d="M8 44 C 18 26, 52 20, 72 30 C 62 52, 30 60, 8 44 Z" fill="#1B6B45" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="pois"><circle cx="22" cy="40" r="7" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="34" cy="36" r="7" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="46" cy="34" r="7" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="58" cy="34" r="7" fill="#2FBF71" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="queue"><path d="M72 30 C 76 26, 76 20, 72 16" stroke="#1B6B45" strokeWidth="3" strokeLinecap="round" fill="none" /></g>
    </svg>
  );
}

function SaisonPoire({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="fruit"><path d="M40 14 C 32 14, 30 26, 30 32 C 30 38, 18 44, 18 56 C 18 68, 28 74, 40 74 C 52 74, 62 68, 62 56 C 62 44, 50 38, 50 32 C 50 26, 48 14, 40 14 Z" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="queue"><path d="M40 15 C 40 10, 42 6, 45 4" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g><g data-part="feuille"><path d="M42 9 C 46 2, 55 2, 58 5 C 54 10, 47 12, 42 9 Z" fill="#2FBF71" /></g><g data-part="tache"><circle cx="48" cy="58" r="2" fill="#2FBF71" /><circle cx="32" cy="62" r="1.6" fill="#2FBF71" /></g>
    </svg>
  );
}

function SaisonPoireau({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="feuilles"><path d="M36 40 C 30 26, 20 14, 8 6 C 22 10, 34 20, 40 32 Z" fill="#1B6B45" /><path d="M42 40 C 46 24, 56 12, 72 6 C 60 14, 50 26, 46 40 Z" fill="#2FBF71" /><path d="M38 40 C 38 26, 40 14, 42 4 C 44 16, 44 28, 43 40 Z" fill="#1B6B45" /></g><g data-part="fut"><rect x="34" y="38" width="12" height="32" rx="5" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="racines"><path d="M36 70 L32 76 M40 70 V77 M44 70 L48 76" stroke="#1F1A17" strokeWidth="1.6" strokeLinecap="round" /></g>
    </svg>
  );
}

function SaisonPomme({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="fruit"><path d="M40 26 C 26 18, 12 28, 14 46 C 16 62, 28 72, 40 68 C 52 72, 64 62, 66 46 C 68 28, 54 18, 40 26 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="queue"><path d="M40 27 C 40 20, 42 14, 45 10" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g><g data-part="feuille"><path d="M44 16 C 50 8, 60 8, 64 12 C 58 18, 50 20, 44 16 Z" fill="#1B6B45" /></g><g data-part="reflet"><ellipse cx="28" cy="40" rx="4" ry="7" transform="rotate(20 28 40)" fill="#FFF3DC" opacity="0.6" /></g>
    </svg>
  );
}

function SaisonPrintempsPetale({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...svgProps}>
      {children}
      <g data-part="petale"><path d="M8 2 C 13 5, 13 11, 8 14 C 3 11, 3 5, 8 2 Z" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1" /></g>
    </svg>
  );
}

function SaisonRadis({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="fanes"><path d="M38 34 C 30 22, 20 16, 14 16 C 18 26, 28 32, 38 34 Z" fill="#2FBF71" /><path d="M42 34 C 48 20, 58 12, 66 12 C 62 24, 52 32, 42 34 Z" fill="#1B6B45" /></g><g data-part="racine"><path d="M40 32 C 54 32, 60 42, 58 52 C 56 60, 48 64, 40 64 C 32 64, 24 60, 22 52 C 20 42, 26 32, 40 32 Z" fill="#FF8FB1" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="pointe"><path d="M34 62 C 36 66, 38 70, 40 76 C 42 70, 44 66, 46 62 Z" fill="#FFF3DC" stroke="#1F1A17" strokeWidth="1.5" /></g>
    </svg>
  );
}

function SaisonRaisin({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="feuille"><path d="M42 6 C 52 2, 66 8, 64 18 C 58 20, 48 18, 42 14 Z" fill="#2FBF71" /></g><g data-part="tige"><path d="M40 6 V18" stroke="#1F1A17" strokeWidth="3" strokeLinecap="round" /></g><g data-part="grains"><circle cx="30" cy="24" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="42" cy="22" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="54" cy="26" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="24" cy="36" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="36" cy="34" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="48" cy="34" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="60" cy="38" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="30" cy="46" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="42" cy="46" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="54" cy="48" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="36" cy="58" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="48" cy="58" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="42" cy="69" r="7.5" fill="#2D4BFF" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="reflets"><circle cx="28" cy="22" r="1.8" fill="#FFF3DC" /><circle cx="46" cy="32" r="1.8" fill="#FFF3DC" /><circle cx="34" cy="56" r="1.8" fill="#FFF3DC" /></g>
    </svg>
  );
}

function SaisonTomate({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={80} height={80} viewBox="0 0 80 80" fill="none" {...svgProps}>
      {children}
      <g data-part="fruit"><path d="M40 22 C 58 20, 70 32, 68 48 C 66 64, 54 72, 40 72 C 26 72, 14 64, 12 48 C 10 32, 22 20, 40 22 Z" fill="#FF4F2E" stroke="#1F1A17" strokeWidth="1.5" /></g><g data-part="collerette"><path d="M40 26 L34 18 L40 22 L44 14 L44 22 L52 18 L46 26 L54 28 L44 29 L40 34 L36 29 L26 28 Z" fill="#2FBF71" /></g><g data-part="reflet"><ellipse cx="26" cy="42" rx="4" ry="7" transform="rotate(20 26 42)" fill="#FFF3DC" opacity="0.6" /></g>
    </svg>
  );
}

function ScenePaysage({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={390} height={300} viewBox="0 0 390 300" fill="none" {...svgProps}>
      {children}
      <g data-part="ciel"><rect width="390" height="300" fill="#FFF3DC" /></g><g data-part="halo-soleil" opacity="0"><circle cx="318" cy="66" r="50" fill="#FFC93C" /></g><g data-part="soleil"><circle cx="318" cy="66" r="42" fill="#FF4F2E" /><g data-part="crateres" opacity="0"><circle cx="302" cy="54" r="7" fill="#FFC93C" fillOpacity="0.45" /><circle cx="332" cy="80" r="9" fill="#FFC93C" fillOpacity="0.45" /><circle cx="326" cy="48" r="4" fill="#FFC93C" fillOpacity="0.45" /></g></g><g data-part="nuage-1"><ellipse cx="86" cy="56" rx="44" ry="15" fill="#FF8FB1" /><ellipse cx="116" cy="44" rx="24" ry="12" fill="#FF8FB1" /></g><g data-part="nuage-2"><ellipse cx="226" cy="96" rx="26" ry="9" fill="#FF8FB1" /></g><g data-part="colline-arriere"><path d="M-30 250 C 60 150, 170 150, 250 250 Z" fill="#2D4BFF" /></g><g data-part="colline-avant"><path d="M140 255 C 230 165, 330 165, 430 250 Z" fill="#2FBF71" /></g><g data-part="sol"><rect y="240" width="390" height="60" fill="#2FBF71" /></g>
    </svg>
  );
}

function Tournesol({ svgProps, children }: GeneratedSvgProps) {
  return (
    <svg width={60} height={80} viewBox="0 0 60 80" fill="none" {...svgProps}>
      {children}
      <g data-part="tige"><path d="M30 78 V30" stroke="#1B6B45" strokeWidth="4" strokeLinecap="round" fill="none" /></g><g data-part="feuilles"><path d="M30 62 C 18 58, 12 50, 12 44 C 22 46, 28 52, 30 60 Z" fill="#2FBF71" /><path d="M30 52 C 42 48, 48 40, 48 34 C 38 36, 32 42, 30 50 Z" fill="#1B6B45" /></g><g data-part="petales"><ellipse cx="30" cy="8" rx="3.5" ry="7" transform="rotate(0 30 20)" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="8" rx="3.5" ry="7" transform="rotate(30 30 20)" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="8" rx="3.5" ry="7" transform="rotate(60 30 20)" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="8" rx="3.5" ry="7" transform="rotate(90 30 20)" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="8" rx="3.5" ry="7" transform="rotate(120 30 20)" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="8" rx="3.5" ry="7" transform="rotate(150 30 20)" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="8" rx="3.5" ry="7" transform="rotate(180 30 20)" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="8" rx="3.5" ry="7" transform="rotate(210 30 20)" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="8" rx="3.5" ry="7" transform="rotate(240 30 20)" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="8" rx="3.5" ry="7" transform="rotate(270 30 20)" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="8" rx="3.5" ry="7" transform="rotate(300 30 20)" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /><ellipse cx="30" cy="8" rx="3.5" ry="7" transform="rotate(330 30 20)" fill="#FFC93C" stroke="#1F1A17" strokeWidth="1" /></g><g data-part="coeur"><circle cx="30" cy="20" r="7" fill="#1B6B45" stroke="#1F1A17" strokeWidth="1.5" /><circle cx="28" cy="18" r="1.2" fill="#FFC93C" /><circle cx="32" cy="21" r="1.2" fill="#FFC93C" /></g>
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
  "arbre-1-grand-epanoui": Arbre1GrandEpanoui,
  "arbre-1-jeune": Arbre1Jeune,
  "arbre-1-pousse": Arbre1Pousse,
  "arbre-2-grand": Arbre2Grand,
  "arbre-2-grand-epanoui": Arbre2GrandEpanoui,
  "arbre-2-jeune": Arbre2Jeune,
  "arbre-2-pousse": Arbre2Pousse,
  "arbre-3-grand": Arbre3Grand,
  "arbre-3-grand-epanoui": Arbre3GrandEpanoui,
  "arbre-3-jeune": Arbre3Jeune,
  "arbre-3-pousse": Arbre3Pousse,
  "arbre-4-grand": Arbre4Grand,
  "arbre-4-grand-epanoui": Arbre4GrandEpanoui,
  "arbre-4-jeune": Arbre4Jeune,
  "arbre-4-pousse": Arbre4Pousse,
  "arbre-5-grand": Arbre5Grand,
  "arbre-5-grand-epanoui": Arbre5GrandEpanoui,
  "arbre-5-jeune": Arbre5Jeune,
  "arbre-5-pousse": Arbre5Pousse,
  "arbre-6-grand": Arbre6Grand,
  "arbre-6-grand-epanoui": Arbre6GrandEpanoui,
  "arbre-6-jeune": Arbre6Jeune,
  "arbre-6-pousse": Arbre6Pousse,
  "arrosage": Arrosage,
  "badge-arrosage": BadgeArrosage,
  "balance": Balance,
  "brume": Brume,
  "champignons": Champignons,
  "cigale": Cigale,
  "coccinelle": Coccinelle,
  "coquelicot": Coquelicot,
  "eclat": Eclat,
  "ecureuil": Ecureuil,
  "escargot": Escargot,
  "escargot-endormi": EscargotEndormi,
  "etoiles": Etoiles,
  "fleur-1-fleurie": Fleur1Fleurie,
  "fleur-1-fleurie-epanoui": Fleur1FleurieEpanoui,
  "fleur-1-pousse": Fleur1Pousse,
  "fleur-2-fleurie": Fleur2Fleurie,
  "fleur-2-fleurie-epanoui": Fleur2FleurieEpanoui,
  "fleur-2-pousse": Fleur2Pousse,
  "fleur-3-fleurie": Fleur3Fleurie,
  "fleur-3-fleurie-epanoui": Fleur3FleurieEpanoui,
  "fleur-3-pousse": Fleur3Pousse,
  "fleur-4-fleurie": Fleur4Fleurie,
  "fleur-4-fleurie-epanoui": Fleur4FleurieEpanoui,
  "fleur-4-pousse": Fleur4Pousse,
  "fleur-5-fleurie": Fleur5Fleurie,
  "fleur-5-fleurie-epanoui": Fleur5FleurieEpanoui,
  "fleur-5-pousse": Fleur5Pousse,
  "fleur-6-fleurie": Fleur6Fleurie,
  "fleur-6-fleurie-epanoui": Fleur6FleurieEpanoui,
  "fleur-6-pousse": Fleur6Pousse,
  "herisson": Herisson,
  "herisson-endormi": HerissonEndormi,
  "hibou": Hibou,
  "hibou-endormi": HibouEndormi,
  "hirondelle": Hirondelle,
  "houx": Houx,
  "jonquille": Jonquille,
  "libellule": Libellule,
  "lune": Lune,
  "oiseau": Oiseau,
  "oiseau-endormi": OiseauEndormi,
  "oiseau-vol": OiseauVol,
  "papillon": Papillon,
  "perce-neige": PerceNeige,
  "picto-armoire": PictoArmoire,
  "picto-arrosoir": PictoArrosoir,
  "picto-aspirateur": PictoAspirateur,
  "picto-autocar": PictoAutocar,
  "picto-avion": PictoAvion,
  "picto-biere": PictoBiere,
  "picto-boisson-soja": PictoBoissonSoja,
  "picto-box-internet": PictoBoxInternet,
  "picto-bus": PictoBus,
  "picto-cafe": PictoCafe,
  "picto-canape": PictoCanape,
  "picto-casque-vr": PictoCasqueVr,
  "picto-chaise": PictoChaise,
  "picto-chaussures": PictoChaussures,
  "picto-chemise": PictoChemise,
  "picto-covoiturage": PictoCovoiturage,
  "picto-eau-bouteille": PictoEauBouteille,
  "picto-eau-robinet": PictoEauRobinet,
  "picto-ecran": PictoEcran,
  "picto-four": PictoFour,
  "picto-garder": PictoGarder,
  "picto-generique": PictoGenerique,
  "picto-intercites": PictoIntercites,
  "picto-jean": PictoJean,
  "picto-lait-vache": PictoLaitVache,
  "picto-lave-linge": PictoLaveLinge,
  "picto-lave-vaisselle": PictoLaveVaisselle,
  "picto-lit": PictoLit,
  "picto-livraison-domicile": PictoLivraisonDomicile,
  "picto-magasin-pied": PictoMagasinPied,
  "picto-magasin-voiture": PictoMagasinVoiture,
  "picto-manteau": PictoManteau,
  "picto-marche": PictoMarche,
  "picto-metro": PictoMetro,
  "picto-micro-ondes": PictoMicroOndes,
  "picto-moto": PictoMoto,
  "picto-occasion": PictoOccasion,
  "picto-ordinateur": PictoOrdinateur,
  "picto-point-relais-pied": PictoPointRelaisPied,
  "picto-point-relais-voiture": PictoPointRelaisVoiture,
  "picto-pull": PictoPull,
  "picto-refrigerateur": PictoRefrigerateur,
  "picto-repas-boeuf": PictoRepasBoeuf,
  "picto-repas-poisson": PictoRepasPoisson,
  "picto-repas-poulet": PictoRepasPoulet,
  "picto-repas-vegetalien": PictoRepasVegetalien,
  "picto-repas-vegetarien": PictoRepasVegetarien,
  "picto-rer": PictoRer,
  "picto-robe": PictoRobe,
  "picto-scooter": PictoScooter,
  "picto-smartphone": PictoSmartphone,
  "picto-soda": PictoSoda,
  "picto-streaming": PictoStreaming,
  "picto-sweat": PictoSweat,
  "picto-table": PictoTable,
  "picto-tablette": PictoTablette,
  "picto-television": PictoTelevision,
  "picto-ter": PictoTer,
  "picto-tgv": PictoTgv,
  "picto-the": PictoThe,
  "picto-tram": PictoTram,
  "picto-trottinette": PictoTrottinette,
  "picto-tshirt": PictoTshirt,
  "picto-velo": PictoVelo,
  "picto-velo-cargo": PictoVeloCargo,
  "picto-velo-electrique": PictoVeloElectrique,
  "picto-vin": PictoVin,
  "picto-visio": PictoVisio,
  "picto-voiture": PictoVoiture,
  "picto-voiture-electrique": PictoVoitureElectrique,
  "picto-voiture-hybride": PictoVoitureHybride,
  "primevere": Primevere,
  "renard": Renard,
  "renard-endormi": RenardEndormi,
  "rouge-gorge": RougeGorge,
  "rouge-gorge-endormi": RougeGorgeEndormi,
  "saison-abricot": SaisonAbricot,
  "saison-asperge": SaisonAsperge,
  "saison-aubergine": SaisonAubergine,
  "saison-automne-feuille-1": SaisonAutomneFeuille1,
  "saison-automne-feuille-2": SaisonAutomneFeuille2,
  "saison-betterave": SaisonBetterave,
  "saison-carotte": SaisonCarotte,
  "saison-cerise": SaisonCerise,
  "saison-chou": SaisonChou,
  "saison-clementine": SaisonClementine,
  "saison-courge": SaisonCourge,
  "saison-courgette": SaisonCourgette,
  "saison-endive": SaisonEndive,
  "saison-fraise": SaisonFraise,
  "saison-hiver-flocons": SaisonHiverFlocons,
  "saison-hiver-neige": SaisonHiverNeige,
  "saison-kiwi": SaisonKiwi,
  "saison-melon": SaisonMelon,
  "saison-petits-pois": SaisonPetitsPois,
  "saison-poire": SaisonPoire,
  "saison-poireau": SaisonPoireau,
  "saison-pomme": SaisonPomme,
  "saison-printemps-petale": SaisonPrintempsPetale,
  "saison-radis": SaisonRadis,
  "saison-raisin": SaisonRaisin,
  "saison-tomate": SaisonTomate,
  "scene-paysage": ScenePaysage,
  "tournesol": Tournesol,
  "vent": Vent,
};
