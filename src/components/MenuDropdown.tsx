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
  onToggle: () => void;
  onSelect: (section: MenuSection) => void;
  onToggleMeditativeMode: () => void;
}

const sections: MenuSection[] = ["settings", "symbols", "archive", "help"];

export function MenuDropdown({
  open,
  copy,
  meditativeMode,
  onToggle,
  onSelect,
  onToggleMeditativeMode,
}: MenuDropdownProps) {
  const labels: Record<MenuSection, string> = {
    settings: copy.settingsSection,
    symbols: copy.symbolsSection,
    archive: copy.archiveSection,
    help: copy.helpSection,
  };

  return (
    <div className={`menu-dropdown ${open ? "is-open" : ""}`}>
      <button className="ghost-action topbar-action" onClick={onToggle} type="button">
        {copy.settingsButton}
      </button>

      {open ? (
        <div className="menu-dropdown-panel">
          <button
            className="menu-dropdown-item"
            data-menu-section="meditative-toggle"
            onClick={onToggleMeditativeMode}
            type="button"
          >
            {meditativeMode ? copy.immersiveModeOff : copy.meditativeMode}
          </button>
          {sections.map((section) => (
            <button
              className="menu-dropdown-item"
              data-menu-section={section}
              key={section}
              onClick={() => onSelect(section)}
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
