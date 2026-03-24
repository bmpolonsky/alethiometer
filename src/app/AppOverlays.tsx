import type { Locale } from "../domain/types";
import { QuestionSymbolPicker } from "../components/QuestionSymbolPicker";
import { SaveReadingDialog } from "../components/SaveReadingDialog";
import { SettingsDrawer } from "../components/SettingsDrawer";
import { SymbolMeaningDrawer } from "../components/SymbolMeaningDrawer";
import { helpText } from "../domain/helpText";
import { symbolCatalog } from "../domain/symbols";
import { uiText } from "../domain/uiText";
import { appController } from "./services/appController";
import { journalService } from "./services/journalService";
import { getPersonalMeaningItems, meaningsService } from "./services/meaningsService";
import { preferencesService } from "./services/preferencesService";
import { journalStore } from "./store/journalStore";
import { meaningsStore } from "./store/meaningsStore";
import { preferencesStore } from "./store/preferencesStore";
import { questionStore } from "./store/questionStore";
import { symbolStore } from "./store/symbolStore";
import { uiStore, uiStoreActions } from "./store/uiStore";
import { useStore } from "./store/useStore";

function OpenSettingsDrawer({
  drawerSection,
}: {
  drawerSection: NonNullable<ReturnType<typeof uiStore.getState>["drawerSection"]>;
}) {
  const { locale, theme } = useStore(preferencesStore);
  const { selectedSymbolId } = useStore(symbolStore);
  const {
    isEditingMeanings,
    newMeaningDraft,
    customMeanings,
  } = useStore(meaningsStore);
  const {
    journal,
    openedReadingId,
  } = useStore(journalStore);
  const currentSymbol = symbolCatalog[selectedSymbolId] ?? symbolCatalog[0]!;
  const defaultMeaningItems = currentSymbol.meanings[locale];
  const personalMeaningItems =
    customMeanings[locale][String(selectedSymbolId)] ??
    getPersonalMeaningItems(selectedSymbolId);
  const copy = uiText[locale];
  const help = helpText[locale];

  return (
    <SettingsDrawer
      allMeaningItemsBySymbol={customMeanings[locale]}
      copy={copy}
      defaultMeaningItems={defaultMeaningItems}
      help={help}
      isEditingMeanings={isEditingMeanings}
      journal={journal}
      locale={locale}
      newMeaningDraft={newMeaningDraft}
      onAddMeaning={meaningsService.addDraftMeaningItem}
      onCloseLexicon={() => meaningsService.closeEditor()}
      onClose={appController.closeDrawer}
      onDeleteReading={journalService.deleteReading}
      onMeaningChange={meaningsService.updateMeaningItem}
      onInspectSymbol={appController.inspectSymbolFromDrawer}
      onNewMeaningDraftChange={meaningsService.updateNewMeaningDraft}
      onOpenLexicon={() => meaningsService.openEditor()}
      onOpenReading={appController.openReadingFromDrawer}
      onRemoveMeaning={meaningsService.removeMeaningItem}
      onSetLocale={preferencesService.setLocale}
      onSetTheme={preferencesService.setTheme}
      openedReadingId={openedReadingId}
      open
      personalMeaningItems={personalMeaningItems}
      section={drawerSection}
      symbol={currentSymbol}
      symbols={symbolCatalog}
      theme={theme}
    />
  );
}

function SettingsDrawerContainer() {
  const { drawerSection } = useStore(uiStore);

  if (drawerSection == null) {
    return null;
  }

  return <OpenSettingsDrawer drawerSection={drawerSection} />;
}

function OpenSaveReadingDialog({
  saveAnswerText,
  saveQuestionText,
}: {
  saveAnswerText: string;
  saveQuestionText: string;
}) {
  const { locale } = useStore(preferencesStore);
  const copy = uiText[locale];

  return (
    <SaveReadingDialog
      answerText={saveAnswerText}
      copy={copy}
      onAnswerTextChange={uiStoreActions.setSaveAnswerText}
      onClose={uiStoreActions.closeSaveDialog}
      onQuestionTextChange={uiStoreActions.setSaveQuestionText}
      onSave={appController.confirmSaveReading}
      open
      questionText={saveQuestionText}
    />
  );
}

function SaveReadingDialogContainer() {
  const {
    saveDialogOpen,
    saveQuestionText,
    saveAnswerText,
  } = useStore(uiStore);

  if (!saveDialogOpen) {
    return null;
  }

  return (
    <OpenSaveReadingDialog
      saveAnswerText={saveAnswerText}
      saveQuestionText={saveQuestionText}
    />
  );
}

function OpenQuestionSymbolPicker({
  locale,
  pickerHand,
}: {
  locale: Locale;
  pickerHand: NonNullable<ReturnType<typeof uiStore.getState>["pickerHand"]>;
}) {
  const { hands } = useStore(questionStore);
  const { customMeanings } = useStore(meaningsStore);
  const copy = uiText[locale];

  return (
    <QuestionSymbolPicker
      copy={copy}
      currentSymbolId={hands[pickerHand]}
      handId={pickerHand}
      locale={locale}
      onClose={appController.closeQuestionPicker}
      onSelect={appController.applyQuestionSymbol}
      open
      personalMeaningItemsBySymbol={customMeanings[locale]}
      symbols={symbolCatalog}
    />
  );
}

function QuestionSymbolPickerContainer() {
  const { pickerHand } = useStore(uiStore);
  const { locale } = useStore(preferencesStore);

  if (pickerHand == null) {
    return null;
  }

  return <OpenQuestionSymbolPicker locale={locale} pickerHand={pickerHand} />;
}

function OpenMeditativeMeaningDrawer({ locale }: { locale: Locale }) {
  const { selectedSymbolId } = useStore(symbolStore);
  const meanings = useStore(meaningsStore);
  const symbol = symbolCatalog[selectedSymbolId] ?? symbolCatalog[0]!;
  const personalMeaningItems =
    meanings.customMeanings[locale][String(selectedSymbolId)] ??
    getPersonalMeaningItems(selectedSymbolId);
  const copy = uiText[locale];

  return (
    <SymbolMeaningDrawer
      copy={copy}
      defaultMeaningItems={symbol.meanings[locale]}
      locale={locale}
      onClose={() => uiStoreActions.setMeditativeDrawerOpen(false)}
      open
      personalMeaningItems={personalMeaningItems}
      symbol={symbol}
    />
  );
}

function MeditativeMeaningDrawerContainer() {
  const {
    locale,
    meditativeMode,
  } = useStore(preferencesStore);
  const { meditativeDrawerOpen } = useStore(uiStore);

  if (!meditativeMode || !meditativeDrawerOpen) {
    return null;
  }

  return <OpenMeditativeMeaningDrawer locale={locale} />;
}

export function AppOverlays() {
  return (
    <>
      <SettingsDrawerContainer />
      <SaveReadingDialogContainer />
      <QuestionSymbolPickerContainer />
      <MeditativeMeaningDrawerContainer />
    </>
  );
}
