"use client";

import Image from "next/image";
import { useState } from "react";
import { Product360Viewer } from "@/components/ui/product-360-viewer";
import type { Locale } from "@/lib/types";

type ProductGalleryProps = {
  images: string[];
  title: string;
  serial: string;
  spinVideo?: string;
  locale?: Locale;
};

export function ProductGallery({ images, title, serial, spinVideo, locale = "zh" }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];
  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ivory)]">
        <Image src={current} alt={`${serial} ${title}`} fill priority={selected === 0} className="object-cover" />
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
