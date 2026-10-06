import type { MetadataRoute } from "next";
import { manifestFor } from "@/lib/manifest";

export const dynamic = "force-static";

/** Installation (PWA) : pas de service worker pour l'instant. Anglais : /en/manifest.webmanifest. */
export default function manifest(): MetadataRoute.Manifest {
  return manifestFor("fr");
}
