import { useEffect, useRef, useState } from "react";
import { ControlPanel } from "../components/ControlPanel";
import { Dial } from "../components/Dial";
import { MenuDropdown } from "../components/MenuDropdown";
import { QuestionSymbolPicker } from "../components/QuestionSymbolPicker";
import { ReferencePanel } from "../components/ReferencePanel";
import { SaveReadingDialog } from "../components/SaveReadingDialog";
import { SettingsDrawer } from "../components/SettingsDrawer";
import { SymbolInspector } from "../components/SymbolInspector";
import { uiText } from "../domain/uiText";
import type { HandId, MenuSection } from "../domain/types";
import { useAlethiometerApp } from "./useAlethiometerApp";

export function App() {
  const app = useAlethiometerApp();
  const copy = uiText[app.locale];
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [drawerSection, setDrawerSection] = useState<MenuSection | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveQuestionText, setSaveQuestionText] = useState("");
  const [saveAnswerText, setSaveAnswerText] = useState("");
  const [pickerHand, setPickerHand] = useState<HandId | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuExpanded) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuExpanded(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [menuExpanded]);

  function openDrawer(section: MenuSection) {
    if (section !== "symbols") {
      app.closeLexicon();
    }

    setDrawerSection(section);
    setMenuExpanded(false);
  }

  function closeDrawer() {
    app.closeLexicon();
    setDrawerSection(null);
  }

  function openSymbolEditor() {
    setDrawerSection("symbols");
    setMenuExpanded(false);
    app.openLexicon();
  }

  function beginSaveReading() {
    setSaveQuestionText("");
    setSaveAnswerText("");
    setSaveDialogOpen(true);
  }

  function confirmSaveReading() {
    app.saveCurrentReading({
      questionText: saveQuestionText,
      answerText: saveAnswerText,
    });
    setSaveDialogOpen(false);
    setSaveQuestionText("");
    setSaveAnswerText("");
  }

  function inspectSymbolFromDrawer(symbolId: number) {
    app.inspectSymbol(symbolId);
  }

  function openQuestionPicker(handId: HandId) {
    app.focusHand(handId);
    setPickerHand(handId);
  }

  function closeQuestionPicker() {
    setPickerHand(null);
  }

  function applyQuestionSymbol(symbolId: number) {
    if (!pickerHand) {
      return;
    }

    app.setHandSymbol(pickerHand, symbolId);
    setPickerHand(null);
  }

  function openReadingFromDrawer(entry: (typeof app.journal)[number]) {
    app.openReading(entry);
    closeDrawer();
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1 className="topbar-title">ALETHIOMETER</h1>
        <div ref={menuRef}>
          <MenuDropdown
            copy={copy}
            onSelect={openDrawer}
            onToggle={() => setMenuExpanded((current) => !current)}
            open={menuExpanded}
          />
        </div>
      </header>

      <main className="workspace">
        <section className="instrument-column">
          <ControlPanel
            activeHand={app.activeHand}
            answerSymbols={app.answerSymbols}
            canSaveReading={app.canSaveReading}
            copy={copy}
            countdownSecondsLeft={app.countdownSecondsLeft}
            hands={app.hands}
            locale={app.locale}
            onAsk={app.askAlethiometer}
            onOpenPicker={openQuestionPicker}
            onInspectSymbol={app.inspectSymbol}
            onSaveReading={beginSaveReading}
            status={app.status}
            symbols={app.symbolCatalog}
          />

          <div className="panel instrument-panel">
            <Dial
              answerHandAngle={app.answerHandAngle}
              hands={app.hands}
              interactive={app.status === "idle"}
              onFocusHand={app.focusHand}
              onInspectSymbol={app.chooseSymbol}
              onNudgeHand={app.nudgeHand}
            />
          </div>

          <div className="mobile-reference-actions">
            <button
              className="ghost-action small-action"
              onClick={() => openDrawer("archive")}
              type="button"
            >
              {copy.archiveSection}
            </button>
            <button
              className="ghost-action small-action"
              onClick={() => openDrawer("help")}
              type="button"
            >
              {copy.helpSection}
            </button>
            <button
              className="ghost-action small-action"
              onClick={() => openDrawer("symbols")}
              type="button"
            >
              {copy.symbolsSection}
            </button>
          </div>
        </section>

        <aside className="sidebar-column">
          <SymbolInspector
            copy={copy}
            defaultMeaningItems={app.defaultMeaningItems}
            locale={app.locale}
            onOpenLexicon={openSymbolEditor}
            personalMeaningItems={app.personalMeaningItems}
            symbol={app.currentSymbol}
          />

          <ReferencePanel
            copy={copy}
            onOpenHelp={() => openDrawer("help")}
          />
        </aside>
      </main>

      <SettingsDrawer
        copy={copy}
        defaultMeaningItems={app.defaultMeaningItems}
        draftMeaningItems={app.draftMeaningItems}
        isEditingMeanings={app.isEditingMeanings}
        journal={app.journal}
        locale={app.locale}
        newMeaningDraft={app.newMeaningDraft}
        onAddMeaning={app.addDraftMeaningItem}
        onCloseLexicon={app.closeLexicon}
        onClose={closeDrawer}
        onDeleteReading={app.deleteReading}
        onDraftChange={app.updateDraftMeaningItem}
        onInspectSymbol={inspectSymbolFromDrawer}
        onNewMeaningDraftChange={app.updateNewMeaningDraft}
        onOpenLexicon={app.openLexicon}
        onOpenReading={openReadingFromDrawer}
        onRemoveMeaning={app.removeDraftMeaningItem}
        onSetLocale={app.setLocale}
        onSetTheme={app.setTheme}
        openedReadingId={app.openedReadingId}
        open={drawerSection != null}
        personalMeaningItems={app.personalMeaningItems}
        section={drawerSection ?? "settings"}
        symbol={app.currentSymbol}
        symbols={app.symbolCatalog}
        theme={app.theme}
      />

      <SaveReadingDialog
        answerText={saveAnswerText}
        copy={copy}
        onAnswerTextChange={setSaveAnswerText}
        onClose={() => setSaveDialogOpen(false)}
        onQuestionTextChange={setSaveQuestionText}
        onSave={confirmSaveReading}
        open={saveDialogOpen}
        questionText={saveQuestionText}
      />

      <QuestionSymbolPicker
        copy={copy}
        currentSymbolId={pickerHand ? app.hands[pickerHand] : null}
        handId={pickerHand}
        locale={app.locale}
        onClose={closeQuestionPicker}
        onSelect={applyQuestionSymbol}
        open={pickerHand != null}
        symbols={app.symbolCatalog}
      />
    </div>
  );
}
