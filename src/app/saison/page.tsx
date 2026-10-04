import type { Metadata } from "next";
import { SaisonScreen } from "@/components/saison/SaisonScreen";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "De saison",
  description:
    "Les fruits et légumes de saison, mois par mois, classés par impact carbone au kilo (Impact CO2, ADEME).",
  path: "/saison",
});

export default function SaisonPage() {
  return <SaisonScreen />;
}
