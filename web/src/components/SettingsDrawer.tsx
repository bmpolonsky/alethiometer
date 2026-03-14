import type {
  Locale,
  SavedReading,
  TextDensity,
  ThemeMode,
} from "../domain/types";
import { SettingsPanel } from "./SettingsPanel";

interface SettingsDrawerProps {
  open: boolean;
  locale: Locale;
  theme: ThemeMode;
  density: TextDensity;
  journal: SavedReading[];
  copy: {
    settingsTitle: string;
    language: string;
    theme: string;
    density: string;
    dawn: string;
    night: string;
    normal: string;
    large: string;
    guidanceTitle: string;
    journalTitle: string;
    emptyJournal: string;
    openSaved: string;
    savedAt: string;
    close: string;
  };
  onClose: () => void;
  onSetLocale: (locale: Locale) => void;
  onSetTheme: (theme: ThemeMode) => void;
  onSetDensity: (density: TextDensity) => void;
  onOpenReading: (entry: SavedReading) => void;
}

export function SettingsDrawer({
  open,
  locale,
  theme,
  density,
  journal,
  copy,
  onClose,
  onSetLocale,
  onSetTheme,
  onSetDensity,
  onOpenReading,
}: SettingsDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="drawer-panel settings-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <p className="panel-kicker">{copy.settingsTitle}</p>
            <h2 className="drawer-title">{copy.settingsTitle}</h2>
          </div>
          <button className="ghost-action" onClick={onClose} type="button">
            {copy.close}
          </button>
        </div>

        <SettingsPanel
          copy={copy}
          density={density}
          journal={journal}
          locale={locale}
          onOpenReading={onOpenReading}
          onSetDensity={onSetDensity}
          onSetLocale={onSetLocale}
          onSetTheme={onSetTheme}
          theme={theme}
        />
      </aside>
    </div>
  );
}
