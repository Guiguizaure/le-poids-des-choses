import type { Metadata } from "next";
import { RaconteScreen } from "@/components/raconte/RaconteScreen";
import { PAGES } from "@/lib/i18n/messages/common";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  ...PAGES.fr.raconte,
  path: "/raconte",
});

export default function RacontePage() {
  return <RaconteScreen />;
}
