// Polices du site, partagées par les deux mises en page racines et la 404. Fichiers dans le
// dépôt (assets/fonts, voir son README) : le build ne dépend d'aucun service extérieur. Ce
// sont les fichiers que Google Fonts servait (mêmes octets), avec les mêmes @font-face : un
// par sous-ensemble (latin, latin étendu, vietnamien) et sa plage unicode, le latin seul
// préchargé. Plages unicode : celles de l'API CSS de Google Fonts, écrites en toutes lettres
// (next/font exige des littéraux).
//
// Les variables --font-bricolage et --font-dm-sans et les polices de repli ajustées sur Arial
// sont dans globals.css, aux valeurs exactes de next/font/google : next/font/local nommerait
// la famille d'après la constante et recalculerait le repli à partir du fichier, autrement.
// Les variables --font-face-* ne servent qu'à inclure chaque @font-face.
import localFont from "next/font/local";

// Bricolage Grotesque 800. Le latin est préchargé ; les autres sous-ensembles ne se chargent
// que si un caractère de leur plage apparaît.
const bricolage = localFont({
  src: "../../assets/fonts/bricolage-grotesque-800-latin.woff2",
  weight: "800",
  style: "normal",
  display: "swap",
  variable: "--font-face-bricolage-latin",
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "Bricolage Grotesque" },
    { prop: "font-stretch", value: "100%" },
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});
const bricolageLatinExt = localFont({
  src: "../../assets/fonts/bricolage-grotesque-800-latin-ext.woff2",
  weight: "800",
  style: "normal",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-face-bricolage-latin-ext",
  declarations: [
    { prop: "font-family", value: "Bricolage Grotesque" },
    { prop: "font-stretch", value: "100%" },
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF",
    },
  ],
});
const bricolageVietnamese = localFont({
  src: "../../assets/fonts/bricolage-grotesque-800-vietnamese.woff2",
  weight: "800",
  style: "normal",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-face-bricolage-vietnamese",
  declarations: [
    { prop: "font-family", value: "Bricolage Grotesque" },
    { prop: "font-stretch", value: "100%" },
    {
      prop: "unicode-range",
      value:
        "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB",
    },
  ],
});

// DM Sans 400 et 600 : un seul fichier (police variable) par sous-ensemble, déclaré pour
// chaque graisse, comme Google Fonts.
const dmSans = localFont({
  src: [
    { path: "../../assets/fonts/dm-sans-latin.woff2", weight: "400" },
    { path: "../../assets/fonts/dm-sans-latin.woff2", weight: "600" },
  ],
  style: "normal",
  display: "swap",
  variable: "--font-face-dm-sans-latin",
  adjustFontFallback: false,
  declarations: [
    { prop: "font-family", value: "DM Sans" },
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});
const dmSansLatinExt = localFont({
  src: [
    { path: "../../assets/fonts/dm-sans-latin-ext.woff2", weight: "400" },
    { path: "../../assets/fonts/dm-sans-latin-ext.woff2", weight: "600" },
  ],
  style: "normal",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-face-dm-sans-latin-ext",
  declarations: [
    { prop: "font-family", value: "DM Sans" },
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF",
    },
  ],
});

/** Classes à poser sur <html> : elles incluent les @font-face de chaque sous-ensemble. */
export const FONT_CLASSES = [
  bricolage,
  bricolageLatinExt,
  bricolageVietnamese,
  dmSans,
  dmSansLatinExt,
]
  .map((font) => font.variable)
  .join(" ");
