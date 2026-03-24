import { Store } from "./createStore";
import { initialPersistedState } from "./bootstrap";

export type ReadingStatus = "idle" | "listening";

export interface ReadingStoreState {
  answerSymbols: number[];
  answerHandAngle: number;
  status: ReadingStatus;
}

const initialReadingState: ReadingStoreState = {
  answerSymbols: initialPersistedState.activeReading.answerSymbols,
  answerHandAngle: initialPersistedState.activeReading.answerHandAngle,
  status: "idle",
};

export const answerSymbolsStore = new Store<ReadingStoreState["answerSymbols"]>(
  initialReadingState.answerSymbols,
);

export const answerHandAngleStore = new Store<ReadingStoreState["answerHandAngle"]>(
  initialReadingState.answerHandAngle,
);

export const readingStatusStore = new Store<ReadingStoreState["status"]>(
  initialReadingState.status,
);

export function getReadingState(): ReadingStoreState {
  return {
    answerSymbols: answerSymbolsStore.getState(),
    answerHandAngle: answerHandAngleStore.getState(),
    status: readingStatusStore.getState(),
  };
}

export function updateReadingState(
  updater: (state: ReadingStoreState) => ReadingStoreState,
) {
  const currentState = getReadingState();
  const nextState = updater(currentState);

  if (!Object.is(nextState.answerSymbols, currentState.answerSymbols)) {
    answerSymbolsStore.update(() => nextState.answerSymbols);
  }

  if (!Object.is(nextState.answerHandAngle, currentState.answerHandAngle)) {
    answerHandAngleStore.update(() => nextState.answerHandAngle);
  }

  if (!Object.is(nextState.status, currentState.status)) {
    readingStatusStore.update(() => nextState.status);
  }
}
