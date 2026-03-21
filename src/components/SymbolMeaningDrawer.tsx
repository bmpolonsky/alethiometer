import { formatBaseMeaningItem } from "../domain/meanings";
import type { Locale, SymbolEntry } from "../domain/types";

interface SymbolMeaningDrawerProps {
  open: boolean;
  locale: Locale;
  symbol: SymbolEntry;
  defaultMeaningItems: string[];
  personalMeaningItems: string[];
  copy: {
    symbolTitle: string;
    defaultMeaning: string;
    personalMeaning: string;
    emptyPersonalMeaning: string;
    close: string;
  };
  onClose: () => void;
}

export function SymbolMeaningDrawer({
  open,
  locale,
  symbol,
  defaultMeaningItems,
  personalMeaningItems,
  copy,
  onClose,
}: SymbolMeaningDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="drawer-panel drawer-panel-narrow meditative-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <p className="panel-kicker">{copy.symbolTitle}</p>
            <h2 className="drawer-title">{symbol.title[locale]}</h2>
          </div>
          <button className="ghost-action" onClick={onClose} type="button">
            {copy.close}
          </button>
        </div>

        <div className="drawer-symbol-intro">
          <div className="symbol-badge">
            <img alt="" className="symbol-badge-image" src={symbol.imageSrc} />
          </div>
        </div>

        <div className="meaning-section first">
          <p className="meaning-label">{copy.defaultMeaning}</p>
          <ul className="meaning-list">
            {defaultMeaningItems.map((item) => (
              <li key={item}>{formatBaseMeaningItem(item)}</li>
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
      </aside>
    </div>
  );
}
