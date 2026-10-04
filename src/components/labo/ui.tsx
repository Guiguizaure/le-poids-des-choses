"use client";

import type { ReactNode } from "react";

export function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-blanc flex flex-col gap-4 rounded-3xl p-5">
      <h2 className="font-titre text-titre-m">{title}</h2>
      {children}
    </section>
  );
}

export function ToggleButton({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`border-encre text-corps-s rounded-full border-2 px-3 py-1 font-semibold transition-colors ${
        pressed ? "bg-encre text-creme" : "bg-blanc text-encre hover:bg-creme"
      }`}
    >
      {children}
    </button>
  );
}

export function Switch({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="text-corps-m flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="bg-texte-attenue peer-checked:bg-pomme peer-focus-visible:outline-outremer after:bg-blanc relative h-7 w-12 rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 after:absolute after:top-1 after:left-1 after:h-5 after:w-5 after:rounded-full after:transition-transform peer-checked:after:translate-x-5"
      />
      {children}
    </label>
  );
}
