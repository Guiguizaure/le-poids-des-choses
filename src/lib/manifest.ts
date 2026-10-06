// Manifeste d'installation (PWA) de chaque langue : même appli (même `id`), nom et
// description dans la langue, ouverture sur l'accueil de la langue.
import type { MetadataRoute } from "next";
import { localizedPath, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/i18n/messages/common";
import { SITE_NAME } from "@/lib/site";

export function manifestFor(locale: Locale): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_NAME,
    short_name: SITE[locale].shortName,
    description: SITE[locale].description,
    lang: locale,
    start_url: localizedPath("/", locale),
    scope: "/",
    display: "standalone",
    background_color: "#FFF3DC",
    theme_color: "#FFF3DC",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
