import type { Locale } from "../domain/types";
import { QuestionSymbolPicker } from "../components/QuestionSymbolPicker";
import { SaveReadingDialog } from "../components/SaveReadingDialog";
import { SettingsDrawer } from "../components/SettingsDrawer";
import { SymbolMeaningDrawer } from "../components/SymbolMeaningDrawer";
import { helpText } from "../domain/helpText";
import { symbolCatalog } from "../domain/symbols";
import { uiText } from "../domain/uiText";
import { getPersonalMeaningItems } from "./services/meaningsService";
import { journalStore } from "./store/journalStore";
import { meaningsStore } from "./store/meaningsStore";
import { preferencesStore } from "./store/preferencesStore";
import { questionStore } from "./store/questionStore";
import { symbolStore } from "./store/symbolStore";
import { uiStore } from "./store/uiStore";
import { useCompactLayout } from "./useCompactLayout";
import { useStore } from "./store/useStore";

function SettingsDrawerContainer() {
  const { drawerSection } = useStore(uiStore);
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

  if (drawerSection == null) {
    return null;
  }

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
      openedReadingId={openedReadingId}
      personalMeaningItems={personalMeaningItems}
      section={drawerSection}
      symbol={currentSymbol}
      symbols={symbolCatalog}
      theme={theme}
    />
  );
}

function SaveReadingDialogContainer() {
  const {
    saveDialogOpen,
    saveQuestionText,
    saveAnswerText,
  } = useStore(uiStore);
  const { locale } = useStore(preferencesStore);
  const copy = uiText[locale];

  if (!saveDialogOpen) {
    return null;
  }

  return (
    <SaveReadingDialog
      answerText={saveAnswerText}
      copy={copy}
      questionText={saveQuestionText}
    />
  );
}

function QuestionSymbolPickerContainer() {
  const { pickerHand } = useStore(uiStore);
  const { locale } = useStore(preferencesStore);
  const { hands } = useStore(questionStore);
  const { customMeanings } = useStore(meaningsStore);
  const copy = uiText[locale];

  if (pickerHand == null) {
    return null;
  }

  return (
    <QuestionSymbolPicker
      copy={copy}
      currentSymbolId={hands[pickerHand]}
      handId={pickerHand}
      locale={locale}
      personalMeaningItemsBySymbol={customMeanings[locale]}
      symbols={symbolCatalog}
    />
  );
}

function SymbolMeaningDrawerContainer() {
  const {
    locale,
    meditativeMode,
  } = useStore(preferencesStore);
  const { symbolMeaningDrawerOpen } = useStore(uiStore);
  const isCompactLayout = useCompactLayout();
  const { selectedSymbolId } = useStore(symbolStore);
  const meanings = useStore(meaningsStore);
  const symbol = symbolCatalog[selectedSymbolId] ?? symbolCatalog[0]!;
  const personalMeaningItems =
    meanings.customMeanings[locale][String(selectedSymbolId)] ??
    getPersonalMeaningItems(selectedSymbolId);
  const copy = uiText[locale];

  if (!symbolMeaningDrawerOpen || (!meditativeMode && !isCompactLayout)) {
    return null;
  }

  return (
    <SymbolMeaningDrawer
      copy={copy}
      defaultMeaningItems={symbol.meanings[locale]}
      locale={locale}
      personalMeaningItems={personalMeaningItems}
      symbol={symbol}
    />
  );
}

export function AppOverlays() {
  return (
    <>
      <SettingsDrawerContainer />
      <SaveReadingDialogContainer />
      <QuestionSymbolPickerContainer />
      <SymbolMeaningDrawerContainer />
    </>
  );
}
