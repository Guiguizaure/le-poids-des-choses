"use client";

import { useSyncExternalStore } from "react";
import { ANIMAL_SCRIPTS, type TalkerId } from "@/content/animaux";
import {
  converse,
  emptyFriends,
  FRIENDS_KEY,
  parseFriends,
  serializeFriends,
  type FriendsState,
  type Reply,
  type TalkContext,
} from "./friendship";

const listeners = new Set<() => void>();
/** Repli quand le stockage est indisponible (navigation privée) : l'amitié vit en mémoire. */
let memory: string | null = null;
let cached: { raw: string | null; value: FriendsState } = {
  raw: null,
  value: emptyFriends(),
};
const SERVER = emptyFriends();

function read(): FriendsState {
  let raw = memory;
  try {
    raw = window.localStorage.getItem(FRIENDS_KEY) ?? memory;
  } catch {
    // Stockage indisponible : on garde la mémoire.
  }
  if (raw !== cached.raw) cached = { raw, value: parseFriends(raw) };
  return cached.value;
}

function write(state: FriendsState) {
  memory = serializeFriends(state);
  try {
    window.localStorage.setItem(FRIENDS_KEY, memory);
  } catch {
    // Stockage indisponible : l'amitié dure le temps de la visite.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Une conversation : la réplique, et l'amitié enregistrée (sauf en dormant). */
export function talkTo(talker: TalkerId, context: TalkContext): Reply {
  const state = read();
  const { reply, record } = converse(
    talker,
    ANIMAL_SCRIPTS[talker],
    state[talker],
    context,
  );
  write({ ...state, [talker]: record });
  return reply;
}

/** L'animal a été vu dans le jardin : il apparaît dans « Les habitants du jardin ». */
export function markMet(talker: TalkerId) {
  const state = read();
  if (state[talker].met) return;
  write({ ...state, [talker]: { ...state[talker], met: true } });
}

/** Amitiés de l'appareil (aucune au rendu serveur). */
export function useFriends(): FriendsState {
  return useSyncExternalStore(subscribe, read, () => SERVER);
}
