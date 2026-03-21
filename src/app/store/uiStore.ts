import type { HandId, MenuSection } from "../../domain/types";
import { Store } from "./createStore";

export interface UiStoreState {
  menuExpanded: boolean;
  drawerSection: MenuSection | null;
  saveDialogOpen: boolean;
  saveQuestionText: string;
  saveAnswerText: string;
  pickerHand: HandId | null;
  meditativeDrawerOpen: boolean;
}

const initialUiState: UiStoreState = {
  menuExpanded: false,
  drawerSection: null,
  saveDialogOpen: false,
  saveQuestionText: "",
  saveAnswerText: "",
  pickerHand: null,
  meditativeDrawerOpen: false,
};

export const uiStore = new Store(initialUiState);

export const uiStoreActions = {
  setMenuExpanded(nextValue: boolean) {
    uiStore.update((current) => ({
      ...current,
      menuExpanded: nextValue,
    }));
  },
  toggleMenu() {
    uiStore.update((current) => ({
      ...current,
      menuExpanded: !current.menuExpanded,
    }));
  },
  setDrawerSection(section: MenuSection | null) {
    uiStore.update((current) => ({
      ...current,
      drawerSection: section,
    }));
  },
  openSaveDialog() {
    uiStore.update((current) => ({
      ...current,
      saveDialogOpen: true,
      saveQuestionText: "",
      saveAnswerText: "",
    }));
  },
  closeSaveDialog() {
    uiStore.update((current) => ({
      ...current,
      saveDialogOpen: false,
    }));
  },
  resetSaveDialog() {
    uiStore.update((current) => ({
      ...current,
      saveDialogOpen: false,
      saveQuestionText: "",
      saveAnswerText: "",
    }));
  },
  setSaveQuestionText(value: string) {
    uiStore.update((current) => ({
      ...current,
      saveQuestionText: value,
    }));
  },
  setSaveAnswerText(value: string) {
    uiStore.update((current) => ({
      ...current,
      saveAnswerText: value,
    }));
  },
  setPickerHand(handId: HandId | null) {
    uiStore.update((current) => ({
      ...current,
      pickerHand: handId,
    }));
  },
  setMeditativeDrawerOpen(nextValue: boolean) {
    uiStore.update((current) => ({
      ...current,
      meditativeDrawerOpen: nextValue,
    }));
  },
  resetOverlayState() {
    uiStore.update((current) => ({
      ...current,
      menuExpanded: false,
      drawerSection: null,
      pickerHand: null,
      meditativeDrawerOpen: false,
    }));
  },
};
