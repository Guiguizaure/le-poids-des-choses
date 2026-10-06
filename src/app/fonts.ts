// Polices du site, partagées par les deux mises en page racines et la 404.
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: "800",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

/** Classes à poser sur <html> : variables CSS des deux polices. */
export const FONT_CLASSES = `${bricolage.variable} ${dmSans.variable}`;
