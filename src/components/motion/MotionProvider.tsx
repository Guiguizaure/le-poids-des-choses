"use client";

import { createContext, useContext, type ReactNode } from "react";

type MotionSettings = {
  /** Force les animations réduites, même si le système ne le demande pas (page /labo). */
  forceReduced: boolean;
};

const MotionContext = createContext<MotionSettings>({ forceReduced: false });

export function MotionProvider({
  forceReduced = false,
  children,
}: {
  forceReduced?: boolean;
  children: ReactNode;
}) {
  return (
    <MotionContext.Provider value={{ forceReduced }}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotionSettings(): MotionSettings {
  return useContext(MotionContext);
}
