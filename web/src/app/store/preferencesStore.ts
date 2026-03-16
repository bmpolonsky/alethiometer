import type { Locale, ThemeMode } from "../../domain/types";
import { Store } from "./createStore";
import { initialPersistedState } from "./bootstrap";

export interface PreferencesStoreState {
  locale: Locale;
  theme: ThemeMode;
  meditativeMode: boolean;
}

export const preferencesStore = new Store<PreferencesStoreState>({
  locale: initialPersistedState.locale,
  theme: initialPersistedState.theme,
  meditativeMode: initialPersistedState.meditativeMode,
});
