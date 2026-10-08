"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

/** Une lettre toutes les… (ms). */
const LETTER_MS = 28;

/**
 * Texte d'une étape qui s'écrit lettre à lettre, façon jeu vidéo. Décoratif (aria-hidden) :
 * le texte complet est annoncé par la région d'état de la conversation. La place du texte
 * entier est réservée (rien ne saute). `complete` l'affiche d'un coup ; en mouvement réduit,
 * tout est affiché d'emblée. `onComplete` quand tout est écrit.
 */
export function Typewriter({
  text,
  complete,
  onComplete,
  className = "",
}: {
  text: string;
  complete: boolean;
  onComplete: () => void;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const done = complete || reduced || shown >= text.length;

  useEffect(() => {
    if (done) {
      onComplete();
      return;
    }
    const timer = window.setTimeout(() => setShown(shown + 1), LETTER_MS);
    return () => window.clearTimeout(timer);
  }, [done, shown, onComplete]);

  const visible = done ? text.length : shown;
  return (
    <p
      aria-hidden
      data-typed
      data-typewriter={done ? "done" : "typing"}
      className={className}
    >
      {text.slice(0, visible)}
      <span className="invisible">{text.slice(visible)}</span>
    </p>
  );
}
