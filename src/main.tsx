import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { initializePersistence } from "./app/services/persistenceService";
import "./styles.css";

initializePersistence();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
