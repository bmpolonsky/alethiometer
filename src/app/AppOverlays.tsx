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
import { meaningsStore } from "./store/meaningsStore";
import { preferencesStore } from "./store/preferencesStore";
import { journalStore } from "./store/journalStore";
import { questionStore } from "./store/questionStore";
import { symbolStore } from "./store/symbolStore";
import { uiStore, uiStoreActions } from "./store/uiStore";
import { useStore } from "./store/useStore";

export function AppOverlays() {
  const preferences = useStore(preferencesStore);
  const question = useStore(questionStore);
  const symbolState = useStore(symbolStore);
  const meanings = useStore(meaningsStore);
  const journalState = useStore(journalStore);
  const uiState = useStore(uiStore);
  const {
    locale,
    theme,
    meditativeMode,
  } = preferences;
  const { hands } = question;
  const { selectedSymbolId } = symbolState;
  const {
    journal,
    openedReadingId,
  } = journalState;
  const {
    isEditingMeanings,
    newMeaningDraft,
    customMeanings,
  } = meanings;
  const {
    drawerSection,
    saveDialogOpen,
    saveQuestionText,
    saveAnswerText,
    pickerHand,
    meditativeDrawerOpen,
  } = uiState;
  const currentSymbol = symbolCatalog[selectedSymbolId] ?? symbolCatalog[0]!;
  const defaultMeaningItems = currentSymbol.meanings[locale];
  const personalMeaningItems =
    customMeanings[locale][String(selectedSymbolId)] ??
    getPersonalMeaningItems(selectedSymbolId);
  const copy = uiText[locale];
  const help = helpText[locale];

  return (
    <>
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
        open={drawerSection != null}
        personalMeaningItems={personalMeaningItems}
        section={drawerSection ?? "settings"}
        symbol={currentSymbol}
        symbols={symbolCatalog}
        theme={theme}
      />

      <SaveReadingDialog
        answerText={saveAnswerText}
        copy={copy}
        onAnswerTextChange={uiStoreActions.setSaveAnswerText}
        onClose={uiStoreActions.closeSaveDialog}
        onQuestionTextChange={uiStoreActions.setSaveQuestionText}
        onSave={appController.confirmSaveReading}
        open={saveDialogOpen}
        questionText={saveQuestionText}
      />

      <QuestionSymbolPicker
        copy={copy}
        currentSymbolId={pickerHand ? hands[pickerHand] : null}
        handId={pickerHand}
        locale={locale}
        onClose={appController.closeQuestionPicker}
        onSelect={appController.applyQuestionSymbol}
        open={pickerHand != null}
        personalMeaningItemsBySymbol={customMeanings[locale]}
        symbols={symbolCatalog}
      />

      <SymbolMeaningDrawer
        copy={copy}
        defaultMeaningItems={defaultMeaningItems}
        locale={locale}
        onClose={() => uiStoreActions.setMeditativeDrawerOpen(false)}
        open={meditativeMode && meditativeDrawerOpen}
        personalMeaningItems={personalMeaningItems}
        symbol={currentSymbol}
      />
    </>
  );
}
