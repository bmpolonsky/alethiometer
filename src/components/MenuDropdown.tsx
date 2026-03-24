import { appController } from "../app/services/appController";
import { uiStoreActions } from "../app/store/uiStore";
import type { MenuSection } from "../domain/types";

interface MenuDropdownProps {
  open: boolean;
  copy: {
    settingsButton: string;
    settingsSection: string;
    meditativeMode: string;
    immersiveModeOff: string;
    symbolsSection: string;
    archiveSection: string;
    helpSection: string;
  };
  meditativeMode: boolean;
}

const sections: MenuSection[] = ["settings", "symbols", "archive", "help"];

export function MenuDropdown({
  open,
  copy,
  meditativeMode,
}: MenuDropdownProps) {
  const labels: Record<MenuSection, string> = {
    settings: copy.settingsSection,
    symbols: copy.symbolsSection,
    archive: copy.archiveSection,
    help: copy.helpSection,
  };

  return (
    <div className={`menu-dropdown ${open ? "is-open" : ""}`}>
      <button
        className="ghost-action topbar-action"
        onClick={uiStoreActions.toggleMenu}
        type="button"
      >
        {copy.settingsButton}
      </button>

      {open ? (
        <div className="menu-dropdown-panel">
          <button
            className="menu-dropdown-item"
            data-menu-section="meditative-toggle"
            onClick={appController.toggleMeditativeMode}
            type="button"
          >
            {meditativeMode ? copy.immersiveModeOff : copy.meditativeMode}
          </button>
          {sections.map((section) => (
            <button
              className="menu-dropdown-item"
              data-menu-section={section}
              key={section}
              onClick={() => appController.openDrawer(section)}
              type="button"
            >
              {labels[section]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
