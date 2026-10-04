import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { isLaunched, pageMetadata, robotsMeta, siteUrl } from "@/lib/site";
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
  ...pageMetadata({ path: "/" }),
  metadataBase: new URL(siteUrl()),
  applicationName: "Le poids des choses",
  // noindex tant que SITE_LAUNCHED=1 n'est pas défini au build.
  robots: robotsMeta(isLaunched()),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, title: "Le poids", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#FFF3DC" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${dmSans.variable}`}>
      <body className="bg-creme text-encre font-texte flex min-h-screen flex-col antialiased">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
