import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/interactions.css";

// Clean up any existing service workers
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
      console.log("Service worker unregistered");
    });
  });
}

// Clear all caches
if ("caches" in window) {
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      caches.delete(cacheName);
      console.log("Cache deleted:", cacheName);
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
