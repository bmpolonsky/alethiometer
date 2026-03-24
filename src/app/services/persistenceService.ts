import { saveState } from "../../domain/storage";
import type { PersistedState } from "../../domain/types";
import { journalStore } from "../store/journalStore";
import { meaningsStore } from "../store/meaningsStore";
import { preferencesStore } from "../store/preferencesStore";
import { questionStore } from "../store/questionStore";
import {
  answerHandAngleStore,
  answerSymbolsStore,
  getReadingState,
  readingStatusStore,
} from "../store/readingStore";
import { symbolStore } from "../store/symbolStore";

export function buildPersistedSnapshot(): PersistedState {
  const preferences = preferencesStore.getState();
  const question = questionStore.getState();
  const reading = getReadingState();
  const symbol = symbolStore.getState();
  const meanings = meaningsStore.getState();
  const journal = journalStore.getState();

  return {
    locale: preferences.locale,
    theme: preferences.theme,
    meditativeMode: preferences.meditativeMode,
    hands: question.hands,
    customMeanings: meanings.customMeanings,
    journal: journal.journal,
    activeReading: {
      answerSymbols: reading.answerSymbols,
      answerHandAngle: reading.answerHandAngle,
      selectedSymbolId: symbol.selectedSymbolId,
      openedReadingId: journal.openedReadingId,
    },
  };
}

let persistenceInitialized = false;
let persistTimeout = 0;

function flushPersist() {
  if (persistTimeout) {
    window.clearTimeout(persistTimeout);
    persistTimeout = 0;
  }

  saveState(buildPersistedSnapshot());
}

export function initializePersistence() {
  if (persistenceInitialized) {
    return;
  }

  persistenceInitialized = true;

  const persist = () => {
    if (persistTimeout) {
      window.clearTimeout(persistTimeout);
    }

    persistTimeout = window.setTimeout(() => {
      flushPersist();
    }, 140);
  };

  preferencesStore.subscribe(persist);
  questionStore.subscribe(persist);
  answerSymbolsStore.subscribe(persist);
  answerHandAngleStore.subscribe(persist);
  readingStatusStore.subscribe(persist);
  symbolStore.subscribe(persist);
  meaningsStore.subscribe(persist);
  journalStore.subscribe(persist);
  window.addEventListener("pagehide", flushPersist);
}
