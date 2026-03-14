import type { Locale, SymbolEntry } from "../domain/types";

interface SymbolInspectorProps {
  locale: Locale;
  copy: {
    symbolTitle: string;
    defaultMeaning: string;
    personalMeaning: string;
    noPersonalMeaning: string;
    editMeaning: string;
    customBadge: string;
  };
  symbol: SymbolEntry;
  symbolId: number;
  defaultMeaning: string;
  personalMeaning: string | null;
  hasCustomMeaning: boolean;
  onOpenLexicon: () => void;
}

export function SymbolInspector({
  locale,
  copy,
  symbol,
  symbolId,
  defaultMeaning,
  personalMeaning,
  hasCustomMeaning,
  onOpenLexicon,
}: SymbolInspectorProps) {
  return (
    <section className="panel symbol-panel">
      <div className="panel-heading">
        <p className="panel-kicker">{copy.symbolTitle}</p>
      </div>

      <div className="symbol-header">
        <div className="symbol-identity is-standalone">
          <div
            className="symbol-badge"
          >
            <img alt="" className="symbol-badge-image" src={symbol.imageSrc} />
          </div>
          <div className="symbol-copy">
            <p className="panel-kicker">{String(symbolId + 1).padStart(2, "0")}</p>
            <h2>{symbol.title[locale]}</h2>
          </div>
        </div>
      </div>

      <div className="meaning-block">
        <p className="meaning-label">{copy.defaultMeaning}</p>
        <p className="meaning-body">{defaultMeaning}</p>
      </div>

      <div className="meaning-block">
        <div className="meaning-header">
          <p className="meaning-label">{copy.personalMeaning}</p>
          {hasCustomMeaning ? <span className="custom-chip">{copy.customBadge}</span> : null}
        </div>
        <p className="meaning-body">
          {personalMeaning ?? copy.noPersonalMeaning}
        </p>
        <button className="secondary-action inline-action" onClick={onOpenLexicon} type="button">
          {copy.editMeaning}
        </button>
      </div>
    </section>
  );
}
