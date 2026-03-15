import type { Locale, SymbolEntry } from "../domain/types";

interface LexiconPanelProps {
  locale: Locale;
  symbol: SymbolEntry;
  copy: {
    lexiconTitle: string;
    lexiconSymbolLabel: string;
    defaultMeaning: string;
    personalMeaning: string;
    emptyPersonalMeaning: string;
    personalHint: string;
    addMeaning: string;
    deleteMeaning: string;
    newMeaningPlaceholder: string;
  };
  defaultMeaningItems: string[];
  draftMeaningItems: string[];
  newMeaningDraft: string;
  onDraftChange: (index: number, value: string) => void;
  onNewMeaningDraftChange: (value: string) => void;
  onAddMeaning: () => void;
  onRemoveMeaning: (index: number) => void;
}

export function LexiconPanel({
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
}: LexiconPanelProps) {
  return (
    <section className="lexicon-panel">
      <div className="panel-heading compact">
        <p className="panel-kicker">{copy.lexiconTitle}</p>
        <p className="panel-copy">{copy.personalHint}</p>
      </div>

      <div className="drawer-symbol-intro">
        <div className="symbol-badge">
          <img alt="" className="symbol-badge-image" src={symbol.imageSrc} />
        </div>
        <div className="drawer-symbol-copy">
          <p className="meaning-label">{copy.lexiconSymbolLabel}</p>
          <h3 className="drawer-symbol-title">{symbol.title[locale]}</h3>
        </div>
      </div>

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
            {draftMeaningItems.length > 0 ? (
              draftMeaningItems.map((item, index) => (
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
              ))
            ) : (
              <p className="subtle">{copy.emptyPersonalMeaning}</p>
            )}

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
              <button
                className="secondary-action small-action"
                onClick={onAddMeaning}
                type="button"
              >
                {copy.addMeaning}
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
