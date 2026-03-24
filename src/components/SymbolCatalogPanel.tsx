import { InlineTemplateLink } from "./InlineTemplateLink";
import { appController } from "../app/services/appController";
import { meaningsService } from "../app/services/meaningsService";
import type { Locale, SymbolEntry } from "../domain/types";

interface SymbolCatalogPanelProps {
  locale: Locale;
  symbols: SymbolEntry[];
  symbol: SymbolEntry;
  defaultMeaningItems: string[];
  personalMeaningItems: string[];
  allMeaningItemsBySymbol: Record<string, string[]>;
  newMeaningDraft: string;
  isEditingMeanings: boolean;
  copy: {
    catalogTitle: string;
    catalogHint: string;
    backupShortcutTemplate: string;
    openBackupSettings: string;
    defaultMeaning: string;
    personalMeaning: string;
    emptyPersonalMeaning: string;
    editMeaning: string;
    addMeaning: string;
    deleteMeaning: string;
    newMeaningPlaceholder: string;
    doneEditing: string;
  };
}

export function SymbolCatalogPanel({
  locale,
  symbols,
  symbol,
  defaultMeaningItems,
  personalMeaningItems,
  allMeaningItemsBySymbol,
  newMeaningDraft,
  isEditingMeanings,
  copy,
}: SymbolCatalogPanelProps) {
  return (
    <section className="catalog-panel">
      <div className="panel-heading compact">
        <p className="panel-kicker">{copy.catalogTitle}</p>
        <p className="panel-copy">{copy.catalogHint}</p>
        <InlineTemplateLink
          className="subtle inline-note"
          label={copy.openBackupSettings}
          onClick={() => appController.openDrawer("settings")}
          template={copy.backupShortcutTemplate}
          token="{backup}"
        />
      </div>

      <div className="catalog-layout">
        <div className="catalog-list">
          {symbols.map((entry) => (
            <button
              className={`catalog-item ${entry.id === symbol.id ? "is-active" : ""}`}
              key={entry.id}
              onClick={() => appController.inspectSymbolFromDrawer(entry.id)}
              type="button"
            >
              <img alt="" className="catalog-item-image" src={entry.imageSrc} />
              <span className="catalog-item-copy">
                <strong>{entry.title[locale]}</strong>
                <span>
                  {[
                    ...entry.meanings[locale],
                    ...(allMeaningItemsBySymbol[String(entry.id)] ?? []),
                  ].join(", ")}
                </span>
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
                onClick={
                  isEditingMeanings
                    ? () => meaningsService.closeEditor()
                    : () => meaningsService.openEditor()
                }
                type="button"
              >
                {isEditingMeanings ? copy.doneEditing : copy.editMeaning}
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
            {isEditingMeanings ? (
              <div className="drawer-item-list catalog-inline-editor">
                {personalMeaningItems.length > 0 ? (
                  personalMeaningItems.map((item, index) => (
                    <div className="drawer-item-row" key={index}>
                      <span className="drawer-item-bullet" aria-hidden="true">
                        •
                      </span>
                      <input
                        className="drawer-item-input"
                        onChange={(event) =>
                          meaningsService.updateMeaningItem(index, event.target.value)
                        }
                        type="text"
                        value={item}
                      />
                      <button
                        className="ghost-action small-action"
                        onClick={() => meaningsService.removeMeaningItem(index)}
                        type="button"
                      >
                        {copy.deleteMeaning}
                      </button>
                    </div>
                  ))
                ) : null}

                <div className="drawer-item-row is-new">
                  <input
                    className="drawer-item-input drawer-item-input-new"
                    onChange={(event) =>
                      meaningsService.updateNewMeaningDraft(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        meaningsService.addDraftMeaningItem();
                      }
                    }}
                    placeholder={copy.newMeaningPlaceholder}
                    type="text"
                    value={newMeaningDraft}
                  />
                  <button
                    className="secondary-action small-action"
                    onClick={meaningsService.addDraftMeaningItem}
                    type="button"
                  >
                    {copy.addMeaning}
                  </button>
                </div>
              </div>
            ) : personalMeaningItems.length > 0 ? (
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
