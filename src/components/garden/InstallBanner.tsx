"use client";

import { PrimaryButton } from "@/components/ui/buttons";
import {
  dismissInstallBanner,
  promptInstall,
  useInstall,
} from "@/components/install/useInstall";

/** Bandeau « Garde ton jardin » (maquette 04) : installation sur Android, explication sur iPhone. */
export function InstallBanner() {
  const mode = useInstall().banner;
  if (mode === "hidden") return null;

  return (
    <section
      aria-labelledby="installer-titre"
      className="bg-soleil relative flex flex-col items-start gap-2.5 rounded-[20px] p-[18px]"
    >
      <button
        type="button"
        onClick={dismissInstallBanner}
        aria-label="Fermer ce bandeau"
        className="text-encre focus-visible:outline-outremer absolute top-3 right-3 flex size-8 items-center justify-center rounded-full text-[20px] leading-none focus-visible:outline-2"
      >
        <span aria-hidden>×</span>
      </button>
      <h2
        id="installer-titre"
        className="text-corps-m text-encre pr-8 leading-[1.3] font-semibold"
      >
        Garde ton jardin
      </h2>
      <p className="text-corps-s text-encre leading-[1.4]">
        {mode === "prompt"
          ? "Installe l’app sur ton écran d’accueil pour ne pas perdre ton carnet."
          : "Installe l’app sur ton écran d’accueil pour ne pas perdre ton carnet : touche Partager, puis « Sur l’écran d’accueil »."}
      </p>
      {mode === "prompt" ? (
        <PrimaryButton className="w-auto!" onClick={promptInstall}>
          Installer
        </PrimaryButton>
      ) : null}
    </section>
  );
}
