import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { storySeries } from "@/lib/noirven-data";
import { localizedSeries } from "@/lib/localized-content";
import type { Locale } from "@/lib/types";
import { withLocale } from "@/lib/i18n";

function SeriesNameEmphasis({ name }: { name: string }) {
  const words = name.split(" ");
  if (words.length < 2) return <>{name}</>;
  const last = words.pop() as string;
  return (
    <>
      {words.join(" ")} <em className="italic">{last}</em>
    </>
  );
}

export function SeriesGrid({ locale = "zh" }: { locale?: Locale }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {storySeries.map((rawSeries, index) => {
        const series = localizedSeries(rawSeries, locale);

        return (
        <Link
          key={rawSeries.id}
          href={withLocale(locale, `/series#${rawSeries.id}`)}
          className="focus-ring group border-t border-black/12 py-6 transition hover:border-[var(--champagne)]"
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ash)]">
                0{index + 1} / {series.name}
              </p>
              <h3 className="mt-4 font-serif text-[var(--step-3)] font-normal text-black">{locale === "zh" ? series.zhName : <SeriesNameEmphasis name={series.name} />}</h3>
            </div>
            <span
              className="story-card-arrow mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/12 text-[var(--ash)] transition group-hover:border-black group-hover:bg-black group-hover:text-white"
              aria-hidden="true"
            >
              <ArrowUpRight size={18} strokeWidth={1.7} />
            </span>
          </div>
          <p className="mt-5 max-w-xl text-[var(--step-1)] leading-8 text-[var(--graphite)]">
            {locale === "zh" ? series.emotionalLine : series.theme}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {series.materials.slice(0, 4).map((material) => (
              <span key={material} className="border border-black/10 px-3 py-2 text-xs text-[var(--graphite)]">
                {material}
              </span>
            ))}
          </div>
        </Link>
        );
      })}
    </div>
  );
}
