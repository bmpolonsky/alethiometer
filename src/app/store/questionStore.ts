import type { HandId } from "../../domain/types";
import { Store } from "./createStore";
import { initialPersistedState } from "./bootstrap";

export interface QuestionStoreState {
  hands: Record<HandId, number>;
  activeHand: HandId;
}

export const questionStore = new Store<QuestionStoreState>({
  hands: initialPersistedState.hands,
  activeHand: "first",
});
