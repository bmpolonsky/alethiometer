import { Store } from "./createStore";
import { initialPersistedState } from "./bootstrap";

export interface SymbolStoreState {
  selectedSymbolId: number;
}

export const symbolStore = new Store<SymbolStoreState>({
  selectedSymbolId: initialPersistedState.activeReading.selectedSymbolId,
});
