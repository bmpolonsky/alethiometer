import { AppHeader } from "./AppHeader";
import { AppOverlays } from "./AppOverlays";
import { AppWorkspace } from "./AppWorkspace";

export function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <AppWorkspace />
      <AppOverlays />
    </div>
  );
}
