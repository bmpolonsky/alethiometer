import type { Locale, ThemeMode } from "../../domain/types";
import { preferencesStore } from "../store/preferencesStore";

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
}

class PreferencesService {
  constructor() {
    applyTheme(preferencesStore.getState().theme);
  }

  setLocale = (nextLocale: Locale) => {
    preferencesStore.update((current) => ({
      ...current,
      locale: nextLocale,
    }));
  };

  setTheme = (nextTheme: ThemeMode) => {
    preferencesStore.update((current) => ({
      ...current,
      theme: nextTheme,
    }));
    applyTheme(nextTheme);
  };

  setMeditativeMode = (nextValue: boolean) => {
    preferencesStore.update((current) => ({
      ...current,
      meditativeMode: nextValue,
    }));
  };
}

export const preferencesService = new PreferencesService();
