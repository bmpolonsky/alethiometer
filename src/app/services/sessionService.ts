import type { HandId } from "../../domain/types";
import { journalStore } from "../store/journalStore";
import { questionStore } from "../store/questionStore";
import { getReadingState, updateReadingState } from "../store/readingStore";
import { symbolStore } from "../store/symbolStore";

function wrapSymbolId(value: number) {
  return ((value % 36) + 36) % 36;
}

class SessionService {
  clearCurrentAnswer = () => {
    const { hands, activeHand } = questionStore.getState();

    updateReadingState((current) => ({
      ...current,
      answerSymbols: [],
      status: "idle",
    }));
    symbolStore.update(() => ({
      selectedSymbolId: hands[activeHand],
    }));
    journalStore.update((current) => ({
      ...current,
      openedReadingId: null,
    }));
  };

  chooseSymbol = (symbolId: number) => {
    symbolStore.update(() => ({
      selectedSymbolId: symbolId,
    }));
  };

  inspectSymbol = (symbolId: number) => {
    this.chooseSymbol(symbolId);
  };

  focusHand = (handId: HandId) => {
    questionStore.update((current) => ({
      ...current,
      activeHand: handId,
    }));
    symbolStore.update(() => ({
      selectedSymbolId: questionStore.getState().hands[handId],
    }));
  };

  setHandSymbol = (handId: HandId, symbolId: number) => {
    const reading = getReadingState();
    const nextSymbol = wrapSymbolId(symbolId);

    if (
      reading.status === "idle" &&
      (reading.answerSymbols.length > 0 || journalStore.getState().openedReadingId != null)
    ) {
      this.clearCurrentAnswer();
    }

    questionStore.update((current) => ({
      ...current,
      hands: {
        ...current.hands,
        [handId]: nextSymbol,
      },
      activeHand: handId,
    }));
    symbolStore.update(() => ({
      selectedSymbolId: nextSymbol,
    }));
  };

  nudgeHand = (handId: HandId, direction: number) => {
    const question = questionStore.getState();
    const reading = getReadingState();

    if (
      reading.status === "idle" &&
      (reading.answerSymbols.length > 0 || journalStore.getState().openedReadingId != null)
    ) {
      this.clearCurrentAnswer();
    }

    let nextSymbol = question.hands[handId];

    questionStore.update((current) => {
      nextSymbol = wrapSymbolId(current.hands[handId] + direction);

      return {
        ...current,
        hands: {
          ...current.hands,
          [handId]: nextSymbol,
        },
        activeHand: handId,
      };
    });
    symbolStore.update(() => ({
      selectedSymbolId: nextSymbol,
    }));
  };
}

export const sessionService = new SessionService();
