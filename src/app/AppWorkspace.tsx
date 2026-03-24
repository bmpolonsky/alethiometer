import { ControlPanel } from "../components/ControlPanel";
import { Dial } from "../components/Dial";
import { ReferencePanel } from "../components/ReferencePanel";
import { SymbolInspector } from "../components/SymbolInspector";
import { helpText } from "../domain/helpText";
import { symbolCatalog } from "../domain/symbols";
import { uiText } from "../domain/uiText";
import { appController } from "./services/appController";
import { getPersonalMeaningItems } from "./services/meaningsService";
import { readingService } from "./services/readingService";
import { sessionService } from "./services/sessionService";
import { meaningsStore } from "./store/meaningsStore";
import { preferencesStore } from "./store/preferencesStore";
import { questionStore } from "./store/questionStore";
import { readingStore } from "./store/readingStore";
import { symbolStore } from "./store/symbolStore";
import { useStore } from "./store/useStore";

export function AppWorkspace() {
  const preferences = useStore(preferencesStore);
  const question = useStore(questionStore);
  const reading = useStore(readingStore);
  const symbolState = useStore(symbolStore);
  const meanings = useStore(meaningsStore);
  const {
    locale,
    meditativeMode,
  } = preferences;
  const { activeHand, hands } = question;
  const { answerSymbols, status, answerHandAngle } = reading;
  const { selectedSymbolId } = symbolState;
  const currentSymbol = symbolCatalog[selectedSymbolId] ?? symbolCatalog[0]!;
  const defaultMeaningItems = currentSymbol.meanings[locale];
  const personalMeaningItems =
    meanings.customMeanings[locale][String(selectedSymbolId)] ??
    getPersonalMeaningItems(selectedSymbolId);
  const copy = uiText[locale];
  const help = helpText[locale];
  const meditativeAnswerSymbols = answerSymbols.flatMap((symbolId) => {
    const symbol = symbolCatalog[symbolId];

    return symbol ? [symbol] : [];
  });
  const canAskFromDial = status === "idle" && answerSymbols.length === 0;

  return (
    <main className={`workspace ${meditativeMode ? "is-meditative" : ""}`}>
      <section className="instrument-column">
        {meditativeMode ? null : (
          <ControlPanel
            activeHand={activeHand}
            answerSymbols={answerSymbols}
            canSaveReading={status === "idle" && answerSymbols.length > 0}
            copy={copy}
            hands={hands}
            locale={locale}
            onAsk={readingService.ask}
            onOpenPicker={appController.openQuestionPicker}
            onInspectSymbol={sessionService.inspectSymbol}
            onSaveReading={appController.beginSaveReading}
            status={status}
            symbols={symbolCatalog}
          />
        )}

        <div className={`panel instrument-panel ${meditativeMode ? "is-meditative" : ""}`}>
          <Dial
            answerHandAngle={answerHandAngle}
            askEnabled={canAskFromDial}
            hands={hands}
            interactive={status === "idle"}
            meditativeMode={meditativeMode}
            onAsk={readingService.ask}
            onFocusHand={sessionService.focusHand}
            onInspectSymbol={appController.inspectSymbolFromDial}
            onNudgeHand={sessionService.nudgeHand}
          />

          {meditativeMode && meditativeAnswerSymbols.length > 0 ? (
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
          ) : null}
        </div>

      </section>

      {meditativeMode ? null : (
        <aside className="sidebar-column">
          <SymbolInspector
            copy={copy}
            defaultMeaningItems={defaultMeaningItems}
            locale={locale}
            onOpenLexicon={appController.openSymbolEditor}
            personalMeaningItems={personalMeaningItems}
            symbol={currentSymbol}
          />

          <ReferencePanel copy={copy} help={help} onOpenHelp={() => appController.openDrawer("help")} />
        </aside>
      )}
    </main>
  );
}
