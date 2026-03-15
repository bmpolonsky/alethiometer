import type { Locale, SymbolEntry } from "../domain/types";

interface SymbolCatalogPanelProps {
  locale: Locale;
  symbols: SymbolEntry[];
  symbol: SymbolEntry;
  defaultMeaningItems: string[];
  personalMeaningItems: string[];
  copy: {
    catalogTitle: string;
    catalogHint: string;
    defaultMeaning: string;
    personalMeaning: string;
    emptyPersonalMeaning: string;
    editMeaning: string;
  };
  onInspectSymbol: (symbolId: number) => void;
  onOpenLexicon: () => void;
}

export function SymbolCatalogPanel({
  locale,
  symbols,
  symbol,
  defaultMeaningItems,
  personalMeaningItems,
  copy,
  onInspectSymbol,
  onOpenLexicon,
}: SymbolCatalogPanelProps) {
  return (
    <section className="catalog-panel">
      <div className="panel-heading compact">
        <p className="panel-kicker">{copy.catalogTitle}</p>
        <p className="panel-copy">{copy.catalogHint}</p>
      </div>

      <div className="catalog-layout">
        <div className="catalog-list">
          {symbols.map((entry) => (
            <button
              className={`catalog-item ${entry.id === symbol.id ? "is-active" : ""}`}
              key={entry.id}
              onClick={() => onInspectSymbol(entry.id)}
              type="button"
            >
              <img alt="" className="catalog-item-image" src={entry.imageSrc} />
              <span className="catalog-item-copy">
                <strong>{entry.title[locale]}</strong>
                <span>{entry.meanings[locale].slice(0, 3).join(", ")}</span>
              </span>
            </button>
          ))}
        </div>

        <article className="catalog-detail">
          <div className="drawer-symbol-intro">
            <div className="symbol-badge">
              <img alt="" className="symbol-badge-image" src={symbol.imageSrc} />
            </div>
            <div className="drawer-symbol-copy">
              <h3 className="drawer-symbol-title">{symbol.title[locale]}</h3>
              <button
                className="ghost-action small-action inline-action"
                onClick={onOpenLexicon}
                type="button"
              >
                {copy.editMeaning}
              </button>
            </div>
          </div>

          <div className="meaning-section first">
            <p className="meaning-label">{copy.defaultMeaning}</p>
            <ul className="meaning-list">
              {defaultMeaningItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="meaning-section">
            <p className="meaning-label">{copy.personalMeaning}</p>
            {personalMeaningItems.length > 0 ? (
              <ul className="meaning-list personal">
                {personalMeaningItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="subtle">{copy.emptyPersonalMeaning}</p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
