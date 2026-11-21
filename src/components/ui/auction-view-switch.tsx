"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const STORAGE_KEY = "nvonly-view";

export type AuctionView = "grid" | "list" | "gallery";

type AuctionViewSwitchProps = {
  basePath: string;
  /** Query string without the view param, e.g. "series=still-here&q=N-05". */
  queryString: string;
  currentView: AuctionView;
  /** True when the URL already carries a view param. */
  viewInUrl: boolean;
  locale?: "zh" | "en";
};

const VIEWS: { id: AuctionView; zh: string; en: string }[] = [
  { id: "grid", zh: "网格", en: "Grid" },
  { id: "list", zh: "列表", en: "List" },
  { id: "gallery", zh: "画廊", en: "Gallery" },
];

/**
 * Grid / list / gallery switch. The choice persists in localStorage and is
 * restored on the next visit when the URL carries no view param.
 */
export function AuctionViewSwitch({ basePath, queryString, currentView, viewInUrl, locale = "zh" }: AuctionViewSwitchProps) {
  const router = useRouter();

  useEffect(() => {
    if (viewInUrl) return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (stored && stored !== currentView && (stored === "grid" || stored === "list" || stored === "gallery")) {
      const next = queryString ? `${basePath}?${queryString}&view=${stored}` : `${basePath}?view=${stored}`;
      router.replace(next);
    }
  }, [viewInUrl, currentView, queryString, basePath, router]);

  return (
    <div role="group" aria-label={locale === "zh" ? "视图切换" : "Switch view"} className="inline-flex border border-black/20">
      {VIEWS.map((view) => {
        const href = queryString ? `${basePath}?${queryString}&view=${view.id}` : `${basePath}?view=${view.id}`;
        const active = view.id === currentView;
        return (
          <Link
            key={view.id}
            href={href}
            aria-current={active ? "true" : undefined}
            onClick={() => {
              try {
                localStorage.setItem(STORAGE_KEY, view.id);
              } catch {
                /* storage unavailable */
              }
            }}
            className={`focus-ring px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition ${
              active ? "bg-black text-white" : "text-black hover:bg-black/5"
            }`}
          >
            {locale === "zh" ? view.zh : view.en}
          </Link>
        );
      })}
    </div>
  );
}
