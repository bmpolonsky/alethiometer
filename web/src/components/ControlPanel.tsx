import { HAND_ORDER } from "../domain/types";
import type { HandId, Locale, SymbolEntry } from "../domain/types";

interface ControlPanelProps {
  locale: Locale;
  copy: {
    questionTitle: string;
    ask: string;
    saveReading: string;
    countdownStatus: string;
    answerTitle: string;
    answerPlaceholder: string;
  };
  symbols: SymbolEntry[];
  hands: Record<HandId, number>;
  activeHand: HandId;
  countdownSecondsLeft: number;
  status: "idle" | "countdown" | "revealing";
  canSaveReading: boolean;
  answerSymbols: number[];
  onOpenPicker: (handId: HandId) => void;
  onAsk: () => void;
  onSaveReading: () => void;
  onInspectSymbol: (symbolId: number) => void;
}

export function ControlPanel({
  locale,
  copy,
  symbols,
  hands,
  activeHand,
  countdownSecondsLeft,
  status,
  canSaveReading,
  answerSymbols,
  onOpenPicker,
  onAsk,
  onSaveReading,
  onInspectSymbol,
}: ControlPanelProps) {
  const statusText =
    status === "countdown" ? `${copy.countdownStatus} ${countdownSecondsLeft}s` : null;
  const hasAnswer = answerSymbols.length > 0;

  return (
    <section className="panel control-panel compact-panel">
      <div className="control-band">
        <div className="selection-group">
          <p className="panel-kicker">{copy.questionTitle}</p>
          <div className="selection-card-row question-row">
            {HAND_ORDER.map((handId) => {
              const symbol = symbols[hands[handId]];

              return (
                <button
                  key={handId}
                  className={`selection-card ${activeHand === handId ? "is-active" : ""}`}
                  onClick={() => onOpenPicker(handId)}
                  type="button"
                >
                  <img alt="" className="selection-card-image" src={symbol?.imageSrc} />
                  <span className="selection-card-meta">
                    <span className="selection-card-title">{symbol?.title[locale] ?? "..."}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="control-flow-divider" aria-hidden="true" />

        <div className="selection-group answer-strip">
          <p className="panel-kicker">{copy.answerTitle}</p>
          <div className={`selection-card-row answer-row ${hasAnswer ? "" : "is-empty"}`}>
            {hasAnswer ? (
              answerSymbols.map((symbolId, index) => {
                const symbol = symbols[symbolId];

                return (
                  <button
                    key={`${symbolId}-${index}`}
                    className="selection-card answer-card"
                    onClick={() => onInspectSymbol(symbolId)}
                    style={{ animationDelay: `${index * 120}ms` }}
                    type="button"
                  >
                    <img alt="" className="selection-card-image" src={symbol?.imageSrc} />
                    <span className="selection-card-meta">
                      <span className="selection-card-title">{symbol?.title[locale]}</span>
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="answer-placeholder">
                {statusText ?? copy.answerPlaceholder}
              </div>
            )}
          </div>
        </div>

        <div className="control-actions compact band-actions">
          <button className="primary-action" disabled={status !== "idle"} onClick={onAsk} type="button">
            {copy.ask}
          </button>
          <button
            className={`ghost-action small-action save-answer-button ${hasAnswer && canSaveReading ? "" : "is-hidden"}`}
            disabled={!canSaveReading}
            onClick={onSaveReading}
            type="button"
          >
            {copy.saveReading}
          </button>
        </div>
      </div>
    </section>
  );
}
