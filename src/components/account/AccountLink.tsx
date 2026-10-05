"use client";

import Link from "next/link";
import { useAccount } from "@/lib/sync/useAccount";

/**
 * Lien discret de l'en-tête : « Se connecter » (vers /connexion), ou l'adresse du compte
 * connecté (tronquée sur mobile), vers la section compte de /jardin.
 */
export function AccountLink({ large = false }: { large?: boolean }) {
  const account = useAccount();
  const look = `${large ? "text-corps-m" : "text-corps-s"} text-encre focus-visible:outline-outremer rounded-sm leading-[1.3] font-semibold underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2`;

  if (account.ready && account.email)
    return (
      <Link
        href="/jardin#compte"
        title={account.email}
        className={`${look} block max-w-[11rem] truncate lg:max-w-[18rem]`}
      >
        {account.email}
      </Link>
    );

  return (
    // Invisible le temps de lire le compte : pas de « Se connecter » affiché à tort.
    <Link
      href="/connexion"
      prefetch={false}
      className={`${look} ${account.ready ? "" : "invisible"}`}
    >
      Se connecter
    </Link>
  );
}
