import type { MetadataRoute } from "next";
import { isLaunched, robotsFile, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Fermé tant que SITE_LAUNCHED=1 n'est pas défini ; /labo toujours exclu. */
export default function robots(): MetadataRoute.Robots {
  return robotsFile(isLaunched(), siteUrl());
}
