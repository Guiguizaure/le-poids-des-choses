import gestures from "@/lib/data/gestures.generated.json";

export const IMPACT_CO2_URL = "https://impactco2.fr";

/** Date des données, en toutes lettres (« 4 octobre 2026 »), à l'heure de Paris. */
export function dataDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
}

/**
 * Crédit des données, sur chaque résultat, sur /saison et sur /methode : « Données : Impact
 * CO2 – ADEME » (lien), avec la date de téléchargement des données affichées.
 */
export function DataCredit({
  downloadedAt = gestures.downloadedAt,
  href = IMPACT_CO2_URL,
  independent = false,
  className = "",
}: {
  /** Date des données (ISO) ; par défaut, celle des gestes comparés. */
  downloadedAt?: string;
  href?: string;
  /** Ajoute « projet indépendant ». */
  independent?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`text-texte-attenue text-[11px] leading-[1.4] ${className}`}
      data-credit
    >
      Données :{" "}
      <a
        href={href}
        className="focus-visible:outline-outremer underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Impact CO2 – ADEME
      </a>
      , téléchargées le {dataDate(downloadedAt)}
      {independent ? " · projet indépendant" : ""}
    </p>
  );
}
