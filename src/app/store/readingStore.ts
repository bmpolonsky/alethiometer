import { Store } from "./createStore";
import { initialPersistedState } from "./bootstrap";

export type ReadingStatus = "idle" | "listening";

export interface ReadingStoreState {
  answerSymbols: number[];
  answerHandAngle: number;
  status: ReadingStatus;
}

export const readingStore = new Store<ReadingStoreState>({
  answerSymbols: initialPersistedState.activeReading.answerSymbols,
  answerHandAngle: initialPersistedState.activeReading.answerHandAngle,
  status: "idle",
});
