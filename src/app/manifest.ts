import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

/** Installation (PWA) : pas de service worker pour l'instant. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Le poids",
    description: SITE_DESCRIPTION,
    lang: "fr",
    start_url: "/",
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
