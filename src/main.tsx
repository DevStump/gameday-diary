
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { preloadTeamLogos } from "./utils/logoPreloader";

// Preload logos when the app starts
preloadTeamLogos();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
