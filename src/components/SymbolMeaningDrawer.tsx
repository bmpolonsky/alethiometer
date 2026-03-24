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
    editMeaning: string;
    close: string;
  };
  onOpenLexicon: () => void;
  onClose: () => void;
}

export function SymbolMeaningDrawer({
  open,
  locale,
  symbol,
  defaultMeaningItems,
  personalMeaningItems,
  copy,
  onOpenLexicon,
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
        <div className="drawer-scroll-body">
          <div className="symbol-reading-grid drawer-symbol-layout">
            <div className="symbol-visual">
              <div className="symbol-badge">
                <img alt="" className="symbol-badge-image" src={symbol.imageSrc} />
              </div>
            </div>

            <div className="symbol-reading-copy">
              <div className="symbol-title-row">
                <div>
                  <p className="panel-kicker">{copy.symbolTitle}</p>
                  <h2 className="drawer-title">{symbol.title[locale]}</h2>
                </div>
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
        </div>

        <div className="drawer-footer">
          <button className="ghost-action drawer-footer-action" onClick={onClose} type="button">
            {copy.close}
          </button>
        </div>
      </aside>
    </div>
  );
}
