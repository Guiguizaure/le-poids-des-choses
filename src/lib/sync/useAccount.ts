"use client";

import { useSyncExternalStore } from "react";
import { getSyncEngine } from "./browser";
import type { SyncSnapshot } from "./engine";
import { SIGNED_OUT } from "./state";

const SERVER_SNAPSHOT: SyncSnapshot & { ready: boolean } = {
  ...SIGNED_OUT,
  syncing: false,
  lastOutcome: null,
  received: 0,
  ready: false,
};

let cached: {
  from: SyncSnapshot;
  value: SyncSnapshot & { ready: boolean };
} | null = null;

function getSnapshot() {
  const snapshot = getSyncEngine().getSnapshot();
  if (cached?.from !== snapshot)
    cached = { from: snapshot, value: { ...snapshot, ready: true } };
  return cached.value;
}

const subscribe = (listener: () => void) => getSyncEngine().subscribe(listener);

/** État du compte sur cet appareil (ready : faux au rendu serveur et à l'hydratation). */
export function useAccount(): SyncSnapshot & { ready: boolean } {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}
