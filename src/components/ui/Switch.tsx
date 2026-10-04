import type { ReactNode } from "react";

/** Interrupteur (case à cocher accessible, rôle switch) de la maquette 03b. */
export function Switch({
  checked,
  onChange,
  children,
  className = "",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`text-corps-s text-encre flex cursor-pointer items-center gap-2.5 leading-[1.4] ${className}`}
    >
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="bg-texte-attenue/40 peer-checked:bg-encre peer-focus-visible:outline-outremer after:bg-creme relative h-6 w-10 shrink-0 rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 after:absolute after:top-[3px] after:left-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:transition-transform peer-checked:after:translate-x-4"
      />
      {children}
    </label>
  );
}
