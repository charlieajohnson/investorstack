"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("investorstack-theme-change", callback);
  return () => window.removeEventListener("investorstack-theme-change", callback);
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => false);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("investorstack-theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("investorstack-theme-change"));
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label={dark ? "Use light theme" : "Use dark theme"} suppressHydrationWarning>
      {dark ? <Sun aria-hidden="true" size={16} strokeWidth={1.6} /> : <Moon aria-hidden="true" size={16} strokeWidth={1.6} />}
    </button>
  );
}
