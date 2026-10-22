import type { Metadata } from "next";
import { RaconteScreen } from "@/components/raconte/RaconteScreen";
import { PAGES } from "@/lib/i18n/messages/common";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  ...PAGES.en.raconte,
  path: "/raconte",
  locale: "en",
});

export default function YourDayPage() {
  return <RaconteScreen />;
}
