import type { Locale, SymbolEntry } from "../domain/types";

interface SymbolInspectorProps {
  locale: Locale;
  copy: {
    symbolTitle: string;
    defaultMeaning: string;
    personalMeaning: string;
    emptyPersonalMeaning: string;
    editMeaning: string;
  };
  symbol: SymbolEntry;
  defaultMeaningItems: string[];
  personalMeaningItems: string[];
  onOpenLexicon: () => void;
}

export function SymbolInspector({
  locale,
  copy,
  symbol,
  defaultMeaningItems,
  personalMeaningItems,
  onOpenLexicon,
}: SymbolInspectorProps) {
  return (
    <section className="panel symbol-panel">
      <div className="panel-heading">
        <p className="panel-kicker">{copy.symbolTitle}</p>
      </div>

      <div className="symbol-reading-grid">
        <div className="symbol-visual">
          <div className="symbol-badge large">
            <img alt="" className="symbol-badge-image" src={symbol.imageSrc} />
          </div>
        </div>

        <div className="symbol-reading-copy">
          <div className="symbol-title-row">
            <h2 className="symbol-name">{symbol.title[locale]}</h2>
            <button
              aria-label={copy.editMeaning}
              className="ghost-action symbol-edit-icon"
              onClick={onOpenLexicon}
              title={copy.editMeaning}
              type="button"
            >
              <span aria-hidden="true">✎</span>
            </button>
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
        </div>
      </div>
    </section>
  );
}
