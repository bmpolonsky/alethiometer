import type { HandId, Locale, SymbolEntry } from "../domain/types";

interface QuestionSymbolPickerProps {
  open: boolean;
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
  onClose: () => void;
  onSelect: (symbolId: number) => void;
}

export function QuestionSymbolPicker({
  open,
  locale,
  handId,
  currentSymbolId,
  symbols,
  personalMeaningItemsBySymbol,
  copy,
  onClose,
  onSelect,
}: QuestionSymbolPickerProps) {
  if (!open || handId == null) {
    return null;
  }

  return (
    <div className="picker-backdrop" onClick={onClose} role="presentation">
      <section
        aria-modal="true"
        className="picker-panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="picker-header">
          <div>
            <p className="panel-kicker">{copy.chooseSymbolTitle}</p>
            <p className="panel-copy">{copy.chooseSymbolHint}</p>
          </div>
          <button className="ghost-action" onClick={onClose} type="button">
            {copy.close}
          </button>
        </div>

        <div className="picker-list">
          {symbols.map((symbol) => (
            <button
              className={`picker-item ${symbol.id === currentSymbolId ? "is-active" : ""}`}
              key={`${handId}-${symbol.id}`}
              onClick={() => onSelect(symbol.id)}
              type="button"
            >
              <img alt="" className="picker-item-image" src={symbol.imageSrc} />
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
      </section>
    </div>
  );
}
