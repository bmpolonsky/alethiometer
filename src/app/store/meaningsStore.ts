import type { Locale } from "../../domain/types";
import { Store } from "./createStore";
import { initialPersistedState } from "./bootstrap";

export interface MeaningsStoreState {
  customMeanings: Record<Locale, Record<string, string[]>>;
  newMeaningDraft: string;
  isEditingMeanings: boolean;
}

export const meaningsStore = new Store<MeaningsStoreState>({
  customMeanings: initialPersistedState.customMeanings,
  newMeaningDraft: "",
  isEditingMeanings: false,
});
