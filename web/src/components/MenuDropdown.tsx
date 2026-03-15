import type { MenuSection } from "../domain/types";

interface MenuDropdownProps {
  open: boolean;
  copy: {
    settingsButton: string;
    settingsSection: string;
    symbolsSection: string;
    archiveSection: string;
    helpSection: string;
  };
  onToggle: () => void;
  onSelect: (section: MenuSection) => void;
}

const sections: MenuSection[] = ["settings", "symbols", "archive", "help"];

export function MenuDropdown({
  open,
  copy,
  onToggle,
  onSelect,
}: MenuDropdownProps) {
  const labels: Record<MenuSection, string> = {
    settings: copy.settingsSection,
    symbols: copy.symbolsSection,
    archive: copy.archiveSection,
    help: copy.helpSection,
    lexicon: "",
  };

  return (
    <div className={`menu-dropdown ${open ? "is-open" : ""}`}>
      <button className="ghost-action topbar-action" onClick={onToggle} type="button">
        {copy.settingsButton}
      </button>

      {open ? (
        <div className="menu-dropdown-panel">
          {sections.map((section) => (
            <button
              className="menu-dropdown-item"
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
