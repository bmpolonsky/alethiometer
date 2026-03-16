import {
  createDefaultState,
  loadState,
  resolveBrowserLocale,
} from "../../domain/storage";
import type { PersistedState } from "../../domain/types";

const fallbackLocale = resolveBrowserLocale(
  typeof navigator === "undefined" ? undefined : navigator.language,
);

export const initialPersistedState: PersistedState =
  typeof window === "undefined"
    ? createDefaultState(fallbackLocale)
    : loadState(fallbackLocale);
