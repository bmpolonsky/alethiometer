import { useRef, useState } from "react";
import { backupService } from "../app/services/backupService";
import { preferencesService } from "../app/services/preferencesService";
import type { Locale, ThemeMode } from "../domain/types";

interface SettingsPanelProps {
  locale: Locale;
  theme: ThemeMode;
  copy: {
    language: string;
    theme: string;
    light: string;
    dark: string;
    backupTitle: string;
    backupHint: string;
    exportData: string;
    importData: string;
    exportDone: string;
    importDone: string;
    importFailed: string;
    importConfirm: string;
  };
}

export function SettingsPanel({
  locale,
  theme,
  copy,
}: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleExport = () => {
    backupService.exportData();
    setFeedback(copy.exportDone);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!window.confirm(copy.importConfirm)) {
      return;
    }

    try {
      await backupService.importData(file);
      setFeedback(copy.importDone);
    } catch (error) {
      console.error(error);
      setFeedback(copy.importFailed);
    }
  };

  return (
    <section className="settings-panel">
      <label className="select-row">
        <span>{copy.language}</span>
        <select
          value={locale}
          onChange={(event) =>
            preferencesService.setLocale(event.target.value as Locale)
          }
        >
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </label>

      <label className="select-row">
        <span>{copy.theme}</span>
        <select
          value={theme}
          onChange={(event) =>
            preferencesService.setTheme(event.target.value as ThemeMode)
          }
        >
          <option value="light">{copy.light}</option>
          <option value="dark">{copy.dark}</option>
        </select>
      </label>

      <section className="settings-block">
        <div className="settings-copy">
          <p className="panel-kicker">{copy.backupTitle}</p>
          <p className="panel-copy">{copy.backupHint}</p>
        </div>

        <div className="settings-actions">
          <button className="secondary-action" onClick={handleExport} type="button">
            {copy.exportData}
          </button>
          <button className="ghost-action" onClick={handleImportClick} type="button">
            {copy.importData}
          </button>
        </div>

        <input
          accept="application/json,.json"
          className="hidden-file-input"
          onChange={handleImportChange}
          ref={fileInputRef}
          type="file"
        />

        {feedback ? <p className="subtle">{feedback}</p> : null}
      </section>
    </section>
  );
}
