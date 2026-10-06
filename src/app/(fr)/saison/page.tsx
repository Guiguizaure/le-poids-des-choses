import type { Metadata } from "next";
import { SaisonScreen } from "@/components/saison/SaisonScreen";
import { PAGES } from "@/lib/i18n/messages/common";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  ...PAGES.fr.saison,
  path: "/saison",
});

export default function SaisonPage() {
  return <SaisonScreen />;
}
