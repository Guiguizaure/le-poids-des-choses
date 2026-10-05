"use client";

import { useId, useState } from "react";
import { promptInstall, useInstall } from "./useInstall";

const LOOKS = {
  // Pied de page : comme ses liens.
  link: "text-encre font-semibold underline-offset-2 hover:underline focus-visible:outline-outremer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2",
  // Section sauvegarde de /jardin : comme « Exporter » et « Importer ».
  pill: "press border-encre text-legende text-encre hover:bg-blanc rounded-full border px-3 py-1.5 leading-[1.3] font-semibold transition-colors focus-visible:outline-outremer focus-visible:outline-2 focus-visible:outline-offset-2",
} as const;

/**
 * Accès permanent « Installer l'appli », même bandeau fermé : l'invite mémorisée sur Android
 * et Chrome, une aide en deux gestes sur iPhone et iPad. Rien si l'app est déjà installée ou
 * si le navigateur ne le permet pas.
 */
export function InstallButton({ look }: { look: keyof typeof LOOKS }) {
  const mode = useInstall().access;
  const [open, setOpen] = useState(false);
  const helpId = useId();
  if (mode === "hidden") return null;

  if (mode === "prompt")
    return (
      <button type="button" className={LOOKS[look]} onClick={promptInstall}>
        Installer l’appli
      </button>
    );

  return (
    <>
      <button
        type="button"
        className={LOOKS[look]}
        aria-expanded={open}
        aria-controls={helpId}
        onClick={() => setOpen((value) => !value)}
      >
        Installer l’appli
      </button>
      <div
        id={helpId}
        hidden={!open}
        className="bg-blanc text-corps-s text-encre w-full max-w-[420px] rounded-2xl p-4 leading-[1.4]"
      >
        <p className="font-semibold">Pour l’installer, deux gestes :</p>
        <ol className="list-decimal pt-1 pl-5">
          <li>
            touche le bouton Partager du navigateur (un carré d’où sort une
            flèche vers le haut) ;
          </li>
          <li>choisis « Sur l’écran d’accueil », puis « Ajouter ».</li>
        </ol>
      </div>
    </>
  );
}

/** Élément de liste du pied de page (absent si l'installation n'est pas possible). */
export function InstallFooterItem() {
  const mode = useInstall().access;
  if (mode === "hidden") return null;
  return (
    <li className="flex flex-wrap items-center gap-2">
      <InstallButton look="link" />
    </li>
  );
}
