"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Product360Viewer } from "@/components/ui/product-360-viewer";
import type { Locale } from "@/lib/types";

type ProductGalleryProps = {
  images: string[];
  title: string;
  serial: string;
  spinVideo?: string;
  locale?: Locale;
};

type LensState = {
  x: number;
  y: number;
  bgX: number;
  bgY: number;
  bgW: number;
  bgH: number;
};

export function ProductGallery({ images, title, serial, spinVideo, locale = "zh" }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [lens, setLens] = useState<LensState | null>(null);
  const [natural, setNatural] = useState({ w: 2048, h: 2048 });
  const containerRef = useRef<HTMLDivElement>(null);
  const current = images[selected] ?? images[0];

  useEffect(() => {
    setLens(null);
  }, [selected]);

  const onMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // object-cover mapping: displayed image size + crop offsets.
    const scale = Math.max(rect.width / natural.w, rect.height / natural.h);
    const dw = natural.w * scale;
    const dh = natural.h * scale;
    const ix = x - (rect.width - dw) / 2;
    const iy = y - (rect.height - dh) / 2;
    if (ix < 0 || iy < 0 || ix > dw || iy > dh) {
      setLens(null);
      return;
    }
    setLens({ x, y, bgX: -(ix * 2 - 90), bgY: -(iy * 2 - 90), bgW: dw * 2, bgH: dh * 2 });
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="relative aspect-[4/5] overflow-hidden bg-[var(--ivory)]"
        onMouseMove={onMove}
        onMouseLeave={() => setLens(null)}
      >
        <Image
          src={current}
          alt={`${serial} ${title}`}
          fill
          priority={selected === 0}
          className="object-cover"
          onLoad={(event) => {
            const img = event.currentTarget;
            if (img.naturalWidth > 0) setNatural({ w: img.naturalWidth, h: img.naturalHeight });
          }}
        />
        {lens ? (
          <div
            aria-hidden="true"
            className="magnifier-lens"
            style={{
              left: lens.x - 90,
              top: lens.y - 90,
              backgroundImage: `url(${current})`,
              backgroundSize: `${lens.bgW}px ${lens.bgH}px`,
              backgroundPosition: `${lens.bgX}px ${lens.bgY}px`,
            }}
          />
        ) : null}
        <Product360Viewer image={current} title={title} serial={serial} spinVideo={spinVideo} locale={locale} />
      </div>
      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`${serial} ${locale === "zh" ? `查看第 ${index + 1} 张图` : `View image ${index + 1}`}`}
              aria-pressed={selected === index}
              className={`focus-ring relative aspect-square overflow-hidden bg-[var(--ivory)] ${
                selected === index ? "outline outline-2 outline-black" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
