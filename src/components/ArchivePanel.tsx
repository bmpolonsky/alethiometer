import { InlineTemplateLink } from "./InlineTemplateLink";
import { appController } from "../app/services/appController";
import type { Locale, SavedReading, SymbolEntry } from "../domain/types";

interface ArchivePanelProps {
  locale: Locale;
  journal: SavedReading[];
  symbols: SymbolEntry[];
  openedReadingId: string | null;
  copy: {
    journalTitle: string;
    archiveHint: string;
    backupShortcutTemplate: string;
    openBackupSettings: string;
    emptyJournal: string;
    openSaved: string;
    deleteSaved: string;
    savedAt: string;
    questionTitle: string;
    answerTitle: string;
    answerSummaryLabel: string;
  };
  onOpenReading: (entry: SavedReading) => void;
  onDeleteReading: (readingId: string) => void;
}

function formatDate(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ArchivePanel({
  locale,
  journal,
  symbols,
  openedReadingId,
  copy,
  onOpenReading,
  onDeleteReading,
}: ArchivePanelProps) {
  return (
    <section className="archive-panel">
      <div className="panel-heading compact">
        <p className="panel-kicker">{copy.journalTitle}</p>
        <p className="panel-copy">{copy.archiveHint}</p>
        <InlineTemplateLink
          className="subtle inline-note"
          label={copy.openBackupSettings}
          onClick={() => appController.openDrawer("settings")}
          template={copy.backupShortcutTemplate}
          token="{backup}"
        />
      </div>

      {journal.length > 0 ? (
        <div className="archive-list">
          {journal.map((entry) => (
            <article
              className={`archive-item ${openedReadingId === entry.id ? "is-active" : ""}`}
              key={entry.id}
            >
              <div className="archive-item-header">
                <div className="archive-item-meta">
                  <strong>{formatDate(locale, entry.createdAt)}</strong>
                  <span>{copy.savedAt}</span>
                </div>
                <div className="archive-item-actions">
                  <button
                    className="ghost-action small-action"
                    onClick={() => onOpenReading(entry)}
                    type="button"
                  >
                    {copy.openSaved}
                  </button>
                  <button
                    className="ghost-action small-action destructive-action"
                    onClick={() => onDeleteReading(entry.id)}
                    type="button"
                  >
                    {copy.deleteSaved}
                  </button>
                </div>
              </div>

              {entry.questionText ? (
                <div className="archive-copy-block">
                  <span className="archive-chain-label">{copy.questionTitle}</span>
                  <p className="archive-question-text">{entry.questionText}</p>
                </div>
              ) : null}

              {entry.answerText ? (
                <div className="archive-copy-block">
                  <span className="archive-chain-label">{copy.answerSummaryLabel}</span>
                  <p className="archive-question-text">{entry.answerText}</p>
                </div>
              ) : null}

              <div className="archive-chain-grid">
                <div className="archive-chain-block">
                  <span className="archive-chain-label">{copy.questionTitle}</span>
                  <div className="saved-symbol-strip">
                    {entry.questionSymbols.map((symbolId, index) => {
                      const symbol = symbols[symbolId];

                      return (
                        <button
                          className="saved-symbol-chip"
                          key={`${entry.id}-question-${symbolId}-${index}`}
                          onClick={() => onOpenReading(entry)}
                          type="button"
                        >
                          <img alt="" src={symbol?.imageSrc} />
                          <span>{symbol?.title[locale] ?? "..."}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="archive-chain-block">
                  <span className="archive-chain-label">{copy.answerTitle}</span>
                  <div className="saved-symbol-strip">
                    {entry.answerSymbols.map((symbolId, index) => {
                      const symbol = symbols[symbolId];

                      return (
                        <button
                          className="saved-symbol-chip answer"
                          key={`${entry.id}-answer-${symbolId}-${index}`}
                          onClick={() => onOpenReading(entry)}
                          type="button"
                        >
                          <img alt="" src={symbol?.imageSrc} />
                          <span>{symbol?.title[locale] ?? "..."}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="subtle">{copy.emptyJournal}</p>
      )}
    </section>
  );
}
