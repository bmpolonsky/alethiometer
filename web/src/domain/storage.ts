import type { HandId, Locale, PersistedState } from "./types";

const STORAGE_KEY = "alethiometer-web-state-v1";

function isLocale(value: string): value is Locale {
  return value === "ru" || value === "en";
}

function isHandId(value: string): value is HandId {
  return value === "query-1" || value === "query-2" || value === "query-3";
}

function sanitizeSymbolId(value: unknown, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.max(0, Math.min(35, Math.round(value)));
}

export function resolveBrowserLocale(input?: string): Locale {
  return input?.toLowerCase().startsWith("ru") ? "ru" : "en";
}

export function createDefaultState(locale: Locale): PersistedState {
  return {
    locale,
    theme: "dawn",
    density: "normal",
    hands: {
      "query-1": 5,
      "query-2": 13,
      "query-3": 28,
    },
    customMeanings: {
      ru: {},
      en: {},
    },
    journal: [],
  };
}

export function loadState(locale: Locale): PersistedState {
  const fallback = createDefaultState(locale);

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const nextHands = { ...fallback.hands };

    Object.entries(parsed.hands ?? {}).forEach(([handId, symbolId]) => {
      if (isHandId(handId)) {
        nextHands[handId] = sanitizeSymbolId(symbolId, fallback.hands[handId]);
      }
    });

    return {
      locale: isLocale(parsed.locale ?? "") ? parsed.locale! : fallback.locale,
      theme: parsed.theme === "night" ? "night" : fallback.theme,
      density: parsed.density === "large" ? "large" : fallback.density,
      hands: nextHands,
      customMeanings: {
        ru: parsed.customMeanings?.ru ?? {},
        en: parsed.customMeanings?.en ?? {},
      },
      journal: Array.isArray(parsed.journal) ? parsed.journal.slice(0, 12) : [],
    };
  } catch {
    return fallback;
  }
}

export function saveState(state: PersistedState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
