import type { Locale, SymbolEntry } from "../domain/types";

interface LexiconDrawerProps {
  open: boolean;
  locale: Locale;
  symbol: SymbolEntry;
  copy: {
    lexiconTitle: string;
    defaultMeaning: string;
    personalMeaning: string;
    personalHint: string;
    addMeaning: string;
    deleteMeaning: string;
    newMeaningPlaceholder: string;
    close: string;
  };
  defaultMeaningItems: string[];
  draftMeaningItems: string[];
  newMeaningDraft: string;
  onDraftChange: (index: number, value: string) => void;
  onNewMeaningDraftChange: (value: string) => void;
  onAddMeaning: () => void;
  onRemoveMeaning: (index: number) => void;
  onClose: () => void;
}

export function LexiconDrawer({
  open,
  locale,
  symbol,
  copy,
  defaultMeaningItems,
  draftMeaningItems,
  newMeaningDraft,
  onDraftChange,
  onNewMeaningDraftChange,
  onAddMeaning,
  onRemoveMeaning,
  onClose,
}: LexiconDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="drawer-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <p className="panel-kicker">{copy.lexiconTitle}</p>
            <h2 className="drawer-title">{symbol.title[locale]}</h2>
          </div>
          <button className="ghost-action" onClick={onClose} type="button">
            {copy.close}
          </button>
        </div>

        <p className="panel-copy">{copy.personalHint}</p>

        <div className="drawer-meaning-sections">
          <section className="drawer-meaning-section">
            <p className="meaning-label">{copy.defaultMeaning}</p>
            <ul className="meaning-list drawer-fixed-list">
              {defaultMeaningItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="drawer-meaning-section">
            <p className="meaning-label">{copy.personalMeaning}</p>

            <div className="drawer-item-list">
              {draftMeaningItems.map((item, index) => (
                <div className="drawer-item-row" key={`${item}-${index}`}>
                  <span className="drawer-item-bullet" aria-hidden="true">
                    •
                  </span>
                <input
                  className="drawer-item-input"
                  onChange={(event) => onDraftChange(index, event.target.value)}
                  type="text"
                  value={item}
                />
                  <button
                    className="ghost-action small-action"
                    onClick={() => onRemoveMeaning(index)}
                    type="button"
                  >
                    {copy.deleteMeaning}
                  </button>
                </div>
              ))}

              <div className="drawer-item-row is-new">
                <span className="drawer-item-bullet" aria-hidden="true">
                  +
                </span>
                <input
                  className="drawer-item-input"
                  onChange={(event) => onNewMeaningDraftChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      onAddMeaning();
                    }
                  }}
                  placeholder={copy.newMeaningPlaceholder}
                  type="text"
                  value={newMeaningDraft}
                />
                <button className="secondary-action small-action" onClick={onAddMeaning} type="button">
                  {copy.addMeaning}
                </button>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
