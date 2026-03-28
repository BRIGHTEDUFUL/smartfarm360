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
  installApp: () => Promise<boolean>;
}

const PwaContext = createContext<PwaContextValue | undefined>(undefined);

const isStandaloneDisplay = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

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

  const value = useMemo(
    () => ({
      isSupported:
        "serviceWorker" in navigator &&
        window.isSecureContext &&
        !isStandaloneDisplay(),
      isInstallable,
      isInstalled,
      isInstalling,
      canInstall: isInstallable && !isInstalled,
      installApp,
    }),
    [installApp, isInstallable, isInstalled, isInstalling],
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
