import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { FONT_CLASSES } from "@/app/fonts";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { LanguageBanner } from "@/components/layout/LanguageBanner";
import type { Locale } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { SITE } from "@/lib/i18n/messages/common";
import {
  isLaunched,
  pageMetadata,
  robotsMeta,
  SITE_NAME,
  siteUrl,
} from "@/lib/site";

/** Métadonnées communes d'une langue (mise en page racine). */
export function rootMetadata(locale: Locale): Metadata {
  return {
    ...pageMetadata({ path: "/", locale }),
    metadataBase: new URL(siteUrl()),
    applicationName: SITE_NAME,
    // noindex tant que SITE_LAUNCHED=1 n'est pas défini au build.
    robots: robotsMeta(isLaunched()),
    manifest:
      locale === "en" ? "/en/manifest.webmanifest" : "/manifest.webmanifest",
    // Logo « Horizon-balance » : emblème simplifié en SVG (sizes « any » : Chrome le préfère
    // aux PNG), PNG 32 et 16 px en secours (Safari) ; /favicon.ico reste servi sans lien.
    icons: {
      icon: [
        { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
        {
          url: "/icons/embleme-petit.svg",
          sizes: "any",
          type: "image/svg+xml",
        },
      ],
      apple: { url: "/icons/apple-touch-icon-180.png", sizes: "180x180" },
    },
    appleWebApp: {
      capable: true,
      title: SITE[locale].shortName,
      statusBarStyle: "default",
    },
  };
}

export const ROOT_VIEWPORT: Viewport = { themeColor: "#FFF3DC" };

/**
 * Document d'une langue : <html lang>, polices, langue des composants clients, pied de page.
 * Sur les pages françaises, le bandeau qui propose la version anglaise aux navigateurs en
 * anglais (jamais de redirection).
 */
export function RootDocument({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    // `data-garden` : posé avant le premier affichage par le script en ligne de l'accueil
    // (HomeScreen), donc absent du rendu serveur.
    <html lang={locale} className={FONT_CLASSES} suppressHydrationWarning>
      <body className="bg-creme text-encre font-texte flex min-h-screen flex-col antialiased">
        <LocaleProvider locale={locale}>
          {children}
          <SiteFooter locale={locale} />
          {locale === "fr" ? <LanguageBanner /> : null}
        </LocaleProvider>
      </body>
    </html>
  );
}
