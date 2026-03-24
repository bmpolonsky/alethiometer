import { sanitizeMeaningItems } from "./meanings";
import type {
  ActiveReadingSnapshot,
  HandId,
  Locale,
  PersistedState,
  SavedReading,
  ThemeMode,
} from "./types";

const STORAGE_KEY = "alethiometer-web-state-v1";

interface ExportedBackup {
  format?: string;
  version?: number;
  exportedAt?: string;
  state?: unknown;
}

function isLocale(value: string): value is Locale {
  return value === "ru" || value === "en";
}

function isHandId(value: string): value is HandId {
  return value === "first" || value === "second" || value === "third";
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

function sanitizeTheme(value: unknown, fallback: ThemeMode): ThemeMode {
  return value === "dark" || value === "night"
    ? "dark"
    : value === "light" || value === "dawn"
      ? "light"
      : fallback;
}

function sanitizeActiveReading(value: unknown, fallbackHands: Record<HandId, number>): ActiveReadingSnapshot {
  if (!value || typeof value !== "object") {
    return {
      answerSymbols: [],
      answerHandAngle: fallbackHands.third * 10,
      selectedSymbolId: fallbackHands.first,
      openedReadingId: null,
    };
  }

  const reading = value as Partial<ActiveReadingSnapshot>;

  return {
    answerSymbols: sanitizeSymbolList(reading.answerSymbols),
    answerHandAngle:
      typeof reading.answerHandAngle === "number" && !Number.isNaN(reading.answerHandAngle)
        ? reading.answerHandAngle
        : fallbackHands.third * 10,
    selectedSymbolId: sanitizeSymbolId(reading.selectedSymbolId, fallbackHands.first),
    openedReadingId:
      typeof reading.openedReadingId === "string" ? reading.openedReadingId : null,
  };
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

export function resolvePreferredTheme(): ThemeMode {
  if (
    typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export function createDefaultState(locale: Locale): PersistedState {
  return {
    locale,
    theme: resolvePreferredTheme(),
    meditativeMode: false,
    hands: {
      first: 5,
      second: 13,
      third: 28,
    },
    customMeanings: {
      ru: {},
      en: {},
    },
    journal: [],
    activeReading: {
      answerSymbols: [],
      answerHandAngle: 28 * 10,
      selectedSymbolId: 5,
      openedReadingId: null,
    },
  };
}

export function sanitizePersistedState(value: unknown, locale: Locale): PersistedState {
  const fallback = createDefaultState(locale);

  if (!value || typeof value !== "object") {
    return fallback;
  }

  const parsed = value as Partial<PersistedState>;
  const nextHands = { ...fallback.hands };

  Object.entries(parsed.hands ?? {}).forEach(([handId, symbolId]) => {
    if (isHandId(handId)) {
      nextHands[handId] = sanitizeSymbolId(
        symbolId,
        fallback.hands[handId],
      );
    }
  });

  const nextCustomMeanings = {
    ru: Object.fromEntries(
      Object.entries(parsed.customMeanings?.ru ?? {}).map(([symbolId, items]) => [
        symbolId,
        sanitizeMeaningItems(items),
      ]),
    ),
    en: Object.fromEntries(
      Object.entries(parsed.customMeanings?.en ?? {}).map(([symbolId, items]) => [
        symbolId,
        sanitizeMeaningItems(items),
      ]),
    ),
  };

  return {
    locale: isLocale(parsed.locale ?? "") ? parsed.locale! : fallback.locale,
    theme: sanitizeTheme(parsed.theme, fallback.theme),
    meditativeMode:
      typeof parsed.meditativeMode === "boolean"
        ? parsed.meditativeMode
        : fallback.meditativeMode,
    hands: nextHands,
    customMeanings: nextCustomMeanings,
    journal: Array.isArray(parsed.journal)
      ? parsed.journal
          .map((entry) => sanitizeJournalEntry(entry))
          .filter((entry): entry is SavedReading => entry != null)
          .slice(0, 16)
      : [],
    activeReading: sanitizeActiveReading(parsed.activeReading, nextHands),
  };
}

export function sanitizeImportedState(value: unknown, locale: Locale): PersistedState {
  const maybeBackup = value as ExportedBackup | null;

  if (
    maybeBackup
    && typeof maybeBackup === "object"
    && maybeBackup.format === "alethiometer-backup"
    && "state" in maybeBackup
  ) {
    return sanitizePersistedState(maybeBackup.state, locale);
  }

  return sanitizePersistedState(value, locale);
}

export function loadState(locale: Locale): PersistedState {
  if (typeof window === "undefined") {
    return createDefaultState(locale);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createDefaultState(locale);
    }

    return sanitizePersistedState(JSON.parse(raw), locale);
  } catch {
    return createDefaultState(locale);
  }
}

export function saveState(state: PersistedState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
