import type { Locale, SymbolEntry } from "../domain/types";

interface LexiconDrawerProps {
  open: boolean;
  locale: Locale;
  symbol: SymbolEntry;
  copy: {
    lexiconTitle: string;
    personalHint: string;
    saveMeaning: string;
    resetMeaning: string;
    close: string;
  };
  draftMeaning: string;
  onDraftChange: (value: string) => void;
  onSaveMeaning: () => void;
  onResetMeaning: () => void;
  onClose: () => void;
}

export function LexiconDrawer({
  open,
  locale,
  symbol,
  copy,
  draftMeaning,
  onDraftChange,
  onSaveMeaning,
  onResetMeaning,
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
        <textarea
          className="meaning-editor drawer-editor"
          value={draftMeaning}
          onChange={(event) => onDraftChange(event.target.value)}
        />

        <div className="meaning-actions">
          <button className="secondary-action" onClick={onSaveMeaning} type="button">
            {copy.saveMeaning}
          </button>
          <button className="ghost-action" onClick={onResetMeaning} type="button">
            {copy.resetMeaning}
          </button>
        </div>
      </aside>
    </div>
  );
}
