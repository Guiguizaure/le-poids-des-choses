import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Le poids des choses",
  description:
    "Compare deux gestes du quotidien sur une balance et regarde ton jardin grandir avec les kilos de CO2e évités.",
  // À retirer au lancement du site.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body className="bg-creme text-encre font-texte min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
