"use client";

import { useCallback, useSyncExternalStore } from "react";
import { readLang, writeLang } from "./store";
import { LANGUAGES, type Lang } from "./types";

/**
 * The language this phone reads in. Chosen once, remembered, used everywhere.
 *
 * localStorage is an external store, so it is read through useSyncExternalStore
 * rather than an effect that sets state on mount: the server renders "en", the
 * client swaps to the stored value without a cascading render, and every component
 * using this hook updates together when it changes.
 */
const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  window.addEventListener("storage", fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", fn);
  };
}

function snapshot(): Lang {
  const saved = readLang();
  return saved && (LANGUAGES as readonly string[]).includes(saved) ? (saved as Lang) : "en";
}

/** The server has no localStorage, so it renders the default. */
const serverSnapshot = (): Lang => "en";

export function useLang(): [Lang, (l: Lang) => void] {
  const lang = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const change = useCallback((l: Lang) => {
    writeLang(l);
    listeners.forEach((fn) => fn());
  }, []);
  return [lang, change];
}
