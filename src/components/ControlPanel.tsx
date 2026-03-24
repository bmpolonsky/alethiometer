import { HAND_ORDER } from "../domain/types";
import type { HandId, Locale, SymbolEntry } from "../domain/types";

interface ControlPanelProps {
  locale: Locale;
  copy: {
    questionTitle: string;
    ask: string;
    saveReading: string;
    listeningStatus: string;
    answerTitle: string;
    answerPlaceholder: string;
  };
  symbols: SymbolEntry[];
  hands: Record<HandId, number>;
  activeHand: HandId;
  status: "idle" | "listening";
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
  status,
  canSaveReading,
  answerSymbols,
  onOpenPicker,
  onAsk,
  onSaveReading,
  onInspectSymbol,
}: ControlPanelProps) {
  const statusText = status === "listening" ? copy.listeningStatus : null;
  const hasAnswer = answerSymbols.length > 0;
  const showPrimaryAction = !hasAnswer;
  const showSaveAction = hasAnswer && canSaveReading;

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
          <div className={`answer-strip-body ${hasAnswer ? "" : "is-empty"}`}>
            {hasAnswer ? (
              <div className="selection-card-row answer-row">
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
                ) : null}
              </div>
            ) : null}

            {showPrimaryAction ? (
              <button
                className={`primary-action answer-inline-action ${statusText ? "answer-inline-action-status" : ""}`}
                disabled={Boolean(statusText)}
                onClick={() => {
                  if (!statusText) {
                    onAsk();
                  }
                }}
                type="button"
              >
                {statusText ?? copy.ask}
              </button>
            ) : null}

            {showSaveAction ? (
              <button
                className="secondary-action answer-inline-action answer-inline-action-save"
                onClick={onSaveReading}
                type="button"
              >
                {copy.saveReading}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
