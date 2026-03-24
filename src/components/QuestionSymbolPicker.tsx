import { appController } from "../app/services/appController";
import type { HandId, Locale, SymbolEntry } from "../domain/types";

interface QuestionSymbolPickerProps {
  locale: Locale;
  handId: HandId | null;
  currentSymbolId: number | null;
  symbols: SymbolEntry[];
  personalMeaningItemsBySymbol: Record<string, string[]>;
  copy: {
    chooseSymbolTitle: string;
    chooseSymbolHint: string;
    close: string;
  };
}

export function QuestionSymbolPicker({
  locale,
  handId,
  currentSymbolId,
  symbols,
  personalMeaningItemsBySymbol,
  copy,
}: QuestionSymbolPickerProps) {
  if (handId == null) {
    return null;
  }

  return (
    <div className="picker-backdrop" onClick={appController.closeQuestionPicker} role="presentation">
      <section
        aria-modal="true"
        className="picker-panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="picker-scroll-body">
          <div className="picker-header">
            <div>
              <p className="panel-kicker">{copy.chooseSymbolTitle}</p>
              <p className="panel-copy">{copy.chooseSymbolHint}</p>
            </div>
          </div>

          <div className="picker-list">
            {symbols.map((symbol) => (
              <button
                className={`picker-item ${symbol.id === currentSymbolId ? "is-active" : ""}`}
                key={`${handId}-${symbol.id}`}
                onClick={() => appController.applyQuestionSymbol(symbol.id)}
                type="button"
              >
                <img
                  alt=""
                  className="picker-item-image"
                  decoding="async"
                  loading="lazy"
                  src={symbol.imageSrc}
                />
                <span className="picker-item-copy">
                  <strong>{symbol.title[locale]}</strong>
                  <span>
                    {[
                      ...symbol.meanings[locale],
                      ...(personalMeaningItemsBySymbol[String(symbol.id)] ?? []),
                    ].join(", ")}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="picker-footer">
          <button
            className="ghost-action drawer-footer-action"
            onClick={appController.closeQuestionPicker}
            type="button"
          >
            {copy.close}
          </button>
        </div>
      </section>
    </div>
  );
}
