"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STORAGE_KEY = "nvonly-collection";
const CHANGE_EVENT = "nvonly-collection-changed";

export function readCollection(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function toggleCollection(slug: string): boolean {
  const current = readCollection();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: session-only */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return next.includes(slug);
}

type CollectionButtonProps = {
  slug: string;
  locale?: "zh" | "en";
};

/** Save / remove one piece in the visitor's own collection room (local only). */
export function CollectionButton({ slug, locale = "zh" }: CollectionButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readCollection().includes(slug));
    const sync = () => setSaved(readCollection().includes(slug));
    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, [slug]);

  return (
    <button
      type="button"
      onClick={() => setSaved(toggleCollection(slug))}
      aria-pressed={saved}
      className="focus-ring inline-flex h-11 items-center justify-center gap-2 border border-black/20 px-5 font-mono text-[11px] uppercase tracking-[0.16em] transition hover:border-black"
    >
      <span aria-hidden="true">{saved ? "♥" : "♡"}</span>
      {locale === "zh" ? (saved ? "已收入藏品室" : "收入藏品室") : saved ? "Saved to collection" : "Save to collection"}
    </button>
  );
}

export type CollectionItem = {
  slug: string;
  title: string;
  serial: string;
  image: string;
  price: string;
  href: string;
};

type CollectionStripProps = {
  items: CollectionItem[];
  locale?: "zh" | "en";
};

/** The visitor's saved pieces, shown on /auctions. Local only, removable. */
export function CollectionStrip({ items, locale = "zh" }: CollectionStripProps) {
  const [slugs, setSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    const sync = () => setSlugs(readCollection());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, []);

  if (!slugs || slugs.length === 0) return null;
  const saved = slugs
    .map((slug) => items.find((item) => item.slug === slug))
    .filter((item): item is CollectionItem => Boolean(item));
  if (saved.length === 0) return null;

  return (
    <section aria-label={locale === "zh" ? "我的藏品室" : "My collection room"} className="mt-10 border border-black/15 bg-[rgba(251,250,246,0.7)] p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-xl md:text-2xl">{locale === "zh" ? "我的藏品室" : "My collection room"}</h2>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">
          {locale === "zh" ? `${saved.length} 件 · 仅保存在本设备` : `${saved.length} saved · this device only`}
        </p>
      </div>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((item) => (
          <li key={item.slug} className="flex items-center gap-4 border border-black/10 bg-[var(--porcelain)] p-3">
            <a href={item.href} className="relative h-16 w-16 shrink-0 overflow-hidden bg-[var(--ivory)]" aria-label={item.title}>
              <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
            </a>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base leading-snug">{item.title}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ash)]">
                {item.serial} · {item.price}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleCollection(item.slug)}
              aria-label={locale === "zh" ? `从藏品室移除 ${item.title}` : `Remove ${item.title} from collection`}
              className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center border border-black/15 text-base transition hover:border-black"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
