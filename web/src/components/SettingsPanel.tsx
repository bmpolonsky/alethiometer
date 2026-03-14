import { guidanceText } from "../domain/symbols";
import type {
  Locale,
  SavedReading,
  TextDensity,
  ThemeMode,
} from "../domain/types";

interface SettingsPanelProps {
  locale: Locale;
  theme: ThemeMode;
  density: TextDensity;
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
  };
  journal: SavedReading[];
  onSetLocale: (locale: Locale) => void;
  onSetTheme: (theme: ThemeMode) => void;
  onSetDensity: (density: TextDensity) => void;
  onOpenReading: (entry: SavedReading) => void;
}

function formatDate(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SettingsPanel({
  locale,
  theme,
  density,
  copy,
  journal,
  onSetLocale,
  onSetTheme,
  onSetDensity,
  onOpenReading,
}: SettingsPanelProps) {
  return (
    <section className="panel settings-panel">
      <details className="compact-section" open>
        <summary>{copy.settingsTitle}</summary>
        <div className="toggle-group">
          <div className="toggle-row">
            <span>{copy.language}</span>
            <div className="segmented">
              <button
                className={locale === "ru" ? "is-active" : ""}
                onClick={() => onSetLocale("ru")}
                type="button"
              >
                RU
              </button>
              <button
                className={locale === "en" ? "is-active" : ""}
                onClick={() => onSetLocale("en")}
                type="button"
              >
                EN
              </button>
            </div>
          </div>

          <div className="toggle-row">
            <span>{copy.theme}</span>
            <div className="segmented">
              <button
                className={theme === "dawn" ? "is-active" : ""}
                onClick={() => onSetTheme("dawn")}
                type="button"
              >
                {copy.dawn}
              </button>
              <button
                className={theme === "night" ? "is-active" : ""}
                onClick={() => onSetTheme("night")}
                type="button"
              >
                {copy.night}
              </button>
            </div>
          </div>

          <div className="toggle-row">
            <span>{copy.density}</span>
            <div className="segmented">
              <button
                className={density === "normal" ? "is-active" : ""}
                onClick={() => onSetDensity("normal")}
                type="button"
              >
                {copy.normal}
              </button>
              <button
                className={density === "large" ? "is-active" : ""}
                onClick={() => onSetDensity("large")}
                type="button"
              >
                {copy.large}
              </button>
            </div>
          </div>
        </div>
      </details>

      <details className="compact-section">
        <summary>{copy.guidanceTitle}</summary>
        <div className="guidance-list">
          {guidanceText[locale].map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </details>

      <details className="compact-section">
        <summary>{copy.journalTitle}</summary>
        {journal.length > 0 ? (
          <div className="journal-list">
            {journal.map((entry) => (
              <article className="journal-item" key={entry.id}>
                <div className="journal-meta">
                  <p>{copy.savedAt}</p>
                  <time>{formatDate(locale, entry.createdAt)}</time>
                </div>
                <button onClick={() => onOpenReading(entry)} type="button">
                  {copy.openSaved}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="panel-copy">{copy.emptyJournal}</p>
        )}
      </details>
    </section>
  );
}
