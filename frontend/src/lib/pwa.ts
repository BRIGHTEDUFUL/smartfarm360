export async function registerPwaServiceWorker() {
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
    const registration = await navigator.serviceWorker.register("/service-worker.js", {
      scope: "/",
    });

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
      window.location.reload();
    });

    return registration;
  } catch (error) {
    console.error("Service worker registration failed:", error);
    return null;
  }
}
