import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface PwaContextValue {
  isSupported: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  canInstall: boolean;
  installHint: {
    title: string;
    detail: string;
  };
  installApp: () => Promise<boolean>;
}

const PwaContext = createContext<PwaContextValue | undefined>(undefined);

const isStandaloneDisplay = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

const getInstallHint = ({
  isInstalled,
  isInstallable,
  isSupported,
}: {
  isInstalled: boolean;
  isInstallable: boolean;
  isSupported: boolean;
}) => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent);
  const isSafari =
    /safari/.test(userAgent) &&
    !/chrome|crios|crmo|edg|edge|fxios/.test(userAgent);

  if (isInstalled) {
    return {
      title: "App already installed",
      detail: "Open Smart Farming 360 from your home screen or app launcher.",
    };
  }

  if (isInstallable) {
    return {
      title: "Install is ready",
      detail: "Use the install button to add Smart Farming 360 to your device.",
    };
  }

  if (isIos && isSafari) {
    return {
      title: "Add it from Safari",
      detail:
        "Tap Share in Safari, then choose Add to Home Screen for the best iPhone or iPad install experience.",
    };
  }

  if (isIos) {
    return {
      title: "Open this in Safari to install",
      detail:
        "iPhone and iPad installation is supported through Safari's Share menu.",
    };
  }

  if (isSupported) {
    return {
      title: "Install prompt not available yet",
      detail:
        "Browse the app for a moment, then try again from the install button or your browser menu.",
    };
  }

  return {
    title: "Install works best in a supported secure browser",
    detail:
      "Open the live HTTPS app in Chrome, Edge, or Safari to install Smart Farming 360.",
  };
};

export const PwaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const updateInstalledState = () => setIsInstalled(isStandaloneDisplay());

    updateInstalledState();

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
      setIsInstalling(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener?.("change", updateInstalledState);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window
        .matchMedia("(display-mode: standalone)")
        .removeEventListener?.("change", updateInstalledState);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (!deferredPrompt || isInstalled) {
      return false;
    }

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      const accepted = choice.outcome === "accepted";

      if (accepted) {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }

      return accepted;
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt, isInstalled]);

  const isSupported =
    "serviceWorker" in navigator &&
    window.isSecureContext &&
    !isStandaloneDisplay();

  const value = useMemo(
    () => ({
      isSupported,
      isInstallable,
      isInstalled,
      isInstalling,
      canInstall: isInstallable && !isInstalled,
      installHint: getInstallHint({
        isInstalled,
        isInstallable,
        isSupported,
      }),
      installApp,
    }),
    [installApp, isInstallable, isInstalled, isInstalling, isSupported],
  );

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
};

export const usePwa = () => {
  const context = useContext(PwaContext);

  if (!context) {
    throw new Error("usePwa must be used within PwaProvider");
  }

  return context;
};
