import { normalizePersistedMeaningItems } from "./meanings";
import type { HandId, Locale, PersistedState, SavedReading } from "./types";

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

function sanitizeSymbolList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is number => typeof item === "number" && !Number.isNaN(item))
    .map((item) => sanitizeSymbolId(item, 0))
    .slice(0, 5);
}

function sanitizeOptionalText(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();

  return normalized || undefined;
}

function sanitizeJournalEntry(value: unknown): SavedReading | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const entry = value as Partial<SavedReading> & { note?: unknown };

  if (typeof entry.id !== "string" || typeof entry.createdAt !== "string") {
    return null;
  }

  return {
    id: entry.id,
    createdAt: entry.createdAt,
    locale: isLocale(entry.locale ?? "") ? (entry.locale as Locale) : "en",
    questionSymbols: sanitizeSymbolList(entry.questionSymbols).slice(0, 3),
    answerSymbols: sanitizeSymbolList(entry.answerSymbols),
    questionText: sanitizeOptionalText(entry.questionText),
    answerText: sanitizeOptionalText(entry.answerText ?? entry.note),
  };
}

export function resolveBrowserLocale(input?: string): Locale {
  return input?.toLowerCase().startsWith("ru") ? "ru" : "en";
}

export function createDefaultState(locale: Locale): PersistedState {
  return {
    locale,
    theme: "dawn",
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

    const nextCustomMeanings = {
      ru: Object.fromEntries(
        Object.entries(parsed.customMeanings?.ru ?? {}).map(([symbolId, items]) => [
          symbolId,
          normalizePersistedMeaningItems(items),
        ]),
      ),
      en: Object.fromEntries(
        Object.entries(parsed.customMeanings?.en ?? {}).map(([symbolId, items]) => [
          symbolId,
          normalizePersistedMeaningItems(items),
        ]),
      ),
    };

    return {
      locale: isLocale(parsed.locale ?? "") ? parsed.locale! : fallback.locale,
      theme: parsed.theme === "night" ? "night" : fallback.theme,
      hands: nextHands,
      customMeanings: nextCustomMeanings,
      journal: Array.isArray(parsed.journal)
        ? parsed.journal
            .map((entry) => sanitizeJournalEntry(entry))
            .filter((entry): entry is SavedReading => entry != null)
            .slice(0, 16)
        : [],
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
