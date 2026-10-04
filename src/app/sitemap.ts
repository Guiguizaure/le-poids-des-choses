import type { MetadataRoute } from "next";
import { isLaunched, siteUrl, sitemapEntries } from "@/lib/site";

export const dynamic = "force-static";

/** Vide tant que SITE_LAUNCHED=1 n'est pas défini ; jamais /labo. */
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(isLaunched(), siteUrl());
}
