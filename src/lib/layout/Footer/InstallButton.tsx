"use client";

import { ArrowDownToLine } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const neverChanges = () => () => {};

function useIsIOS() {
  return useSyncExternalStore(
    neverChanges,
    () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window),
    () => false,
  );
}

function useIsStandalone() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(display-mode: standalone)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS before 16.4 never matches the display-mode query.
      ("standalone" in navigator && navigator.standalone === true),
    () => false,
  );
}

const InstallButton = () => {
  const isIOS = useIsIOS();
  const isStandalone = useIsStandalone();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    function onAppInstalled() {
      setInstallEvent(null);
      setIsInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (!isHintOpen) {
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsHintOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isHintOpen]);

  async function install() {
    if (!installEvent) {
      return;
    }
    await installEvent.prompt();
    await installEvent.userChoice;
    // The event is single-use: the browser fires a fresh one on a later visit.
    setInstallEvent(null);
  }

  if (isStandalone || isInstalled) {
    return null; // Don't show install button if already installed
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        type="button"
        onClick={isIOS ? () => setIsHintOpen((open) => !open) : install}
        aria-label="Install app"
        aria-expanded={isIOS ? isHintOpen : undefined}
        className="flex text-slate-400 transition-colors hover:text-slate-200!"
      >
        <ArrowDownToLine size={16} aria-hidden="true" />
      </button>

      {isHintOpen && (
        <p className="absolute right-0 bottom-full mb-2 w-56 rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs leading-relaxed text-slate-300 shadow-lg">
          To install, tap the share button
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
          and then &quot;Add to Home Screen&quot;
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}
    </div>
  );
};

export default InstallButton;
