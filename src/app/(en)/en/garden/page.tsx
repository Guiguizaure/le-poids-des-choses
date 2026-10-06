import type { Metadata } from "next";
import { GardenScreen } from "@/components/garden/GardenScreen";
import { PAGES } from "@/lib/i18n/messages/common";
import { pageMetadata, siteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  ...PAGES.en.jardin,
  path: "/jardin",
  locale: "en",
});

export default function GardenPage() {
  return <GardenScreen siteUrl={siteUrl()} />;
}
