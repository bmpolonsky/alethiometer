import { HAND_ORDER } from "../../domain/types";
import type { SavedReading } from "../../domain/types";
import { journalStore } from "../store/journalStore";
import { preferencesStore } from "../store/preferencesStore";
import { questionStore } from "../store/questionStore";
import { readingStore } from "../store/readingStore";

export interface SaveReadingDraft {
  questionText?: string;
  answerText?: string;
}

function createEntryId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `reading-${Date.now()}`;
}

function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();

  return normalized || undefined;
}

class JournalService {
  saveCurrentReading = (draft: SaveReadingDraft) => {
    const question = questionStore.getState();
    const reading = readingStore.getState();
    const preferences = preferencesStore.getState();

    if (reading.status !== "idle" || reading.answerSymbols.length === 0) {
      return;
    }

    const entry: SavedReading = {
      id: createEntryId(),
      createdAt: new Date().toISOString(),
      locale: preferences.locale,
      questionSymbols: HAND_ORDER.map((handId) => question.hands[handId]),
      answerSymbols: [...reading.answerSymbols],
      questionText: normalizeOptionalText(draft.questionText),
      answerText: normalizeOptionalText(draft.answerText),
    };

    journalStore.update((current) => ({
      ...current,
      journal: [entry, ...current.journal].slice(0, 16),
      openedReadingId: entry.id,
    }));
  };

  deleteReading = (readingId: string) => {
    journalStore.update((current) => ({
      ...current,
      journal: current.journal.filter((entry) => entry.id !== readingId),
      openedReadingId:
        current.openedReadingId === readingId ? null : current.openedReadingId,
    }));
  };

  markOpened = (readingId: string | null) => {
    journalStore.update((current) => ({
      ...current,
      openedReadingId: readingId,
    }));
  };
}

export const journalService = new JournalService();
