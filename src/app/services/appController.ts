import type { HandId, MenuSection, SavedReading } from "../../domain/types";
import { uiStore, uiStoreActions } from "../store/uiStore";
import { journalService } from "./journalService";
import { meaningsService } from "./meaningsService";
import { preferencesService } from "./preferencesService";
import { readingService } from "./readingService";
import { sessionService } from "./sessionService";
import { preferencesStore } from "../store/preferencesStore";
import { meaningsStore } from "../store/meaningsStore";
import { isCompactLayoutViewport } from "../useCompactLayout";

export const appController = {
  openDrawer(section: MenuSection) {
    if (section !== "symbols") {
      meaningsService.closeEditor();
    }

    uiStore.update((current) => ({
      ...current,
      drawerSection: section,
      menuExpanded: false,
      meditativeDrawerOpen: false,
    }));
  },
  closeDrawer() {
    meaningsService.closeEditor();
    uiStoreActions.setDrawerSection(null);
  },
  openSymbolEditor() {
    uiStore.update((current) => ({
      ...current,
      drawerSection: "symbols",
      menuExpanded: false,
      meditativeDrawerOpen: false,
    }));
    meaningsService.openEditor();
  },
  toggleMeditativeMode() {
    const nextValue = !preferencesStore.getState().meditativeMode;

    preferencesService.setMeditativeMode(nextValue);
    uiStore.update((current) => ({
      ...current,
      menuExpanded: false,
      drawerSection: null,
      pickerHand: null,
      meditativeDrawerOpen: false,
    }));
  },
  beginSaveReading() {
    uiStoreActions.openSaveDialog();
  },
  confirmSaveReading() {
    const { saveQuestionText, saveAnswerText } = uiStore.getState();

    journalService.saveCurrentReading({
      questionText: saveQuestionText,
      answerText: saveAnswerText,
    });
    uiStoreActions.resetSaveDialog();
  },
  inspectSymbolFromDrawer(symbolId: number) {
    const wasEditing = meaningsStore.getState().isEditingMeanings;

    sessionService.inspectSymbol(symbolId);

    if (wasEditing) {
      meaningsService.openEditor(symbolId);
    }
  },
  inspectSymbolFromDial(symbolId: number) {
    sessionService.chooseSymbol(symbolId);

    if (preferencesStore.getState().meditativeMode || isCompactLayoutViewport()) {
      uiStoreActions.setMeditativeDrawerOpen(true);
    }
  },
  openQuestionPicker(handId: HandId) {
    sessionService.focusHand(handId);
    uiStoreActions.setPickerHand(handId);
  },
  closeQuestionPicker() {
    uiStoreActions.setPickerHand(null);
  },
  applyQuestionSymbol(symbolId: number) {
    const { pickerHand } = uiStore.getState();

    if (!pickerHand) {
      return;
    }

    sessionService.setHandSymbol(pickerHand, symbolId);
    uiStoreActions.setPickerHand(null);
  },
  openReadingFromDrawer(entry: SavedReading) {
    readingService.openReading(entry);
    appController.closeDrawer();
  },
};
