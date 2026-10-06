import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareFlow } from "@/components/compare/CompareFlow";
import { PAGES } from "@/lib/i18n/messages/common";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  ...PAGES.en.comparer,
  path: "/comparer",
  locale: "en",
});

export default function ComparePage() {
  // The comparison is read from the URL on the client (static export).
  return (
    <Suspense fallback={<main className="min-h-screen" aria-busy="true" />}>
      <CompareFlow />
    </Suspense>
  );
}
