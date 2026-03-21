import type { Locale, ThemeMode } from "../domain/types";

interface SettingsPanelProps {
  locale: Locale;
  theme: ThemeMode;
  copy: {
    settingsTitle: string;
    language: string;
    theme: string;
    dawn: string;
    night: string;
  };
  onSetLocale: (locale: Locale) => void;
  onSetTheme: (theme: ThemeMode) => void;
}

export function SettingsPanel({
  locale,
  theme,
  copy,
  onSetLocale,
  onSetTheme,
}: SettingsPanelProps) {
  return (
    <section className="settings-panel">
      <label className="select-row">
        <span>{copy.language}</span>
        <select value={locale} onChange={(event) => onSetLocale(event.target.value as Locale)}>
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </label>

      <label className="select-row">
        <span>{copy.theme}</span>
        <select value={theme} onChange={(event) => onSetTheme(event.target.value as ThemeMode)}>
          <option value="dawn">{copy.dawn}</option>
          <option value="night">{copy.night}</option>
        </select>
      </label>
    </section>
  );
}
