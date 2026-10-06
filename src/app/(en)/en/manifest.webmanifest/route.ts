import { manifestFor } from "@/lib/manifest";

export const dynamic = "force-static";

/** Manifeste d'installation des pages anglaises (ouverture sur /en). */
export function GET() {
  return new Response(JSON.stringify(manifestFor("en")), {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
