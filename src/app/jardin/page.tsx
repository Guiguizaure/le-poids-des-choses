import type { Metadata } from "next";
import { GardenScreen } from "@/components/garden/GardenScreen";

export const metadata: Metadata = {
  title: "Mon jardin — Le poids des choses",
  description:
    "Ton jardin grandit avec les kilos de CO2e que tu évites, choix après choix.",
};

export default function JardinPage() {
  return <GardenScreen />;
}
