import { ArchivePanel } from "./ArchivePanel";
import { HelpPanel } from "./HelpPanel";
import { SettingsPanel } from "./SettingsPanel";
import { SymbolCatalogPanel } from "./SymbolCatalogPanel";
import { appController } from "../app/services/appController";
import type {
  Locale,
  MenuSection,
  SavedReading,
  SymbolEntry,
  ThemeMode,
} from "../domain/types";

interface SettingsDrawerProps {
  locale: Locale;
  theme: ThemeMode;
  section: MenuSection;
  symbols: SymbolEntry[];
  symbol: SymbolEntry;
  defaultMeaningItems: string[];
  personalMeaningItems: string[];
  allMeaningItemsBySymbol: Record<string, string[]>;
  newMeaningDraft: string;
  isEditingMeanings: boolean;
  journal: SavedReading[];
  openedReadingId: string | null;
  copy: {
    settingsTitle: string;
    catalogTitle: string;
    catalogHint: string;
    settingsSection: string;
    symbolsSection: string;
    archiveSection: string;
    helpSection: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
    backupTitle: string;
    backupHint: string;
    backupShortcutTemplate: string;
    openBackupSettings: string;
    exportData: string;
    importData: string;
    exportDone: string;
    importDone: string;
    importFailed: string;
    importConfirm: string;
    defaultMeaning: string;
    personalMeaning: string;
    emptyPersonalMeaning: string;
    editMeaning: string;
    addMeaning: string;
    deleteMeaning: string;
    newMeaningPlaceholder: string;
    doneEditing: string;
    close: string;
    journalTitle: string;
    archiveHint: string;
    emptyJournal: string;
    openSaved: string;
    deleteSaved: string;
    savedAt: string;
    questionTitle: string;
    answerTitle: string;
    answerSummaryLabel: string;
  };
  help: {
    guidanceTitle: string;
    helpIntro: string;
    helpSections: Array<{
      title: string;
      intro?: string;
      items: string[];
    }>;
  };
}

export function SettingsDrawer({
  locale,
  theme,
  section,
  symbols,
  symbol,
  defaultMeaningItems,
  personalMeaningItems,
  allMeaningItemsBySymbol,
  newMeaningDraft,
  isEditingMeanings,
  journal,
  openedReadingId,
  copy,
  help,
}: SettingsDrawerProps) {
  const title =
    section === "settings"
      ? copy.settingsSection
      : section === "symbols"
        ? copy.symbolsSection
        : section === "archive"
          ? copy.archiveSection
          : copy.helpSection;

  const drawerClassName =
    section === "symbols"
      ? "drawer-panel drawer-panel-wide"
      : section === "archive"
        ? "drawer-panel drawer-panel-medium"
        : "drawer-panel drawer-panel-narrow";

  return (
    <div className="drawer-backdrop" onClick={appController.closeDrawer} role="presentation">
      <aside className={drawerClassName} onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <p className="panel-kicker">{copy.settingsTitle}</p>
            <h2 className="drawer-title">{title}</h2>
          </div>
        </div>

        <div className="drawer-scroll-body">
          {section === "settings" ? (
            <SettingsPanel copy={copy} locale={locale} theme={theme} />
          ) : null}

          {section === "symbols" ? (
            <SymbolCatalogPanel
              allMeaningItemsBySymbol={allMeaningItemsBySymbol}
              copy={copy}
              defaultMeaningItems={defaultMeaningItems}
              isEditingMeanings={isEditingMeanings}
              locale={locale}
              newMeaningDraft={newMeaningDraft}
              personalMeaningItems={personalMeaningItems}
              symbol={symbol}
              symbols={symbols}
            />
          ) : null}

          {section === "archive" ? (
            <ArchivePanel
              copy={copy}
              journal={journal}
              locale={locale}
              openedReadingId={openedReadingId}
              symbols={symbols}
            />
          ) : null}

          {section === "help" ? (
            <HelpPanel copy={copy} help={help} />
          ) : null}
        </div>

        <div className="drawer-footer">
          <button
            className="ghost-action drawer-footer-action"
            onClick={appController.closeDrawer}
            type="button"
          >
            {copy.close}
          </button>
        </div>
      </aside>
    </div>
  );
}
