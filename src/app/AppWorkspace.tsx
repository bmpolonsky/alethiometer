import { ControlPanel } from "../components/ControlPanel";
import { Dial } from "../components/Dial";
import { ReferencePanel } from "../components/ReferencePanel";
import { SymbolInspector } from "../components/SymbolInspector";
import { helpText } from "../domain/helpText";
import { symbolCatalog } from "../domain/symbols";
import type { Locale } from "../domain/types";
import { uiText } from "../domain/uiText";
import { appController } from "./services/appController";
import { getPersonalMeaningItems } from "./services/meaningsService";
import { readingService } from "./services/readingService";
import { sessionService } from "./services/sessionService";
import { meaningsStore } from "./store/meaningsStore";
import { preferencesStore } from "./store/preferencesStore";
import { questionStore } from "./store/questionStore";
import {
  answerHandAngleStore,
  answerSymbolsStore,
  readingStatusStore,
} from "./store/readingStore";
import { symbolStore } from "./store/symbolStore";
import { useCompactLayout } from "./useCompactLayout";
import { useStore } from "./store/useStore";

function WorkspaceControlPanel({
  copy,
  locale,
}: {
  copy: (typeof uiText)[Locale];
  locale: Locale;
}) {
  const { activeHand, hands } = useStore(questionStore);
  const status = useStore(readingStatusStore);
  const answerSymbols = useStore(answerSymbolsStore);

  return (
    <ControlPanel
      activeHand={activeHand}
      answerSymbols={answerSymbols}
      canSaveReading={status === "idle" && answerSymbols.length > 0}
      copy={copy}
      hands={hands}
      locale={locale}
      onAsk={readingService.ask}
      onOpenPicker={appController.openQuestionPicker}
      onInspectSymbol={appController.inspectSymbolFromDial}
      onSaveReading={appController.beginSaveReading}
      status={status}
      symbols={symbolCatalog}
    />
  );
}

function WorkspaceDial({ meditativeMode }: { meditativeMode: boolean }) {
  const { hands } = useStore(questionStore);
  const answerHandAngle = useStore(answerHandAngleStore);
  const status = useStore(readingStatusStore);
  const answerSymbols = useStore(answerSymbolsStore);
  const interactive = status === "idle";
  const askEnabled = status === "idle" && answerSymbols.length === 0;

  return (
    <Dial
      answerHandAngle={answerHandAngle}
      askEnabled={askEnabled}
      hands={hands}
      interactive={interactive}
      meditativeMode={meditativeMode}
      onAsk={readingService.ask}
      onFocusHand={sessionService.focusHand}
      onInspectSymbol={appController.inspectSymbolFromDial}
      onNudgeHand={sessionService.nudgeHand}
    />
  );
}

function MeditativeAnswerStrip({ locale }: { locale: Locale }) {
  const answerSymbols = useStore(answerSymbolsStore);
  const meditativeAnswerSymbols = answerSymbols.flatMap((symbolId) => {
    const symbol = symbolCatalog[symbolId];

    return symbol ? [symbol] : [];
  });

  if (meditativeAnswerSymbols.length === 0) {
    return null;
  }

  return (
    <div className="meditative-answer-strip" aria-live="polite">
      {meditativeAnswerSymbols.map((symbol, index) => (
        <button
          className="selection-card answer-card meditative-answer-card"
          key={`${symbol.id}-${index}`}
          onClick={() => appController.inspectSymbolFromDial(symbol.id)}
          style={{ animationDelay: `${index * 120}ms` }}
          type="button"
        >
          <img alt="" className="selection-card-image" src={symbol.imageSrc} />
          <span className="selection-card-meta">
            <span className="selection-card-title">{symbol.title[locale]}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function WorkspaceSidebar({
  copy,
  help,
  isCompactLayout,
  locale,
}: {
  copy: (typeof uiText)[Locale];
  help: (typeof helpText)[Locale];
  isCompactLayout: boolean;
  locale: Locale;
}) {
  const symbolState = useStore(symbolStore);
  const meanings = useStore(meaningsStore);
  const { selectedSymbolId } = symbolState;
  const currentSymbol = symbolCatalog[selectedSymbolId] ?? symbolCatalog[0]!;
  const defaultMeaningItems = currentSymbol.meanings[locale];
  const personalMeaningItems =
    meanings.customMeanings[locale][String(selectedSymbolId)] ??
    getPersonalMeaningItems(selectedSymbolId);
  return (
    <aside className="sidebar-column">
      {isCompactLayout ? null : (
        <SymbolInspector
          copy={copy}
          defaultMeaningItems={defaultMeaningItems}
          locale={locale}
          onOpenLexicon={appController.openSymbolEditor}
          personalMeaningItems={personalMeaningItems}
          symbol={currentSymbol}
        />
      )}

      {isCompactLayout ? null : (
        <ReferencePanel copy={copy} help={help} onOpenHelp={() => appController.openDrawer("help")} />
      )}
    </aside>
  );
}

export function AppWorkspace() {
  const preferences = useStore(preferencesStore);
  const isCompactLayout = useCompactLayout();
  const {
    locale,
    meditativeMode,
  } = preferences;
  const copy = uiText[locale];
  const help = helpText[locale];
  const instrumentPanelClassName = meditativeMode
    ? "instrument-panel is-meditative"
    : "instrument-panel";

  return (
    <main className={`workspace ${meditativeMode ? "is-meditative" : ""}`}>
      <section className="instrument-column">
        {meditativeMode ? null : (
          <WorkspaceControlPanel copy={copy} locale={locale} />
        )}

        <div className={instrumentPanelClassName}>
          <WorkspaceDial meditativeMode={meditativeMode} />

          {meditativeMode ? <MeditativeAnswerStrip locale={locale} /> : null}
        </div>

      </section>

      {meditativeMode || isCompactLayout ? null : (
        <WorkspaceSidebar
          copy={copy}
          help={help}
          isCompactLayout={isCompactLayout}
          locale={locale}
        />
      )}
    </main>
  );
}
