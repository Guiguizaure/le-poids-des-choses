import type { Metadata } from "next";
import { CarnetScreen } from "@/components/garden/CarnetScreen";
import { PAGES } from "@/lib/i18n/messages/common";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  ...PAGES.en.carnet,
  path: "/jardin/carnet",
  locale: "en",
});

export default function JournalPage() {
  return <CarnetScreen />;
}
