import { HAND_ORDER } from "../domain/types";
import type { HandId, Locale, SymbolEntry } from "../domain/types";

interface ControlPanelProps {
  locale: Locale;
  copy: {
    questionTitle: string;
    questionHint: string;
    handLabels: Record<HandId, string>;
    ask: string;
    saveReading: string;
    countdownStatus: string;
    revealStatus: string;
    answerTitle: string;
  };
  symbols: SymbolEntry[];
  hands: Record<HandId, number>;
  activeHand: HandId;
  countdownSecondsLeft: number;
  status: "idle" | "countdown" | "revealing";
  canSaveReading: boolean;
  answerSymbols: number[];
  onFocusHand: (handId: HandId) => void;
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
  onFocusHand,
  onAsk,
  onSaveReading,
  onInspectSymbol,
}: ControlPanelProps) {
  const statusText =
    status === "countdown"
      ? `${copy.countdownStatus} ${countdownSecondsLeft}s`
      : status === "revealing"
        ? copy.revealStatus
        : null;

  return (
    <section className="panel control-panel">
      <div className="panel-heading">
        <p className="panel-kicker">{copy.questionTitle}</p>
        <p className="panel-copy">{copy.questionHint}</p>
      </div>

      <div className="formula-row">
        {HAND_ORDER.map((handId, index) => {
          const symbol = symbols[hands[handId]];

          return (
            <button
              key={handId}
              className={`formula-chip ${activeHand === handId ? "is-active" : ""}`}
              onClick={() => onFocusHand(handId)}
              type="button"
            >
              <img
                alt=""
                className="formula-chip-image"
                src={symbol?.imageSrc}
              />
              <span className="formula-chip-copy">
                <span className="hand-card-title">
                  {copy.handLabels[handId]} {index + 1}
                </span>
                <strong>{symbol?.title[locale] ?? "..."}</strong>
              </span>
            </button>
          );
        })}
      </div>

      <div className="control-actions">
        <button
          className="primary-action"
          disabled={status !== "idle"}
          onClick={onAsk}
          type="button"
        >
          {copy.ask}
        </button>
      </div>

      {statusText ? (
        <div className="status-row">
          <p className="status-inline">{statusText}</p>
        </div>
      ) : null}

      {answerSymbols.length > 0 ? (
        <div className="embedded-answer">
          <p className="panel-kicker">{copy.answerTitle}</p>
          <div className="symbol-chip-row compact">
            {answerSymbols.map((symbolId, index) => {
              const symbol = symbols[symbolId];

              return (
                <button
                  key={`${symbolId}-${index}`}
                  className="symbol-chip is-answer"
                  onClick={() => onInspectSymbol(symbolId)}
                  style={{ animationDelay: `${index * 120}ms` }}
                  type="button"
                >
                  <img
                    alt=""
                    className="symbol-chip-image"
                    src={symbol?.imageSrc}
                  />
                  <span className="symbol-chip-title">{symbol?.title[locale]}</span>
                </button>
              );
            })}
          </div>
          {canSaveReading ? (
            <div className="embedded-answer-actions">
              <button className="secondary-action" onClick={onSaveReading} type="button">
                {copy.saveReading}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
