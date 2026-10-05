import type { Metadata } from "next";
import { pageMetadata, siteUrl } from "@/lib/site";
import { GardenScreen } from "@/components/garden/GardenScreen";

export const metadata: Metadata = pageMetadata({
  title: "Mon jardin",
  description:
    "Ton jardin grandit chaque fois que tu choisis l’option la plus légère, choix après choix.",
  path: "/jardin",
});

export default function JardinPage() {
  return <GardenScreen siteUrl={siteUrl()} />;
}
