"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "rehearse.openaiApiKey";
const CHANGE_EVENT = "rehearse:api-key-change";

export const API_KEY_HEADER = "x-openai-api-key";

export function getApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setApiKey(key: string) {
  try {
    if (key) localStorage.setItem(STORAGE_KEY, key);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable (e.g. private mode); the key just won't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function useApiKey() {
  return useSyncExternalStore(subscribe, getApiKey, () => "");
}

export function maskApiKey(key: string) {
  return key.length > 10 ? `${key.slice(0, 3)}…${key.slice(-4)}` : "••••";
}
