import type { Metadata } from "next";
import { CarnetScreen } from "@/components/garden/CarnetScreen";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Carnet",
  description:
    "Tous tes choix notés : les choix légers de la semaine, triés et filtrés comme tu veux.",
  path: "/jardin/carnet",
});

export default function CarnetPage() {
  return <CarnetScreen />;
}
