export async function registerPwaServiceWorker() {
  const setViewportHeight = () => {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`,
    );
  };

  const syncStandaloneClass = () => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: window-controls-overlay)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    document.documentElement.classList.toggle("pwa-standalone", isStandalone);
    document.body.classList.toggle("pwa-standalone", isStandalone);
  };

  setViewportHeight();
  syncStandaloneClass();

  window.addEventListener("resize", setViewportHeight, { passive: true });
  window.addEventListener("orientationchange", setViewportHeight);

  const standaloneMediaQuery = window.matchMedia("(display-mode: standalone)");
  standaloneMediaQuery.addEventListener?.("change", syncStandaloneClass);

  if (import.meta.env.DEV) {
    return null;
  }

  if (
    !("serviceWorker" in navigator) ||
    (!window.isSecureContext && window.location.hostname !== "localhost")
  ) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js",
      {
        scope: "/",
      },
    );

    let hasReloadedForUpdate = false;

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          newWorker.postMessage({ type: "SKIP_WAITING" });
        }
      });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (hasReloadedForUpdate) {
        return;
      }

      hasReloadedForUpdate = true;
      window.location.reload();
    });

    return registration;
  } catch (error) {
    console.error("Service worker registration failed:", error);
    return null;
  }
}
