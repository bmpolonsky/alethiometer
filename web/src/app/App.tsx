import { useState } from "react";
import { ControlPanel } from "../components/ControlPanel";
import { Dial } from "../components/Dial";
import { LexiconDrawer } from "../components/LexiconDrawer";
import { SettingsDrawer } from "../components/SettingsDrawer";
import { SymbolInspector } from "../components/SymbolInspector";
import { uiText } from "../domain/uiText";
import { useAlethiometerApp } from "./useAlethiometerApp";

export function App() {
  const app = useAlethiometerApp();
  const copy = uiText[app.locale];
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1 className="topbar-title">ALETHIOMETER</h1>
        <button className="ghost-action topbar-action" onClick={() => setSettingsOpen(true)} type="button">
          {copy.settingsButton}
        </button>
      </header>

      <main className="workspace">
        <section className="instrument-column">
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
        </section>

        <aside className="sidebar-column">
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
            onSaveReading={app.saveCurrentReading}
            status={app.status}
            symbols={app.symbolCatalog}
          />

          <SymbolInspector
            copy={copy}
            defaultMeaning={app.defaultMeaning}
            hasCustomMeaning={app.hasCustomMeaning}
            locale={app.locale}
            onOpenLexicon={app.openLexicon}
            personalMeaning={app.personalMeaning}
            symbol={app.currentSymbol}
            symbolId={app.selectedSymbolId}
          />
        </aside>
      </main>

      <LexiconDrawer
        copy={copy}
        draftMeaning={app.draftMeaning}
        locale={app.locale}
        onClose={app.closeLexicon}
        onDraftChange={app.updateDraftMeaning}
        onResetMeaning={app.resetMeaning}
        onSaveMeaning={app.saveMeaning}
        open={app.isLexiconOpen}
        symbol={app.currentSymbol}
      />

      <SettingsDrawer
        copy={copy}
        density={app.density}
        journal={app.journal}
        locale={app.locale}
        onClose={() => setSettingsOpen(false)}
        onOpenReading={app.openReading}
        onSetDensity={app.setDensity}
        onSetLocale={app.setLocale}
        onSetTheme={app.setTheme}
        open={settingsOpen}
        theme={app.theme}
      />
    </div>
  );
}
