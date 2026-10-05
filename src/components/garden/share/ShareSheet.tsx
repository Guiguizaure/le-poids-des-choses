"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { PrimaryButton } from "@/components/ui/buttons";
import type { GardenState } from "@/lib/garden/model";
import type { SkyId } from "@/lib/garden/skies";
import { plural } from "@/lib/garden/text";
import { renderShareCard } from "./renderShareCard";

const FILE_NAME = "mon-jardin.png";
const SHARE_TEXT = "Mon jardin, dans Le poids des choses.";

type Card = { file: File; previewUrl: string };

/**
 * Feuille « Partager mon jardin » (maquette 09b) : aperçu de l'image, phrase de
 * confidentialité, « Partager l’image » (navigator.share avec le fichier, un texte court et
 * l'adresse du site), « Annuler ». Modale : le focus reste dans la feuille, Échap ferme.
 * Montée à chaque ouverture (clé), elle prépare l'image dès qu'elle apparaît.
 */
export function ShareSheet({
  garden,
  sky,
  unlockedCount,
  siteHost,
  siteUrl,
  onClose,
}: {
  garden: GardenState;
  sky: SkyId;
  unlockedCount: number;
  siteHost: string;
  siteUrl: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [card, setCard] = useState<Card | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;
    renderShareCard({ garden, sky, siteHost, unlockedCount })
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setCard({
          file: new File([blob], FILE_NAME, { type: "image/png" }),
          previewUrl: url,
        });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        // Détail complet (étape et cause) pour le débogage ; message discret à l'écran.
        console.error(
          error,
          error instanceof Error ? { cause: error.cause } : undefined,
        );
        setMessage(
          "L’image n’a pas pu être préparée. Réessaie dans un instant.",
        );
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [garden, sky, siteHost, unlockedCount]);

  const close = () => {
    dialogRef.current?.close();
    onClose();
  };

  const share = async () => {
    if (!card) return;
    setMessage("");
    try {
      await navigator.share({
        files: [card.file],
        text: SHARE_TEXT,
        url: siteUrl,
      });
      close();
    } catch (error) {
      // Partage annulé par l'utilisateur : rien ne se passe.
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Partage du jardin en échec.", error);
      setMessage("Le partage n’a pas abouti. Tu peux réessayer.");
    }
  };

  /** Le focus tourne dans la feuille (Tab, Maj+Tab). */
  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>("button, [href]") ?? [],
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const description = `ton jardin, ${plural(garden.lightChoiceCount, "choix léger", "choix légers")}, ${plural(unlockedCount, "animal", "animaux")}`;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="partage-titre"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onKeyDown={trapFocus}
      className="backdrop:bg-encre/50 fixed inset-x-0 top-auto bottom-0 m-0 mx-auto max-h-[100dvh] w-full max-w-[430px] overflow-y-auto bg-transparent p-0"
    >
      <div className="bg-creme border-encre flex flex-col items-center gap-4 rounded-t-[28px] border-x-2 border-t-2 px-6 pt-3 pb-7">
        <span
          aria-hidden
          className="bg-texte-attenue h-[5px] w-10 rounded-[3px] opacity-50"
        />
        <h2
          id="partage-titre"
          className="font-titre text-encre text-[24px] leading-[1.2]"
        >
          Partager mon jardin
        </h2>
        <div className="border-encre bg-creme aspect-[1080/1350] w-[270px] max-w-full border-2 shadow-[4px_4px_0_0_var(--color-encre)]">
          {card ? (
            // eslint-disable-next-line @next/next/no-img-element -- image locale (blob)
            <img
              src={card.previewUrl}
              alt={`Aperçu de l’image à partager : ${description}.`}
              className="block h-full w-full"
              data-share-preview
            />
          ) : (
            <p className="text-legende text-texte-attenue flex h-full items-center justify-center p-4 text-center">
              Préparation de l’image…
            </p>
          )}
        </div>
        <p className="text-texte-attenue w-[320px] max-w-full text-center text-[13px] leading-[1.35]">
          L’image montre ton jardin et le nombre de tes choix légers. Ni ton
          carnet, ni de kilos de CO2e.
        </p>
        <PrimaryButton
          onClick={share}
          aria-disabled={!card}
          className="aria-disabled:cursor-wait aria-disabled:opacity-60"
        >
          Partager l’image
        </PrimaryButton>
        <button
          type="button"
          onClick={close}
          className="text-encre focus-visible:outline-outremer text-[15px] leading-[1.3] font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Annuler
        </button>
        <p
          role="status"
          aria-live="polite"
          className="text-legende text-encre min-h-[1em]"
        >
          {message}
        </p>
      </div>
    </dialog>
  );
}
