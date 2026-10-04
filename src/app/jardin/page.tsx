import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { GardenScreen } from "@/components/garden/GardenScreen";

export const metadata: Metadata = pageMetadata({
  title: "Mon jardin",
  description:
    "Ton jardin grandit avec les kilos de CO2e que tu évites, choix après choix.",
  path: "/jardin",
});

export default function JardinPage() {
  return <GardenScreen />;
}
