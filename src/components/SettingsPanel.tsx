import type { Locale, ThemeMode } from "../domain/types";

interface SettingsPanelProps {
  locale: Locale;
  theme: ThemeMode;
  copy: {
    settingsTitle: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
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
          <option value="light">{copy.light}</option>
          <option value="dark">{copy.dark}</option>
        </select>
      </label>
    </section>
  );
}
