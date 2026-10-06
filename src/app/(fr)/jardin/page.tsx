import type { Metadata } from "next";
import { PAGES } from "@/lib/i18n/messages/common";
import { pageMetadata, siteUrl } from "@/lib/site";
import { GardenScreen } from "@/components/garden/GardenScreen";

export const metadata: Metadata = pageMetadata({
  ...PAGES.fr.jardin,
  path: "/jardin",
});

export default function JardinPage() {
  return <GardenScreen siteUrl={siteUrl()} />;
}
