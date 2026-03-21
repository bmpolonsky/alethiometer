import { useEffect, useRef } from "react";
import { MenuDropdown } from "../components/MenuDropdown";
import { uiText } from "../domain/uiText";
import { appController } from "./services/appController";
import { preferencesStore } from "./store/preferencesStore";
import { uiStore, uiStoreActions } from "./store/uiStore";
import { useStore } from "./store/useStore";

export function AppHeader() {
  const { locale, meditativeMode } = useStore(preferencesStore);
  const { menuExpanded } = useStore(uiStore);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const copy = uiText[locale];

  useEffect(() => {
    if (!menuExpanded) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        uiStoreActions.setMenuExpanded(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [menuExpanded]);

  return (
    <header className={`topbar ${meditativeMode ? "is-meditative" : ""}`}>
      {meditativeMode ? null : <h1 className="topbar-title">ALETHIOMETER</h1>}
      <div ref={menuRef}>
        <MenuDropdown
          copy={copy}
          meditativeMode={meditativeMode}
          onSelect={appController.openDrawer}
          onToggle={uiStoreActions.toggleMenu}
          onToggleMeditativeMode={appController.toggleMeditativeMode}
          open={menuExpanded}
        />
      </div>
    </header>
  );
}
