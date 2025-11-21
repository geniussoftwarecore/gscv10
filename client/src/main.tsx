import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeLanguage } from "./i18n/lang";
import { initWebVitals, initErrorTracking, initPerformanceObserver } from "./lib/web-vitals";
import { preloadCriticalResources, setupPreloadOnInteraction } from "./lib/preload";

// Initialize language before React renders to prevent FOUC
initializeLanguage();

// Initialize performance monitoring
initWebVitals();
initErrorTracking();
initPerformanceObserver();

// Setup resource preloading
preloadCriticalResources();
setupPreloadOnInteraction();

createRoot(document.getElementById("root")!).render(<App />);
