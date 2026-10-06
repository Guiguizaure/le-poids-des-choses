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
