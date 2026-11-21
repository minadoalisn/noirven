"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nvonly-theme";

/**
 * Invert color switch (SANTAL). Default is light; the choice persists in
 * localStorage. It flips CSS tokens only (data-theme on <html>), never a
 * filter, so product photos keep their true colors. The root layout runs
 * a tiny inline script before paint so a saved dark choice never flashes.
 */
export function InvertToggle({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "dark") {
        document.documentElement.dataset.theme = "dark";
        setDark(true);
      }
    } catch {
      /* storage unavailable: stay light */
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.dataset.theme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* storage unavailable: session-only */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={locale === "zh" ? "切换反色" : "Invert colors"}
      className="focus-ring fixed bottom-6 left-6 z-50 inline-flex h-10 items-center gap-2 border border-black/15 bg-[rgba(251,250,246,0.92)] px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-black shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur transition hover:border-black/30"
    >
      <span aria-hidden="true">{dark ? "◐" : "◑"}</span>
      <span>{locale === "zh" ? (dark ? "浅色" : "反色") : dark ? "Light" : "Invert"}</span>
    </button>
  );
}
