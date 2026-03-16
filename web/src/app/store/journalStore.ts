import type { SavedReading } from "../../domain/types";
import { Store } from "./createStore";
import { initialPersistedState } from "./bootstrap";

export interface JournalStoreState {
  journal: SavedReading[];
  openedReadingId: string | null;
}

export const journalStore = new Store<JournalStoreState>({
  journal: initialPersistedState.journal,
  openedReadingId: initialPersistedState.activeReading.openedReadingId,
});
