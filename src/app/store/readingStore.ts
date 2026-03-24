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
