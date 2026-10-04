import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareFlow } from "@/components/compare/CompareFlow";

export const metadata: Metadata = {
  title: "Comparer — Le poids des choses",
  description:
    "Pose deux gestes du quotidien sur la balance et regarde lequel pèse le moins.",
};

export default function ComparerPage() {
  // La comparaison est lue dans l'URL côté client (export statique).
  return (
    <Suspense fallback={null}>
      <CompareFlow />
    </Suspense>
  );
}
