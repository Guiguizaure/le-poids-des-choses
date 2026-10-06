import type { Metadata } from "next";
import { RaconteScreen } from "@/components/raconte/RaconteScreen";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Raconte ta journée",
  description:
    "Écris ta journée en quelques phrases : Claude repère tes gestes, tu vérifies tout avant de les noter dans ton carnet.",
  path: "/raconte",
});

export default function RacontePage() {
  return <RaconteScreen />;
}
