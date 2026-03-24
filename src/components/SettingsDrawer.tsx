import { ArchivePanel } from "./ArchivePanel";
import { HelpPanel } from "./HelpPanel";
import { SettingsPanel } from "./SettingsPanel";
import { SymbolCatalogPanel } from "./SymbolCatalogPanel";
import type {
  Locale,
  MenuSection,
  SavedReading,
  SymbolEntry,
  ThemeMode,
} from "../domain/types";

interface SettingsDrawerProps {
  open: boolean;
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
    personalHint: string;
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
  onClose: () => void;
  onInspectSymbol: (symbolId: number) => void;
  onSetLocale: (locale: Locale) => void;
  onSetTheme: (theme: ThemeMode) => void;
  onExportData: () => void;
  onImportData: (file: File) => Promise<void>;
  onStartEditingMeanings: () => void;
  onStopEditingMeanings: () => void;
  onOpenReading: (entry: SavedReading) => void;
  onDeleteReading: (readingId: string) => void;
  onMeaningChange: (index: number, value: string) => void;
  onNewMeaningDraftChange: (value: string) => void;
  onAddMeaning: () => void;
  onRemoveMeaning: (index: number) => void;
}

export function SettingsDrawer({
  open,
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
  onClose,
  onInspectSymbol,
  onSetLocale,
  onSetTheme,
  onExportData,
  onImportData,
  onStartEditingMeanings,
  onStopEditingMeanings,
  onOpenReading,
  onDeleteReading,
  onMeaningChange,
  onNewMeaningDraftChange,
  onAddMeaning,
  onRemoveMeaning,
}: SettingsDrawerProps) {
  if (!open) {
    return null;
  }

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
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside className={drawerClassName} onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <p className="panel-kicker">{copy.settingsTitle}</p>
            <h2 className="drawer-title">{title}</h2>
          </div>
        </div>

        <div className="drawer-scroll-body">
          {section === "settings" ? (
            <SettingsPanel
              copy={copy}
              locale={locale}
              onSetLocale={onSetLocale}
              onSetTheme={onSetTheme}
              onExportData={onExportData}
              onImportData={onImportData}
              theme={theme}
            />
          ) : null}

          {section === "symbols" ? (
            <SymbolCatalogPanel
              allMeaningItemsBySymbol={allMeaningItemsBySymbol}
              copy={copy}
              defaultMeaningItems={defaultMeaningItems}
              isEditingMeanings={isEditingMeanings}
              locale={locale}
              newMeaningDraft={newMeaningDraft}
              onAddMeaning={onAddMeaning}
              onStopEditingMeanings={onStopEditingMeanings}
              onMeaningChange={onMeaningChange}
              onInspectSymbol={onInspectSymbol}
              onNewMeaningDraftChange={onNewMeaningDraftChange}
              onStartEditingMeanings={onStartEditingMeanings}
              onRemoveMeaning={onRemoveMeaning}
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
              onDeleteReading={onDeleteReading}
              onOpenReading={onOpenReading}
              openedReadingId={openedReadingId}
              symbols={symbols}
            />
          ) : null}

          {section === "help" ? (
            <HelpPanel copy={copy} help={help} />
          ) : null}
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
