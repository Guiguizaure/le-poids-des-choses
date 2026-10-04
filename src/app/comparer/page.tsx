import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { Suspense } from "react";
import { CompareFlow } from "@/components/compare/CompareFlow";

export const metadata: Metadata = pageMetadata({
  title: "Comparer",
  description:
    "Pose deux gestes du quotidien sur la balance et regarde lequel pèse le moins.",
  path: "/comparer",
});

export default function ComparerPage() {
  // La comparaison est lue dans l'URL côté client (export statique).
  return (
    // Repli à la hauteur de l'écran : le pied de page ne saute pas quand le parcours s'affiche.
    <Suspense fallback={<main className="min-h-screen" aria-busy="true" />}>
      <CompareFlow />
    </Suspense>
  );
}
