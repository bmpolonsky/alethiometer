import { useEffect, useRef, useState } from "react";
import { ControlPanel } from "../components/ControlPanel";
import { Dial } from "../components/Dial";
import { MenuDropdown } from "../components/MenuDropdown";
import { ReferencePanel } from "../components/ReferencePanel";
import { SaveReadingDialog } from "../components/SaveReadingDialog";
import { SettingsDrawer } from "../components/SettingsDrawer";
import { SymbolInspector } from "../components/SymbolInspector";
import { uiText } from "../domain/uiText";
import type { MenuSection } from "../domain/types";
import { useAlethiometerApp } from "./useAlethiometerApp";

export function App() {
  const app = useAlethiometerApp();
  const copy = uiText[app.locale];
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [drawerSection, setDrawerSection] = useState<MenuSection | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveQuestionText, setSaveQuestionText] = useState("");
  const [saveAnswerText, setSaveAnswerText] = useState("");
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

  function closeLexiconIfNeeded(nextSection: MenuSection | null) {
    if (drawerSection === "lexicon" && nextSection !== "lexicon") {
      app.closeLexicon();
    }
  }

  function openDrawer(section: MenuSection) {
    closeLexiconIfNeeded(section);

    if (section === "lexicon") {
      app.openLexicon();
    }

    setDrawerSection(section);
    setMenuExpanded(false);
  }

  function closeDrawer() {
    closeLexiconIfNeeded(null);
    setDrawerSection(null);
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
            onFocusHand={app.focusHand}
            onInspectSymbol={app.inspectSymbol}
            onSaveReading={beginSaveReading}
            status={app.status}
            symbols={app.symbolCatalog}
          />

          <div className="panel instrument-panel">
            <Dial
              activeHand={app.activeHand}
              answerHandSymbolId={app.answerHandSymbolId}
              countdownProgress={app.countdownProgress}
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
            onOpenLexicon={() => openDrawer("lexicon")}
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
        journal={app.journal}
        locale={app.locale}
        newMeaningDraft={app.newMeaningDraft}
        onAddMeaning={app.addDraftMeaningItem}
        onClose={closeDrawer}
        onDeleteReading={app.deleteReading}
        onDraftChange={app.updateDraftMeaningItem}
        onInspectSymbol={inspectSymbolFromDrawer}
        onNewMeaningDraftChange={app.updateNewMeaningDraft}
        onOpenLexicon={() => openDrawer("lexicon")}
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
    </div>
  );
}
