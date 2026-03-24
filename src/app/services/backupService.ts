import { saveState, sanitizeImportedState } from "../../domain/storage";
import type { PersistedState } from "../../domain/types";
import { buildPersistedSnapshot, replacePersistedSnapshot } from "./persistenceService";
import { preferencesStore } from "../store/preferencesStore";

interface ExportedBackup {
  format: "alethiometer-backup";
  version: 1;
  exportedAt: string;
  state: PersistedState;
}

function createBackupFilename() {
  const isoDate = new Date().toISOString().slice(0, 10);

  return `alethiometer-backup-${isoDate}.json`;
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

class BackupService {
  exportData = () => {
    const backup: ExportedBackup = {
      format: "alethiometer-backup",
      version: 1,
      exportedAt: new Date().toISOString(),
      state: buildPersistedSnapshot(),
    };

    downloadTextFile(
      createBackupFilename(),
      `${JSON.stringify(backup, null, 2)}\n`,
    );
  };

  importData = async (file: File) => {
    const text = await file.text();
    const fallbackLocale = preferencesStore.getState().locale;
    const nextState = sanitizeImportedState(JSON.parse(text), fallbackLocale);

    replacePersistedSnapshot(nextState);
    saveState(nextState);
  };
}

export const backupService = new BackupService();
