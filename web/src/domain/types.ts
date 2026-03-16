export type Locale = "ru" | "en";
export type ThemeMode = "dawn" | "night";
export type HandId = "query-1" | "query-2" | "query-3";
export type MenuSection =
  | "settings"
  | "symbols"
  | "lexicon"
  | "archive"
  | "help";

export const HAND_ORDER: HandId[] = ["query-1", "query-2", "query-3"];

export interface LocalizedText<T = string> {
  ru: T;
  en: T;
}

export interface SymbolEntry {
  id: number;
  slug: string;
  imageSrc: string;
  title: LocalizedText;
  meanings: LocalizedText<string[]>;
}

export interface SavedReading {
  id: string;
  createdAt: string;
  locale: Locale;
  questionSymbols: number[];
  answerSymbols: number[];
  questionText?: string;
  answerText?: string;
}

export interface PersistedState {
  locale: Locale;
  theme: ThemeMode;
  meditativeMode: boolean;
  hands: Record<HandId, number>;
  customMeanings: Record<Locale, Record<string, string[]>>;
  journal: SavedReading[];
}
