import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const PRIMARY =
  "bg-encre text-creme text-corps-m flex w-full items-center justify-center rounded-full px-6 py-4 text-center leading-[1.3] font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-outremer focus-visible:outline-2 focus-visible:outline-offset-2";
const TEXT_LINK =
  "text-corps-s text-encre text-center leading-[1.3] font-semibold underline focus-visible:outline-outremer focus-visible:outline-2 focus-visible:outline-offset-2";

/** Bouton principal : une seule action principale par écran. */
export function PrimaryButton({
  className = "",
  ...props
}: ComponentProps<"button">) {
  return (
    <button type="button" className={`${PRIMARY} ${className}`} {...props} />
  );
}

export function PrimaryLink({
  className = "",
  ...props
}: ComponentProps<typeof Link>) {
  return <Link className={`${PRIMARY} ${className}`} {...props} />;
}

export function TextButton({
  className = "",
  ...props
}: ComponentProps<"button">) {
  return (
    <button type="button" className={`${TEXT_LINK} ${className}`} {...props} />
  );
}

export function TextLink({
  className = "",
  ...props
}: ComponentProps<typeof Link>) {
  return <Link className={`${TEXT_LINK} ${className}`} {...props} />;
}

/** Icône de la maquette (retour, fermer), décorative : le lien porte l'étiquette. */
export function Icon({ name }: { name: "retour" | "fermer" }) {
  return (
    <Image
      src={`/icons/${name}.svg`}
      alt=""
      width={24}
      height={24}
      className="block"
      unoptimized
    />
  );
}

export function IconLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: "retour" | "fermer";
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="focus-visible:outline-outremer -m-2 rounded-full p-2 focus-visible:outline-2"
    >
      <Icon name={icon} />
    </Link>
  );
}

export function Logo({
  children = "Le poids des choses",
}: {
  children?: ReactNode;
}) {
  return (
    <Link href="/" className="font-titre text-encre text-[17px] leading-[1.2]">
      {children}
    </Link>
  );
}
